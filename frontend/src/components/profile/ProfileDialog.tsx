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
}

export function ProfileDialog({ userName, setUserName, profileImage, setProfileImage, avatarList }: ProfileDialogProps) {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(userName);
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
                                <p className="text-slate-500 dark:text-slate-400 font-medium">+1 (555) 123-4567</p>
                                <div className="flex items-center justify-center gap-2 mt-4">
                                    <Badge variant="secondary" className="px-3 py-1 text-sm"><Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" /> 5.0 Rating</Badge>
                                    <Badge variant="secondary" className="px-3 py-1 text-sm"><History className="w-3 h-3 mr-1 text-blue-500" /> 42 Rides</Badge>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <Button variant="outline" className="w-full" onClick={() => {
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
                                <label className="text-sm font-medium text-slate-900 dark:text-slate-300">Display Name</label>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="First Last"
                                    className="bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Phone Number (Verified)</label>
                                <Input disabled value="+1 (555) 123-4567" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400" />
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
