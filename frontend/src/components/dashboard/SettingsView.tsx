"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Moon, Sun, Monitor, Bell, Shield, LogOut, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SettingsView() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-6 md:p-8 h-full w-full max-w-3xl mx-auto flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto w-full max-w-3xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your app preferences and account settings.</p>
            </div>

            <div className="space-y-6">

                {/* Appearance */}
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Appearance</CardTitle>
                        <CardDescription>Customize how the app looks on your device.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme("light")}
                                className={`border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                            >
                                <Sun className="w-6 h-6" />
                                <span className="font-medium text-sm">Light</span>
                            </button>

                            <button
                                onClick={() => setTheme("dark")}
                                className={`border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                            >
                                <Moon className="w-6 h-6" />
                                <span className="font-medium text-sm">Dark</span>
                            </button>

                            <button
                                onClick={() => setTheme("system")}
                                className={`border-2 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors ${theme === 'system' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                            >
                                <Monitor className="w-6 h-6" />
                                <span className="font-medium text-sm">System</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Notifications</CardTitle>
                        <CardDescription>Choose what updates you want to receive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-slate-500" />
                                <div>
                                    <Label className="text-base font-medium">Ride Updates</Label>
                                    <p className="text-sm text-slate-500">Get notified when your driver arrives.</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-slate-500" />
                                <div>
                                    <Label className="text-base font-medium">Promotions & Offers</Label>
                                    <p className="text-sm text-slate-500">Receive discounts and special deals.</p>
                                </div>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Legal & About */}
                <div className="space-y-2 pt-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between h-14 text-base font-normal hover:bg-slate-100 dark:hover:bg-slate-900 px-4 rounded-xl">
                                Privacy Policy <ChevronRight className="w-5 h-5 text-slate-400" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Privacy Policy</DialogTitle>
                                <DialogDescription className="max-h-96 overflow-y-auto mt-4 text-justify space-y-4">
                                    <p><strong>1. Information Collection:</strong> We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, or contact customer support.</p>
                                    <p><strong>2. Location Data:</strong> When you use our services, we collect precise location data from your device to provide the rides and for safety and security purposes.</p>
                                    <p><strong>3. Use of Information:</strong> We use the information we collect to integrate with drivers, process payments, and improve our platform.</p>
                                    <p><strong>4. Sharing of Information:</strong> We may share your information with our driver partners to enable them to provide the requested services. Your profile picture and name will be shared during active rides.</p>
                                    <p><strong>5. Data Security:</strong> We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.</p>
                                    <Button className="w-full mt-4" onClick={(e) => (e.target as any).closest('dialog')?.close()}>Understood</Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between h-14 text-base font-normal hover:bg-slate-100 dark:hover:bg-slate-900 px-4 rounded-xl">
                                Terms of Service <ChevronRight className="w-5 h-5 text-slate-400" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Terms of Service</DialogTitle>
                                <DialogDescription className="max-h-96 overflow-y-auto mt-4 text-justify space-y-4">
                                    <p><strong>1. Acceptance of Terms:</strong> By accessing and using this Ride Sharing application, you accept and agree to be bound by the terms and provision of this agreement.</p>
                                    <p><strong>2. User Accounts:</strong> You must create an account to use the service. You are responsible for maintaining the confidentiality of your account information.</p>
                                    <p><strong>3. Use of Services:</strong> You agree to use the service for lawful purposes only and in a manner consistent with any and all applicable local, national and international laws.</p>
                                    <p><strong>4. Payments:</strong> Fares are calculated dynamically based on distance, time, and demand. You agree to pay all charges incurred under your account.</p>
                                    <p><strong>5. Limitation of Liability:</strong> We shall not be liable for any direct, indirect, incidental, special or consequential damages resulting from the use or inability to use the service.</p>
                                    <Button className="w-full mt-4" onClick={(e) => (e.target as any).closest('dialog')?.close()}>I Accept</Button>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-14 text-base font-normal text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 mt-4 px-4 rounded-xl"
                        onClick={() => {
                            localStorage.removeItem('isAuthenticated');
                            router.push('/login');
                        }}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Log Out
                    </Button>
                </div>

            </div>
        </div>
    );
}
