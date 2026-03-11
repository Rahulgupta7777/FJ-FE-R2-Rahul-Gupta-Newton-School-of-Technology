import { Button } from '@/components/ui/button';
import { KeyRound, ShieldCheck } from 'lucide-react';

interface AuthChoiceStepProps {
    onSelectPassword: () => void;
    onSelectOtp: () => void;
}

export function AuthChoiceStep({ onSelectPassword, onSelectOtp }: AuthChoiceStepProps) {
    return (
        <div className="p-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 shadow-md ring-8 ring-slate-50 dark:ring-slate-900/50 transition-transform hover:scale-110">
                <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 font-medium px-4">Choose how you'd like to sign in to your account.</p>

            <div className="space-y-4 px-2">
                <Button
                    onClick={onSelectPassword}
                    className="w-full h-[72px] text-xl font-bold rounded-[24px] bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 flex items-center justify-center gap-4 shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98]"
                >
                    <KeyRound className="w-6 h-6" /> Sign in with Password
                </Button>
                <Button
                    variant="outline"
                    onClick={onSelectOtp}
                    className="w-full h-[72px] text-xl font-bold rounded-[24px] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-transparent text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
                >
                    <ShieldCheck className="w-6 h-6" /> Continue with OTP
                </Button>
            </div>
        </div>
    );
}
