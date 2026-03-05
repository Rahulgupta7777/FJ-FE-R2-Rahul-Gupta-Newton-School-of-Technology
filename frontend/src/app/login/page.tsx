'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Loader2, KeyRound, UserPlus, Fingerprint, ShieldCheck } from 'lucide-react';

type LoginStep = 'IDENTIFIER' | 'OTP' | 'AUTH_CHOICE' | 'PASSWORD' | 'PROFILE';

export default function LoginPage() {
    const router = useRouter();

    // State
    const [step, setStep] = useState<LoginStep>('IDENTIFIER');
    const [isLoading, setIsLoading] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [error, setError] = useState('');

    // Form Data
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Helpers
    const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    // Handlers
    const handleIdentifierSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier) return;

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            try {
                const users = JSON.parse(localStorage.getItem('nexride_users') || '[]');
                const existingUser = users.find((u: any) => u.identifier === identifier);

                setUserExists(!!existingUser);
                if (existingUser) {
                    setStep('AUTH_CHOICE');
                } else {
                    setStep('OTP');
                }
            } catch (err: any) {
                setError('Local storage error.');
            } finally {
                setIsLoading(false);
            }
        }, 600);
    };

    const handleOtpVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (otp.length !== 6) return;

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            if (otp === '123456') {
                setIsLoading(false);
                if (userExists) {
                    // Returning User: Log in directly after OTP verification
                    const users = JSON.parse(localStorage.getItem('nexride_users') || '[]');
                    const user = users.find((u: any) => u.identifier === identifier);

                    document.cookie = `authToken=local_jwt_${Math.random().toString(36).substring(7)}; path=/; max-age=3600`;
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('user_name', user ? `${user.firstName} ${user.lastName}`.trim() : identifier.split('@')[0]);
                    router.push('/');
                } else {
                    // New User: Proceed to Profile Setup
                    setStep('PROFILE');
                }
            } else {
                setError('Invalid verification code. Try "123456"');
                setOtp('');
                setIsLoading(false);
            }
        }, 500);
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        setIsLoading(true);
        setError('');

        setTimeout(() => {
            try {
                const users = JSON.parse(localStorage.getItem('nexride_users') || '[]');
                const user = users.find((u: any) => u.identifier === identifier);

                if (user && user.password === password) {
                    document.cookie = `authToken=local_jwt_${Math.random().toString(36).substring(7)}; path=/; max-age=3600`;
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('user_name', `${user.firstName} ${user.lastName}`.trim());
                    router.push('/');
                } else {
                    setError('Invalid password. Please try again.');
                }
            } catch (err: any) {
                setError('Login failed locally.');
            } finally {
                setIsLoading(false);
            }
        }, 800);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError('');
        if (!firstName) {
            setError('First name is required');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            try {
                const users = JSON.parse(localStorage.getItem('nexride_users') || '[]');

                const newUser = {
                    identifier,
                    firstName,
                    lastName,
                    password,
                    id: Date.now()
                };

                users.push(newUser);
                localStorage.setItem('nexride_users', JSON.stringify(users));

                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('authToken', 'local_jwt_' + Math.random().toString(36).substring(7));
                localStorage.setItem('user_name', `${firstName} ${lastName}`.trim());
                router.push('/');
            } catch (err: any) {
                setError('Registration failed locally.');
            } finally {
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-black relative overflow-hidden font-sans">
            {/* Left Side: Auth Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10 bg-white dark:bg-black">
                <div className="w-full max-w-[440px]">

                    {/* Brand Logo for Mobile */}
                    <div className="md:hidden flex flex-col items-center mb-10">
                        <img src="/e66735a8-370d-4668-b6b8-11a487bcd3cc" alt="NexRide Logo" className="h-16 w-auto mb-3 object-contain dark:invert rounded-xl" />
                        <h1 className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">NexRide</h1>
                    </div>

                    <Card className="w-full shadow-2xl rounded-[48px] border-0 overflow-hidden glass transition-all duration-500 ease-in-out">
                        {error && (
                            <div className="absolute top-0 left-0 w-full bg-red-500/10 backdrop-blur-md text-red-500 text-xs py-3 px-6 text-center border-b border-red-500/20 z-50 animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="p-2">
                            {/* Step 1: Identifier */}
                            {step === 'IDENTIFIER' && (
                                <form onSubmit={handleIdentifierSubmit}>
                                    <CardHeader className="pt-12 pb-8 px-10 flex flex-col items-center text-center">
                                        <div className="mb-6">
                                            <img src="/e66735a8-370d-4668-b6b8-11a487bcd3cc" alt="NexRide Logo" className="h-20 w-auto object-contain dark:invert rounded-2xl" />
                                        </div>
                                        <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Welcome to NexRide</CardTitle>
                                        <CardDescription className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            Experience the future of ride-sharing
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-10 pb-8 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="identifier" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Enter your email or phone number</Label>
                                            <Input
                                                id="identifier"
                                                type="text"
                                                placeholder="name@example.com or +91 9821456789..."
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                className="h-[56px] text-lg rounded-2xl border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white shadow-none transition-all"
                                                autoFocus
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-10 pb-12">
                                        <Button type="submit" className="w-full h-[56px] text-lg font-bold rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 premium-shadow transition-all active:scale-[0.98]" disabled={!identifier || isLoading}>
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Continue'}
                                        </Button>
                                    </CardFooter>
                                </form>
                            )}

                            {/* Step 2: OTP */}
                            {step === 'OTP' && (
                                <form onSubmit={handleOtpVerify}>
                                    <CardHeader className="pt-12 pb-8 px-10 relative">
                                        <Button variant="ghost" size="icon" className="absolute top-8 left-8 hover:bg-slate-100 rounded-full" onClick={() => setStep('IDENTIFIER')}>
                                            <ArrowLeft className="w-5 h-5" />
                                        </Button>
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl flex items-center justify-center mb-6 text-black dark:text-white border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 text-center">Verify Identity</CardTitle>
                                            <CardDescription className="text-center dark:text-slate-400">A 6-digit code has been sent to your device. Enter code <span className="text-black dark:text-white font-bold">123456</span> to proceed.</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex justify-center items-center py-10 px-6 sm:px-10">
                                        <div className="w-full flex justify-center">
                                            <InputOTP
                                                maxLength={6}
                                                value={otp}
                                                onChange={setOtp}
                                                autoFocus
                                                onComplete={() => handleOtpVerify()}
                                            >
                                                <InputOTPGroup className="flex gap-3 justify-center">
                                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                                        <InputOTPSlot
                                                            key={i}
                                                            index={i}
                                                            className="
              w-12 h-14
              text-xl font-bold
              rounded-xl
              border border-slate-300
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-white
              focus:border-black
              dark:focus:border-white
              transition
            "
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-10 pb-12">
                                        <Button type="submit" className="w-full h-[56px] text-lg font-bold rounded-2xl bg-black dark:bg-white text-white dark:text-black transition-all active:scale-[0.98] premium-shadow" disabled={otp.length !== 6 || isLoading}>
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Account'}
                                        </Button>
                                    </CardFooter>
                                </form>
                            )}

                            {/* Step 3: Auth Choice (Returning User - Welcome Back) */}
                            {step === 'AUTH_CHOICE' && (
                                <div className="p-10 text-center animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 shadow-md ring-8 ring-slate-50 dark:ring-slate-900/50 transition-transform hover:scale-110">
                                        <KeyRound className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-4xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 font-medium px-4">Choose how you'd like to sign in to your account.</p>

                                    <div className="space-y-4 px-2">
                                        <Button
                                            onClick={() => setStep('PASSWORD')}
                                            className="w-full h-[72px] text-xl font-bold rounded-[24px] bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 flex items-center justify-center gap-4 shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98]"
                                        >
                                            <KeyRound className="w-6 h-6" /> Sign in with Password
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setStep('OTP'); // Go to OTP step but for returning user
                                            }}
                                            className="w-full h-[72px] text-xl font-bold rounded-[24px] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-transparent text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
                                        >
                                            <ShieldCheck className="w-6 h-6" /> Continue with OTP
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Password (Returning User) */}
                            {step === 'PASSWORD' && (
                                <form onSubmit={handleLoginSubmit}>
                                    <CardHeader className="pt-12 pb-8 px-10 relative">
                                        <Button variant="ghost" size="icon" className="absolute top-8 left-8" onClick={() => setStep('AUTH_CHOICE')}>
                                            <ArrowLeft className="w-5 h-5" />
                                        </Button>
                                        <div className="flex flex-col items-center text-center">
                                            <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Enter Password</CardTitle>
                                            <CardDescription className="dark:text-slate-400">Enter the password associated with your account.</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-10 pb-8 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pass" className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Account Password</Label>
                                            <Input
                                                id="pass"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="h-[56px] text-lg rounded-2xl border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white shadow-none transition-all"
                                                autoFocus
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-10 pb-12">
                                        <Button type="submit" className="w-full h-[56px] text-lg font-bold rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 transition-all active:scale-[0.98]" disabled={!password || isLoading}>
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Log In'}
                                        </Button>
                                    </CardFooter>
                                </form>
                            )}

                            {/* Step 5: Profile (New User) */}
                            {step === 'PROFILE' && (
                                <form onSubmit={handleRegisterSubmit}>
                                    <CardHeader className="pt-12 pb-8 px-10 relative">
                                        <Button variant="ghost" size="icon" className="absolute top-8 left-8" onClick={() => setStep('IDENTIFIER')}>
                                            <ArrowLeft className="w-5 h-5" />
                                        </Button>
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl flex items-center justify-center mb-6 text-black dark:text-white border border-slate-100 dark:border-slate-800 shadow-sm">
                                                <UserPlus className="w-6 h-6" />
                                            </div>
                                            <CardTitle className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Create Profile</CardTitle>
                                            <CardDescription className="dark:text-slate-400">Join NexRide and start traveling reliably.</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-10 pb-8 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">First Name</Label>
                                                <Input placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-[50px] rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Last Name</Label>
                                                <Input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-[50px] rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Choose Password</Label>
                                                <Input
                                                    type="password"
                                                    placeholder="Minimum 8 characters"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="h-[56px] text-lg rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Confirm Password</Label>
                                                <Input
                                                    type="password"
                                                    placeholder="Repeat password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="h-[56px] text-lg rounded-xl dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-10 pb-12">
                                        <Button
                                            type="submit"
                                            className="w-full h-[56px] text-lg font-bold rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 transition-all active:scale-[0.98] premium-shadow"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Set up Account'}
                                        </Button>
                                    </CardFooter>
                                </form>
                            )}
                        </div>
                    </Card>

                    <p className="mt-10 text-center text-sm text-slate-400 font-medium">
                        Secure login powered by NexRide Inc.
                    </p>
                </div>
            </div>

            {/* Right Side: Visuals */}
            <div className="hidden md:flex flex-1 relative bg-black overflow-hidden items-center justify-center">
                <Image src="/hero.gif" alt="Hero" fill className="object-cover opacity-60 scale-105" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="relative z-10 text-center p-12 max-w-xl animate-in slide-in-from-bottom-10 duration-700">
                    <h2 className="text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                        RELIABILITY AT YOUR <span className="text-slate-400 italic">FINGERTIPS.</span>
                    </h2>
                    <p className="text-slate-300 text-xl font-medium max-w-md mx-auto">
                        Join millions of riders who trust our world-class safety and speed.
                    </p>
                </div>
            </div>
        </div>
    );
}
