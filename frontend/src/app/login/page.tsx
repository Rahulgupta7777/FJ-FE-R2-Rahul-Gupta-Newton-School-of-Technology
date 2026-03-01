'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    const [agreedToTerms, setAgreedToTerms] = useState(false);

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
        if (!firstName || !agreedToTerms) return;

        setIsLoading(true);
        await new Promise(r => setTimeout(r, 800));

        // Save auth state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', `${firstName} ${lastName}`.trim());

        setIsLoading(false);
        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">

                {/* Brand Header */}
                <div className="bg-black text-white p-6 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-black font-black text-xl">R</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">RideShare</h1>
                </div>

                {/* Step 1: Identifier (Email/Phone) */}
                {step === 'IDENTIFIER' && (
                    <form onSubmit={handleIdentifierSubmit}>
                        <CardHeader>
                            <CardTitle className="text-2xl">Welcome</CardTitle>
                            <CardDescription>Enter your phone number or email to continue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="name@example.com or +1 234 567 8900"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="h-12 text-lg"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={!identifier || isLoading}>
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

                {/* Step 4: Profile */}
                {step === 'PROFILE' && (
                    <form onSubmit={handleProfileSubmit}>
                        <CardHeader>
                            <CardTitle className="text-2xl">Create your profile</CardTitle>
                            <CardDescription>Just a few details to get you moving</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="e.g. Rahul"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="h-12"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name <span className="text-slate-400 font-normal">(Optional)</span></Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="e.g. Gupta"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="h-12"
                                    />
                                </div>
                                <div className="flex items-start space-x-3 pt-4">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                    <Label htmlFor="terms" className="text-sm font-normal text-slate-600 leading-tight cursor-pointer">
                                        By checking this box, I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={!firstName || !agreedToTerms || isLoading}>
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Riding'}
                            </Button>
                        </CardFooter>
                    </form>
                )}

            </Card>

            {/* Footer Links */}
            <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Secure login powered by RideShare Inc.
                </p>
            </div>
        </div>
    );
}
