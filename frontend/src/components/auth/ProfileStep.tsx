import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';

interface ProfileStepProps {
    firstName: string;
    setFirstName: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    confirmPassword: string;
    setConfirmPassword: (val: string) => void;
    isLoading: boolean;
    onBack: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function ProfileStep({
    firstName, setFirstName,
    lastName, setLastName,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, onBack, onSubmit
}: ProfileStepProps) {
    return (
        <form onSubmit={onSubmit}>
            <CardHeader className="pt-12 pb-8 px-10 relative">
                <Button type="button" variant="ghost" size="icon" className="absolute top-8 left-8" onClick={onBack}>
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
    );
}
