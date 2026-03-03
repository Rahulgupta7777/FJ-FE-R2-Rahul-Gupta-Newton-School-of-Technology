'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Car, Loader2 } from 'lucide-react';

type LoginStep = 'IDENTIFIER' | 'PHONE' | 'OTP' | 'PROFILE';

export default function LoginPage() {
    const router = useRouter();

    // State
    const [step, setStep] = useState<LoginStep>('IDENTIFIER');
    const [isLoading, setIsLoading] = useState(false);

    // Form Data
    const [identifier, setIdentifier] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Helpers
    const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isValidPhone = (val: string) => /^\+?[\d\s-]{10,15}$/.test(val);

    // Handlers
    const handleIdentifierSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier) return;

        setIsLoading(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));
        setIsLoading(false);

        if (isEmail(identifier)) {
            setStep('PHONE'); // Needs phone number next
        } else {
            setPhone(identifier); // Assume it's a phone number
            setStep('OTP');
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone || !isValidPhone(phone)) return;

        setIsLoading(true);
        await new Promise(r => setTimeout(r, 600));
        setIsLoading(false);

        setStep('OTP');
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) return;

        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setIsLoading(false);

        setStep('PROFILE');
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName) return;

        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));

        // Generate dummy JWT
        const dummyToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ name: firstName, iat: Date.now() }))}.dummy-signature`;

        // Save auth state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authToken', dummyToken);
        localStorage.setItem('user_name', `${firstName} ${lastName}`.trim());

        setIsLoading(false);
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white relative overflow-hidden font-sans">
            {/* Left/Main Side: Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10 bg-white">
                <div className="w-full max-w-[440px]">
                    {/* Brand Logo for Mobile */}
                    <div className="md:hidden flex flex-col items-center mb-10">
                        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-3">
                            <span className="text-white font-black text-2xl">R</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase">RideShare</h1>
                    </div>

                    <Card className="w-full shadow-2xl rounded-3xl border border-slate-100 overflow-hidden bg-white">

                        {/* Step 1: Identifier (Email/Phone) */}
                        {step === 'IDENTIFIER' && (
                            <form onSubmit={handleIdentifierSubmit}>
                                <CardHeader className="pt-10 pb-6 px-8 flex flex-col items-center text-center">
                                    <CardTitle className="text-3xl font-extrabold text-slate-900 mb-2">Ride with Freedom</CardTitle>
                                    <CardDescription className="text-base text-slate-500 font-medium leading-relaxed max-w-[300px]">
                                        Sign in to start your journey with the world's most reliable ride-sharing app.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="px-8 pb-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Input
                                                type="text"
                                                placeholder="name@example.com or +1 234 567 8900"
                                                value={identifier}
                                                onChange={(e) => setIdentifier(e.target.value)}
                                                className="h-[52px] text-base rounded-xl border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 shadow-sm"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="px-8 pb-8 pt-0">
                                    <Button type="submit" className="w-full h-[52px] text-lg font-medium rounded-xl bg-[#878787] hover:bg-[#737373] text-white shadow-none transition-colors" disabled={!identifier || isLoading}>
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}

                        {/* Step 2: Phone Collection (If Email was used) */}
                        {step === 'PHONE' && (
                            <form onSubmit={handlePhoneSubmit}>
                                <CardHeader>
                                    <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-white/20 hover:text-white" onClick={() => setStep('IDENTIFIER')}>
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    <CardTitle className="text-2xl relative z-10">Add Phone Number</CardTitle>
                                    <CardDescription>We need your number to keep your account secure and for drivers to contact you.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="h-12 text-lg"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={!phone || isLoading}>
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Code'}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}

                        {/* Step 3: OTP */}
                        {step === 'OTP' && (
                            <form onSubmit={handleOtpSubmit}>
                                <CardHeader>
                                    <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-white/20 hover:text-white" onClick={() => setStep(isEmail(identifier) ? 'PHONE' : 'IDENTIFIER')}>
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    <CardTitle className="text-2xl">Verify your number</CardTitle>
                                    <CardDescription>We sent a 6-digit code to <br /><span className="font-semibold text-slate-900">{phone}</span></CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-center py-6">
                                    <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={0} className="w-12 h-14 text-xl border rounded-md" />
                                            <InputOTPSlot index={1} className="w-12 h-14 text-xl border rounded-md" />
                                            <InputOTPSlot index={2} className="w-12 h-14 text-xl border rounded-md" />
                                            <InputOTPSlot index={3} className="w-12 h-14 text-xl border rounded-md" />
                                            <InputOTPSlot index={4} className="w-12 h-14 text-xl border rounded-md" />
                                            <InputOTPSlot index={5} className="w-12 h-14 text-xl border rounded-md" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={otp.length !== 6 || isLoading}>
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}

                        {/* Profile Step needs similar card styling fix */}
                        {step === 'PROFILE' && (
                            <form onSubmit={handleProfileSubmit}>
                                <div className="bg-slate-50 py-10 flex flex-col items-center justify-center border-b border-slate-100">
                                    <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-3">
                                        <span className="text-white font-bold text-2xl">R</span>
                                    </div>
                                    <h1 className="text-2xl font-black tracking-tight uppercase">RideShare</h1>
                                </div>
                                <CardHeader className="pt-8 pb-4">
                                    <CardTitle className="text-2xl font-extrabold">Create your profile</CardTitle>
                                    <CardDescription className="text-slate-500 font-medium text-base">Just a few details to get you moving</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="firstName" className="text-base font-semibold">First Name</Label>
                                            <Input
                                                id="firstName"
                                                type="text"
                                                placeholder="e.g. Rahul"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="h-12 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-colors"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="lastName" className="text-base font-semibold text-slate-600">Last Name <span className="text-slate-400 font-normal">(Optional)</span></Label>
                                            <Input
                                                id="lastName"
                                                type="text"
                                                placeholder="e.g. Gupta"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="h-12 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col gap-4 pb-10">
                                    <Button type="submit" className="w-full h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-100" disabled={!firstName || isLoading}>
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Riding'}
                                    </Button>
                                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                                        By proceeding, you agree to our <a href="#" className="font-bold text-slate-800 hover:underline">Terms</a> and <a href="#" className="font-bold text-slate-800 hover:underline">Privacy</a>.
                                    </p>
                                </CardFooter>
                            </form>
                        )}
                    </Card>
                </div>

                <div className="mt-8 text-center px-4">
                    <p className="text-sm text-slate-400 font-medium">
                        Secure login powered by RideShare Inc.
                    </p>
                </div>
            </div>

            {/* Right/Hero Side: Visuals */}
            <div className="hidden md:flex flex-1 relative bg-black overflow-hidden">
                <Image
                    src="/hero.gif"
                    alt="RideShare Hero"
                    fill
                    className="object-cover opacity-90 scale-105"
                    priority
                />

                {/* Visual Polish: Darker Gradient for better text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent"></div>

                {/* Overlay Text */}
                <div className="absolute inset-0 flex flex-col items-start justify-end p-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
                        <h2 className="text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                            Experience the future of <span className="text-blue-500">Reliability.</span>
                        </h2>
                        <div className="flex gap-16 pt-4">
                            <div>
                                <div className="text-white text-4xl font-black mb-1">5 min</div>
                                <div className="text-blue-400 text-sm font-bold uppercase tracking-[0.2em]">Avg. Pickup</div>
                            </div>
                            <div>
                                <div className="text-white text-4xl font-black mb-1">24/7</div>
                                <div className="text-blue-400 text-sm font-bold uppercase tracking-[0.2em]">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
