'use client';

import { Car, History, Wallet, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProfileDialog } from '../profile/ProfileDialog';

type TabType = 'BOOKING' | 'TRIPS' | 'PAYMENTS' | 'SETTINGS';

interface SidebarMenuProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    userName: string;
    setUserName: (name: string) => void;
    profileImage: string | null;
    setProfileImage: (image: string | null) => void;
    avatarList: string[];
}

export function SidebarMenu({
    activeTab,
    setActiveTab,
    userName,
    setUserName,
    profileImage,
    setProfileImage,
    avatarList
}: SidebarMenuProps) {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 h-full z-10 shadow-sm transition-all duration-300">
            <div className="p-6">
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                    <span className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-bold">N</span>
                    NexRide
                </h1>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-medium ${activeTab === 'BOOKING' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                    onClick={() => setActiveTab('BOOKING')}
                >
                    <Car className="w-5 h-5 mr-3" /> Booking
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-medium ${activeTab === 'TRIPS' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                    onClick={() => setActiveTab('TRIPS')}
                >
                    <History className="w-5 h-5 mr-3" /> My Trips
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-medium ${activeTab === 'PAYMENTS' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                    onClick={() => setActiveTab('PAYMENTS')}
                >
                    <Wallet className="w-5 h-5 mr-3" /> Payments
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-medium ${activeTab === 'SETTINGS' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                    onClick={() => setActiveTab('SETTINGS')}
                >
                    <Settings className="w-5 h-5 mr-3" /> Settings
                </Button>
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <ProfileDialog
                    userName={userName}
                    setUserName={setUserName}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    avatarList={avatarList}
                />
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50 dark:bg-slate-900 flex justify-between text-xs text-slate-400">
                <Dialog>
                    <DialogTrigger className="hover:underline">Terms</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Terms of Service</DialogTitle>
                            <DialogDescription className="max-h-96 overflow-y-auto mt-4 text-justify space-y-4">
                                <p><strong>1. Acceptance of Terms:</strong> By accessing and using this NexRide application, you accept and agree to be bound by the terms and provision of this agreement.</p>
                                <p><strong>2. User Accounts:</strong> You must create an account to use the service. You are responsible for maintaining the confidentiality of your account information.</p>
                                <p><strong>3. Use of Services:</strong> You agree to use the service for lawful purposes only and in a manner consistent with any and all applicable local, national and international laws.</p>
                                <p><strong>4. Payments:</strong> Fares are calculated dynamically based on distance, time, and demand. You agree to pay all charges incurred under your account.</p>
                                <p><strong>5. Limitation of Liability:</strong> We shall not be liable for any direct, indirect, incidental, special or consequential damages resulting from the use or inability to use the service.</p>
                                <Button className="w-full mt-4" onClick={(e) => (e.target as any).closest('dialog')?.close()}>I Accept</Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger className="hover:underline">Privacy</DialogTrigger>
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
            </div>
        </aside>
    );
}
