'use client';

import { useState, useRef } from 'react';
import { User, Plus, Star, History } from 'lucide-react';
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
    phoneNumber: string;
    setPhoneNumber: (phone: string) => void;
}

export function ProfileDialog({ userName, setUserName, profileImage, setProfileImage, avatarList, phoneNumber, setPhoneNumber }: ProfileDialogProps) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(userName);
    const [editPhone, setEditPhone] = useState(phoneNumber);
    const [verificationStep, setVerificationStep] = useState<'NONE' | 'OTP'>('NONE');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
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
        if (editPhone !== phoneNumber) {
            setVerificationStep('OTP');
        } else {
            setUserName(editName);
            localStorage.setItem('user_name', editName);
            setIsEditingProfile(false);
        }
    };

    const verifyOtp = () => {
        if (otp === '123456') {
            setUserName(editName);
            setPhoneNumber(editPhone);
            localStorage.setItem('user_name', editName);
            localStorage.setItem('user_phone', editPhone);
            setIsEditingProfile(false);
            setVerificationStep('NONE');
            setOtp('');
            setError('');
        } else {
            setError('Invalid OTP. Please try again.');
        }
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
                    <DialogDescription className="text-slate-500 dark:text-slate-400">
                        {isEditingProfile ? 'Update your personal details below.' : 'Manage your public profile and preferences.'}
                    </DialogDescription>
                </DialogHeader>

                {!isEditingProfile ? (
                    // VIEW MODE
                    <>
                        <div className="flex flex-col items-center justify-center p-6 space-y-4">
                            <div
                                className="relative w-24 h-24 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center cursor-pointer group hover:ring-4 hover:ring-blue-100 dark:hover:ring-blue-900 transition-all overflow-hidden"
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

                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{userName}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{phoneNumber}</p>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0"><Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" /> 5.0 Rating</Badge>
                                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0"><History className="w-3 h-3 mr-1 text-blue-500" /> 42 Rides</Badge>
                                </div>
                            </div>

                            <div className="w-full grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Spent</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">₹12,450</p>
                                </div>
                                <div className="text-center border-x border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Saved</p>
                                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹2,100</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Level</p>
                                    <p className="text-sm font-black text-blue-600 dark:text-blue-400">Gold</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all" onClick={() => {
                                setEditName(userName);
                                setEditPhone(phoneNumber);
                                setIsEditingProfile(true);
                                setVerificationStep('NONE');
                            }}>Edit Profile</Button>
                        </DialogFooter>
                    </>
                ) : (
                    // EDIT MODE
                    <>
                        {verificationStep === 'NONE' ? (
                            <div className="space-y-6 py-4">
                                <div className="flex flex-col items-center gap-6">
                                    <div
                                        className="w-32 h-32 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group relative overflow-hidden"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center p-2">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500 group-hover:text-blue-500">Upload Picture</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-blue-600/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                                            <Plus className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center mb-4">Quick Select</p>
                                        <div className="flex flex-wrap justify-center gap-3 px-4">
                                            {avatarList.map((url, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        setProfileImage(url);
                                                        localStorage.setItem('profile_image', url);
                                                    }}
                                                    className={`w-11 h-11 rounded-full border-2 transition-all hover:scale-110 active:scale-95 overflow-hidden shadow-sm ${profileImage === url ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-100 dark:border-slate-800'}`}
                                                >
                                                    <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Name</p>
                                        <Input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="h-12 bg-slate-50 dark:bg-slate-900 border-0 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</p>
                                            {editPhone === phoneNumber && <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] px-2 py-0">Verified</Badge>}
                                        </div>
                                        <Input
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="h-12 bg-slate-50 dark:bg-slate-900 border-0 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl font-bold"
                                        />
                                        {editPhone !== phoneNumber && <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 animate-pulse uppercase tracking-wider">Verification required on save</p>}
                                    </div>
                                </div>
                                <DialogFooter className="flex-row gap-2 sm:justify-end pt-4">
                                    <Button variant="ghost" className="flex-1 h-12 rounded-xl font-bold text-slate-500" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                                    <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20" onClick={saveProfile}>Save Changes</Button>
                                </DialogFooter>
                            </div>
                        ) : (
                            <div className="space-y-6 py-6 animate-in zoom-in-95 duration-300">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Star className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Verify Phone Number</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 px-4">We've sent a code to <span className="font-bold text-slate-900 dark:text-white">{editPhone}</span></p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enter Verification Code</p>
                                        <Input
                                            value={otp}
                                            onChange={(e) => {
                                                setOtp(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="123456"
                                            maxLength={6}
                                            className="h-16 text-center text-3xl font-black tracking-[0.5em] bg-slate-50 dark:bg-slate-900 border-0 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl"
                                        />
                                        {error && <p className="text-xs font-bold text-red-500 mt-2">{error}</p>}
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">Demo Code: <span className="text-blue-600">123456</span></p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-xl" onClick={verifyOtp}>Verify & Update</Button>
                                        <Button variant="ghost" className="w-full h-12 text-slate-500 font-bold" onClick={() => setVerificationStep('NONE')}>Go Back</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
