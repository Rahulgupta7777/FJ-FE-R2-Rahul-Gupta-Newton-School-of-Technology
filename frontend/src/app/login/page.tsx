'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

import { IdentifierStep } from '@/components/auth/IdentifierStep';
import { OtpStep } from '@/components/auth/OtpStep';
import { AuthChoiceStep } from '@/components/auth/AuthChoiceStep';
import { PasswordStep } from '@/components/auth/PasswordStep';
import { ProfileStep } from '@/components/auth/ProfileStep';

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
                    router.replace('/');
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
                    router.replace('/');
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
                router.replace('/');
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
                            {step === 'IDENTIFIER' && (
                                <IdentifierStep identifier={identifier} setIdentifier={setIdentifier} isLoading={isLoading} onSubmit={handleIdentifierSubmit} />
                            )}
                            {step === 'OTP' && (
                                <OtpStep otp={otp} setOtp={setOtp} isLoading={isLoading} onBack={() => setStep('IDENTIFIER')} onSubmit={handleOtpVerify} />
                            )}
                            {step === 'AUTH_CHOICE' && (
                                <AuthChoiceStep onSelectPassword={() => setStep('PASSWORD')} onSelectOtp={() => setStep('OTP')} />
                            )}
                            {step === 'PASSWORD' && (
                                <PasswordStep password={password} setPassword={setPassword} isLoading={isLoading} onBack={() => setStep('AUTH_CHOICE')} onSubmit={handleLoginSubmit} />
                            )}
                            {step === 'PROFILE' && (
                                <ProfileStep
                                    firstName={firstName} setFirstName={setFirstName}
                                    lastName={lastName} setLastName={setLastName}
                                    password={password} setPassword={setPassword}
                                    confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                                    isLoading={isLoading} onBack={() => setStep('IDENTIFIER')} onSubmit={handleRegisterSubmit}
                                />
                            )}
                        </div>
                    </Card>

                    <p className="mt-10 text-center text-sm text-slate-400 font-medium">
                        Secure login powered by NexRide Inc.
                    </p>
                </div>
            </div>

            {/* Right Side: Visuals */}
            <div className="hidden md:flex flex-1 relative bg-black overflow-hidden items-end justify-center">
                <Image src="/hero.gif" alt="Hero" fill className="object-cover opacity-60 scale-105" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="relative z-10 text-center p-12 max-w-xl animate-in slide-in-from-bottom-10 duration-700 mb-8">
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
