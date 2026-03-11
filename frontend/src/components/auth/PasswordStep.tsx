import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface PasswordStepProps {
    password: string;
    setPassword: (val: string) => void;
    isLoading: boolean;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function PasswordStep({ password, setPassword, isLoading, onBack, onSubmit }: PasswordStepProps) {
    return (
        <form onSubmit={onSubmit}>
            <CardHeader className="pt-12 pb-8 px-10 relative">
                <Button type="button" variant="ghost" size="icon" className="absolute top-8 left-8" onClick={onBack}>
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
    );
}
