"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Monitor, Bell, Shield, LogOut } from "lucide-react";
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
        return <div className="p-6 md:p-8 h-full w-full max-w-3xl mx-auto flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div></div>;
    }

    return (
        <div className="p-4 md:p-12 h-screen overflow-y-auto w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 md:mb-3 text-slate-900 dark:text-white">Settings</h2>
                <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">Personalize your NexRide experience and account security.</p>
            </div>

            <div className="space-y-6">
                {/* Appearance */}
                <Card className="glass-card border-0 shadow-none">
                    <CardHeader className="p-6 pb-0">
                        <CardTitle className="text-xl md:text-2xl font-black tracking-tighter italic">Appearance</CardTitle>
                        <CardDescription className="text-sm md:text-base">Customize how the app looks on your device.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme("light")}
                                className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-all duration-300 ${theme === 'light' ? 'bg-black text-white shadow-xl' : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 border border-slate-200 dark:border-white/5'}`}
                            >
                                <Sun className={`w-7 h-7 transition-all duration-300 ${theme === 'light' ? 'scale-110' : 'group-hover:rotate-12'}`} />
                                <span className="text-xs font-black uppercase tracking-widest">Light</span>
                            </button>

                            <button
                                onClick={() => setTheme("dark")}
                                className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-all duration-300 ${theme === 'dark' ? 'bg-white text-black shadow-xl' : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 border border-slate-200 dark:border-white/5'}`}
                            >
                                <Moon className={`w-7 h-7 transition-all duration-300 ${theme === 'dark' ? 'scale-110' : 'group-hover:-rotate-12'}`} />
                                <span className="text-xs font-black uppercase tracking-widest">Dark</span>
                            </button>

                            <button
                                onClick={() => setTheme("system")}
                                className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl p-6 transition-all duration-300 ${theme === 'system' ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 border border-slate-200 dark:border-white/5'}`}
                            >
                                <Monitor className={`w-7 h-7 transition-all duration-300 ${theme === 'system' ? 'scale-110' : ''}`} />
                                <span className="text-xs font-black uppercase tracking-widest">System</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="glass-card border-0 p-4">
                    <CardHeader>
                        <CardTitle className="text-2xl font-black italic tracking-tighter">Notifications</CardTitle>
                        <CardDescription className="text-base">Choose what updates you want to receive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 glass-card border-0 bg-white/40 dark:bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-black dark:text-white">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <Label className="text-lg font-bold">Ride Updates</Label>
                                    <p className="text-sm text-slate-500 font-medium">Get real-time alerts for your trips.</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 glass-card border-0 bg-white/40 dark:bg-white/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-black dark:text-white">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <Label className="text-lg font-bold">Promotions</Label>
                                    <p className="text-sm text-slate-500 font-medium">Receive exclusive offers and deals.</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Legal & About */}
                <div className="space-y-2 pt-4">
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-14 text-base font-normal text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 mt-4 px-4 rounded-xl"
                        onClick={() => {
                            document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                            localStorage.removeItem('isAuthenticated');
                            router.push('/login');
                        }}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Log Out
                    </Button>
                </div>
            </div >
        </div >
    );
}
