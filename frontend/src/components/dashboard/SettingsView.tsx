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
        return <div className="p-6 md:p-8 h-full w-full max-w-3xl mx-auto flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div></div>;
    }

    return (
        <div className="p-10 md:p-12 h-screen overflow-y-auto w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="mb-12">
                <h2 className="text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white">Settings</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Personalize your NexRide experience and account security.</p>
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
                                className={`group relative overflow-hidden rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300 ${theme === 'light' ? 'ring-2 ring-black ring-offset-2 dark:ring-offset-slate-950 bg-white shadow-lg' : 'border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-transparent opacity-70 hover:opacity-100'}`}
                            >
                                {theme === 'light' && <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent opacity-50" />}
                                <Sun className={`w-6 h-6 z-10 ${theme === 'light' ? 'text-black animate-in spin-in-90 duration-500' : 'text-slate-400'}`} />
                                <span className={`font-semibold text-sm z-10 ${theme === 'light' ? 'text-black' : 'text-slate-500'}`}>Light</span>
                            </button>

                            <button
                                onClick={() => setTheme("dark")}
                                className={`group relative overflow-hidden rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300 ${theme === 'dark' ? 'ring-2 ring-slate-400 ring-offset-2 dark:ring-offset-slate-950 bg-slate-900 shadow-lg' : 'border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-transparent opacity-70 hover:opacity-100'}`}
                            >
                                {theme === 'dark' && <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-transparent opacity-50" />}
                                <Moon className={`w-6 h-6 z-10 ${theme === 'dark' ? 'text-white animate-in zoom-in-50 duration-500' : 'text-slate-400'}`} />
                                <span className={`font-semibold text-sm z-10 ${theme === 'dark' ? 'text-white' : 'text-slate-500'}`}>Dark</span>
                            </button>

                            <button
                                onClick={() => setTheme("system")}
                                className={`group relative overflow-hidden rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-300 ${theme === 'system' ? 'ring-2 ring-slate-600 ring-offset-2 dark:ring-offset-slate-950 bg-slate-100 dark:bg-slate-800 shadow-lg' : 'border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <Monitor className={`w-6 h-6 z-10 ${theme === 'system' ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`} />
                                <span className={`font-semibold text-sm z-10 ${theme === 'system' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>System</span>
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
                            <Switch />
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

            </div>
        </div>
    );
}
