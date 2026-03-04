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
        <aside className="hidden md:flex flex-col w-72 glass h-full z-10 transition-all duration-500 ease-in-out border-r border-slate-200/40 dark:border-white/5">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <img src="/e66735a8-370d-4668-b6b8-11a487bcd3cc" alt="Logo" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">NexRide</span>
                </div>
            </div>
            <nav className="flex-1 px-4 space-y-4 mt-8">
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-bold rounded-2xl h-14 transition-all duration-300 group relative overflow-hidden ${activeTab === 'BOOKING' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                    onClick={() => setActiveTab('BOOKING')}
                >
                    {activeTab === 'BOOKING' && <div className="absolute inset-0 bg-slate-500/10 backdrop-blur-md animate-in fade-in transition-all duration-500"></div>}
                    <Car className={`w-6 h-6 mr-4 transition-transform z-10 ${activeTab === 'BOOKING' ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                    <span className="tracking-tight text-base font-black z-10">Booking</span>
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-bold rounded-2xl h-14 transition-all duration-300 group relative overflow-hidden ${activeTab === 'TRIPS' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                    onClick={() => setActiveTab('TRIPS')}
                >
                    {activeTab === 'TRIPS' && <div className="absolute inset-0 bg-slate-500/10 backdrop-blur-md animate-in fade-in transition-all duration-500"></div>}
                    <History className={`w-6 h-6 mr-4 transition-transform z-10 ${activeTab === 'TRIPS' ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                    <span className="tracking-tight text-base font-black z-10">My Trips</span>
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-bold rounded-2xl h-14 transition-all duration-300 group relative overflow-hidden ${activeTab === 'PAYMENTS' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                    onClick={() => setActiveTab('PAYMENTS')}
                >
                    {activeTab === 'PAYMENTS' && <div className="absolute inset-0 bg-slate-500/10 backdrop-blur-md animate-in fade-in transition-all duration-500"></div>}
                    <Wallet className={`w-6 h-6 mr-4 transition-transform z-10 ${activeTab === 'PAYMENTS' ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                    <span className="tracking-tight text-base font-black z-10">Payments</span>
                </Button>
                <Button
                    variant="ghost"
                    className={`w-full justify-start font-bold rounded-2xl h-14 transition-all duration-300 group relative overflow-hidden ${activeTab === 'SETTINGS' ? 'text-black dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                    onClick={() => setActiveTab('SETTINGS')}
                >
                    {activeTab === 'SETTINGS' && <div className="absolute inset-0 bg-slate-500/10 backdrop-blur-md animate-in fade-in transition-all duration-500"></div>}
                    <Settings className={`w-6 h-6 mr-4 transition-transform z-10 ${activeTab === 'SETTINGS' ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                    <span className="tracking-tight text-base font-black z-10">Settings</span>
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
