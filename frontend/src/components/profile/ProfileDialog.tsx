'use client';

import { useState, useRef } from 'react';
import { User, Plus, Star, History, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ProfileDialogProps {
    userName: string;
    setUserName: (name: string) => void;
    profileImage: string | null;
    setProfileImage: (image: string | null) => void;
    avatarList: string[];
}

export function ProfileDialog({ userName, setUserName, profileImage, setProfileImage, avatarList }: ProfileDialogProps) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(userName);
    const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
    const [newNumber, setNewNumber] = useState("");
    const [isVerifyingNumber, setIsVerifyingNumber] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [otpError, setOtpError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            if (typeof window !== 'undefined') {
                localStorage.setItem('profile_image', imageUrl);
            }
        }
    };

    const saveProfile = () => {
        setUserName(editName);
        localStorage.setItem('user_name', editName);
        setIsEditingProfile(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 p-2 rounded-xl transition-colors">
                    <Avatar>
                        <AvatarImage src={profileImage || "https://ui.shadcn.com/avatars/02.png"} />
                        <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{userName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">5.0 ★ Rating</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditingProfile ? 'Edit Profile' : 'User Profile'}</DialogTitle>
                    <DialogDescription>
                        {isEditingProfile ? 'Update your personal details below.' : 'Manage your public profile and preferences.'}
                    </DialogDescription>
                </DialogHeader>

                {!isEditingProfile ? (
                    // VIEW MODE
                    <>
                        <div className="flex flex-col items-center justify-center p-6 space-y-4">
                            <div
                                className="relative w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center cursor-pointer group hover:ring-4 hover:ring-blue-100 transition-all overflow-hidden"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-blue-600 dark:text-blue-300" />
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-semibold">Change</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfileImageUpload}
                            />

                            <div className="text-center w-full">
                                <h3 className="text-2xl font-black tracking-tight">{userName}</h3>
                                <p className="text-slate-500 font-bold mb-6">{phoneNumber}</p>

                                <div className="grid grid-cols-3 gap-4 w-full py-4 border-y border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-black flex items-center gap-1">4.88 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rating</span>
                                    </div>
                                    <div className="flex flex-col items-center border-x border-slate-100 dark:border-slate-800 px-4">
                                        <span className="text-lg font-black">2.5</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Years</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-black">42</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Trips</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3 w-full">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                                                <BadgeCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Status</p>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Gold Member</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <Button className="w-full h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black premium-shadow transition-all active:scale-[0.98]" onClick={() => {
                                setEditName(userName);
                                setIsEditingProfile(true);
                            }}>Edit Profile</Button>
                        </DialogFooter>
                    </>
                ) : (
                    // EDIT MODE
                    <>
                        <div className="space-y-6 py-4">
                            <div className="flex flex-col items-center gap-6">
                                <div
                                    className="w-32 h-32 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group relative overflow-hidden"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center p-2">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500 group-hover:text-blue-500">Upload Profile Image</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleProfileImageUpload}
                                    />
                                </div>

                                <div className="w-full">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mb-4">Quick Select Avatar</p>
                                    <div className="flex flex-wrap justify-center gap-3 px-4">
                                        {/* Upload Action Button */}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
                                        >
                                            <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                        </button>

                                        {avatarList.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setProfileImage(url);
                                                    localStorage.setItem('profile_image', url);
                                                }}
                                                className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 active:scale-95 overflow-hidden ${profileImage === url ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-100 dark:border-slate-800'}`}
                                            >
                                                <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Display Name</label>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="First Last"
                                />
                            </div>
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <div className="space-y-1">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                                        <p className="font-bold text-slate-900 dark:text-white">{phoneNumber}</p>
                                    </div>
                                    <Button
                                        variant="link"
                                        className="text-blue-600 font-black"
                                        onClick={() => {
                                            setIsVerifyingNumber(true);
                                            setIsOtpStep(false);
                                            setNewNumber("");
                                            setOtpCode("");
                                            setOtpError(false);
                                        }}
                                    >
                                        Change
                                    </Button>
                                </div>

                                {isVerifyingNumber && (
                                    <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 animate-in slide-in-from-top-2 duration-300">
                                        {!isOtpStep ? (
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold text-slate-500">Enter your new mobile number to receive a verification code.</p>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="+91 XXXXX XXXXX"
                                                        className="h-12 rounded-xl"
                                                        value={newNumber}
                                                        onChange={(e) => setNewNumber(e.target.value)}
                                                    />
                                                    <Button
                                                        className="h-12 px-6 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold"
                                                        onClick={() => setIsOtpStep(true)}
                                                        disabled={!newNumber}
                                                    >
                                                        Send
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="text-xs font-bold text-slate-500">Enter the code sent to {newNumber} (Default: 123456)</p>
                                                <div className="space-y-3">
                                                    <Input
                                                        placeholder="Enter OTP"
                                                        className={`h-12 rounded-xl text-center text-xl font-black tracking-[1em] ${otpError ? 'border-red-500 ring-red-100' : ''}`}
                                                        value={otpCode}
                                                        maxLength={6}
                                                        onChange={(e) => {
                                                            setOtpCode(e.target.value);
                                                            setOtpError(false);
                                                        }}
                                                    />
                                                    {otpError && <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-wider">Invalid OTP. Please use 123456</p>}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            className="flex-1 h-12 rounded-xl font-bold"
                                                            onClick={() => setIsOtpStep(false)}
                                                        >
                                                            Back
                                                        </Button>
                                                        <Button
                                                            className="flex-1 h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold"
                                                            onClick={() => {
                                                                if (otpCode === "123456") {
                                                                    setPhoneNumber(newNumber);
                                                                    setIsVerifyingNumber(false);
                                                                } else {
                                                                    setOtpError(true);
                                                                }
                                                            }}
                                                        >
                                                            Verify
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="flex-row gap-2 sm:justify-end">
                            <Button variant="ghost" className="flex-1" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={saveProfile}>Save Changes</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
