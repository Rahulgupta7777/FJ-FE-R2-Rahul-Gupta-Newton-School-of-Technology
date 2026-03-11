import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface IdentifierStepProps {
    identifier: string;
    setIdentifier: (val: string) => void;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function IdentifierStep({ identifier, setIdentifier, isLoading, onSubmit }: IdentifierStepProps) {
    return (
        <form onSubmit={onSubmit}>
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
    );
}
