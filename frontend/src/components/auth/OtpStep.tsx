import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

interface OtpStepProps {
    otp: string;
    setOtp: (val: string) => void;
    isLoading: boolean;
    onBack: () => void;
    onSubmit: (e?: React.FormEvent) => void;
}

export function OtpStep({ otp, setOtp, isLoading, onBack, onSubmit }: OtpStepProps) {
    return (
        <form onSubmit={onSubmit}>
            <CardHeader className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-10 relative">
                <Button type="button" variant="ghost" size="icon" className="absolute top-6 sm:top-8 left-4 sm:left-8 hover:bg-slate-100 rounded-full" onClick={onBack}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-black dark:text-white border border-slate-100 dark:border-slate-800 shadow-sm">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 sm:mb-3 text-center">Verify Identity</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-center dark:text-slate-400">A 6-digit code has been sent to your device. Enter code <span className="text-black dark:text-white font-bold">123456</span> to proceed.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center py-8 px-4 sm:py-10 sm:px-10">
                <div className="w-full flex justify-center">
                    <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        autoFocus
                        onComplete={() => onSubmit()}
                    >
                        <InputOTPGroup className="flex gap-2 sm:gap-3 justify-center">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <InputOTPSlot
                                    key={i}
                                    index={i}
                                    className="
                    w-10 h-12 sm:w-12 sm:h-14
                    text-lg sm:text-xl font-bold
                    rounded-lg sm:rounded-xl
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
            <CardFooter className="px-4 sm:px-10 pb-12">
                <Button type="submit" className="w-full h-[56px] text-lg font-bold rounded-2xl bg-black dark:bg-white text-white dark:text-black transition-all active:scale-[0.98] premium-shadow" disabled={otp.length !== 6 || isLoading}>
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Account'}
                </Button>
            </CardFooter>
        </form>
    );
}
