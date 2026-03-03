'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Navigation, Clock, CreditCard, ChevronRight, Menu, Phone, MessageSquare, Star, Search, Car, Loader2, Calendar, History, Wallet, Settings, Banknote, ArrowLeft, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { TripsView } from '@/components/dashboard/TripsView';
import { PaymentsView } from '@/components/dashboard/PaymentsView';
import { SettingsView } from '@/components/dashboard/SettingsView';
import LocationSearch from '@/components/LocationSearch';
import Image from 'next/image';

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">Loading...</div>
});

const AVATAR_LIST = [
  "https://ui.shadcn.com/avatars/01.png",
  "https://ui.shadcn.com/avatars/02.png",
  "https://ui.shadcn.com/avatars/03.png",
  "https://ui.shadcn.com/avatars/04.png",
  "https://ui.shadcn.com/avatars/05.png"
];

type FlowState = 'IDLE' | 'SELECTING_RIDE' | 'SEARCHING' | 'DRIVER_ASSIGNED' | 'IN_RIDE' | 'POST_RIDE';

export default function Home() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userName, setUserName] = useState('Rahul Gupta');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'BOOKING' | 'TRIPS' | 'PAYMENTS' | 'SETTINGS'>('BOOKING');
  const [flowState, setFlowState] = useState<FlowState>('IDLE');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [tripDuration, setTripDuration] = useState(12); // Initial estimate

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Update every 10s for responsiveness
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const getDropoffTime = (minutes?: number) => {
    // If no minutes provided, use the current tripDuration estimate
    const estimate = minutes || tripDuration;
    const dropoff = new Date(currentTime.getTime() + estimate * 60000);
    return formatTime(dropoff);
  };

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userName);

  // Mocks
  const [pickup, setPickup] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState<[number, number] | null>(null);
  const [driverLoc, setDriverLoc] = useState<[number, number] | null>(null);

  // Inputs
  const [pickupText, setPickupText] = useState('Current Location');
  const [dropoffText, setDropoffText] = useState('');

  const [selectedVehicle, setSelectedVehicle] = useState<'Economy' | 'Comfort' | 'XL' | 'Shared' | 'EV'>('Economy');
  const [sharedSeats, setSharedSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Visa •••• 1234' | 'Paytm'>('Visa •••• 1234');

  // Dynamic Payment Icon Helper
  const renderPaymentIcon = (method: string) => {
    if (method === 'Cash') return <Banknote className="w-5 h-5 text-green-600" />;
    if (method === 'Paytm') return <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="w-5 h-5 object-contain" />;
    return <CreditCard className="w-5 h-5 text-slate-600" />;
  };

  // Chat State
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'driver', text: 'I am arriving in 2 minutes.' },
    { sender: 'user', text: 'Okay, I am outside.' },
  ]);

  // Schedule State
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState<string>('');

  // Rating & Tip
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');

  useEffect(() => {
    // Cookie parsing helper
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    // Auth validation logic
    const token = getCookie('authToken');
    const isAuth = localStorage.getItem('isAuthenticated');

    if (!token || !isAuth) {
      // Clear any partial state and redirect
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem('isAuthenticated');
      router.push('/login');
    } else {
      if (typeof window !== 'undefined') {
        const storedName = localStorage.getItem('user_name');
        const storedAvatar = localStorage.getItem('profile_image');
        if (storedName) setUserName(storedName);
        if (storedAvatar) setProfileImage(storedAvatar);
      }
      setIsAuthChecking(false);
    }
  }, [router]);

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
  }

  if (isAuthChecking) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium animate-pulse">Loading securely...</p>
      </div>
    );
  }

  // Transitions
  const handleFindRide = () => {
    if (pickup && dropoff) {
      const simulatedDistance = Math.floor(Math.random() * 20) + 5; // 5-25 km
      setTripDuration(Math.max(10, simulatedDistance * 2)); // roughly 2 min per km
      setFlowState('SELECTING_RIDE');
    }
  };

  const handleConfirmRide = () => {
    setFlowState('SEARCHING');
    setTimeout(() => {
      // Simulate driver location nearby
      if (pickup) {
        setDriverLoc([pickup[0] + 0.005, pickup[1] + 0.005]);
      } else {
        setDriverLoc([40.7200, -73.9900]);
      }
      setFlowState('DRIVER_ASSIGNED');
    }, 2000);
  };

  const startTrip = () => {
    setFlowState('IN_RIDE');
  };

  const completeTrip = () => {
    setFlowState('POST_RIDE');
    setDriverLoc(null);
  };

  const resetFlow = () => {
    setDropoff(null);
    setDriverLoc(null);
    setDropoffText('');
    setFlowState('IDLE');
    setRating(0);
    setTip(0);
    setShowCustomTip(false);
    setCustomTipValue('');
  };

  return (
    <div className="relative h-screen w-full flex overflow-hidden bg-slate-50 font-sans">

      {/* Sidebar Navigation - Common App Style */}
      <aside className="hidden md:flex flex-col w-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 h-full z-10 shadow-sm transition-all duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-sm">R</span>
            RideShare
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

                    <div className="text-center">
                      <h3 className="text-2xl font-bold">{userName}</h3>
                      <p className="text-slate-500 font-medium">+1 (555) 123-4567</p>
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

                          {AVATAR_LIST.map((url, i) => (
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500">Phone Number (Verified)</label>
                      <Input disabled value="+1 (555) 123-4567" className="bg-slate-50 text-slate-500" />
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
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50 dark:bg-slate-900 flex justify-between text-xs text-slate-400">
          <Dialog>
            <DialogTrigger className="hover:underline">Terms</DialogTrigger>
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

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full w-full">
        {/* Mobile Header */}
        <header className="md:hidden absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-transparent pointer-events-none">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full shadow-lg pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur">
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 z-[100]">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://ui.shadcn.com/avatars/03.png" />
                    <AvatarFallback>RG</AvatarFallback>
                  </Avatar>
                  My Account
                </h2>
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Nearby Drivers</h3>
                  <div className="flex -space-x-3 overflow-hidden p-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                      <Avatar key={i} className="inline-block border-2 border-white dark:border-slate-950 w-10 h-10 ring-2 ring-slate-100 dark:ring-slate-800 hover:scale-110 transition-transform cursor-pointer">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=driver${i}`} />
                        <AvatarFallback>D{i}</AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold border-2 border-white dark:border-slate-950 z-10">
                      +5
                    </div>
                  </div>
                </div>
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-12 rounded-xl text-base font-medium ${activeTab === 'BOOKING' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}
                    onClick={() => { setActiveTab('BOOKING'); setIsSidebarOpen(false); }}
                  >
                    <Navigation className="w-5 h-5 mr-3" /> Book a Ride
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-12 rounded-xl text-base font-medium ${activeTab === 'TRIPS' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}
                    onClick={() => { setActiveTab('TRIPS'); setIsSidebarOpen(false); }}
                  >
                    <History className="w-5 h-5 mr-3" /> My Trips
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-12 rounded-xl text-base font-medium ${activeTab === 'PAYMENTS' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}
                    onClick={() => { setActiveTab('PAYMENTS'); setIsSidebarOpen(false); }}
                  >
                    <Wallet className="w-5 h-5 mr-3" /> Payments
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-12 rounded-xl text-base font-medium ${activeTab === 'SETTINGS' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}
                    onClick={() => { setActiveTab('SETTINGS'); setIsSidebarOpen(false); }}
                  >
                    <Settings className="w-5 h-5 mr-3" /> Settings
                  </Button>
                </nav>
              </div>

              {/* Bottom Footer Area */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50 dark:bg-slate-900 absolute bottom-0 w-full flex justify-between px-6 text-xs text-slate-400">
                <Dialog>
                  <DialogTrigger className="hover:underline">Terms</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Terms of Service</DialogTitle>
                      <DialogDescription className="max-h-96 overflow-y-auto mt-4 text-justify space-y-4">
                        <div><strong>1. Acceptance of Terms:</strong> By accessing and using this Ride Sharing application, you accept and agree to be bound by the terms and provision of this agreement.</div>
                        <div><strong>2. User Accounts:</strong> You must create an account to use the service. You are responsible for maintaining the confidentiality of your account information.</div>
                        <div><strong>3. Use of Services:</strong> You agree to use the service for lawful purposes only and in a manner consistent with any and all applicable local, national and international laws.</div>
                        <div><strong>4. Payments:</strong> Fares are calculated dynamically based on distance, time, and demand. You agree to pay all charges incurred under your account.</div>
                        <div><strong>5. Limitation of Liability:</strong> We shall not be liable for any direct, indirect, incidental, special or consequential damages resulting from the use or inability to use the service.</div>
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
                        <div><strong>1. Information Collection:</strong> We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, or contact customer support.</div>
                        <div><strong>2. Location Data:</strong> When you use our services, we collect precise location data from your device to provide the rides and for safety and security purposes.</div>
                        <div><strong>3. Use of Information:</strong> We use the information we collect to integrate with drivers, process payments, and improve our platform.</div>
                        <div><strong>4. Sharing of Information:</strong> We may share your information with our driver partners to enable them to provide the requested services. Your profile picture and name will be shared during active rides.</div>
                        <div><strong>5. Data Security:</strong> We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.</div>
                        <Button className="w-full mt-4" onClick={(e) => (e.target as any).closest('dialog')?.close()}>Understood</Button>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </SheetContent>
          </Sheet>
          <Avatar className="pointer-events-auto border-2 border-white shadow-lg">
            <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">RG</AvatarFallback>
          </Avatar>
        </header>

        {/* Main Toggled Views */}
        {activeTab === 'TRIPS' && <div className="absolute inset-0 bg-white dark:bg-slate-950 z-10"><TripsView /></div>}
        {activeTab === 'PAYMENTS' && <div className="absolute inset-0 bg-white dark:bg-slate-950 z-10"><PaymentsView /></div>}
        {activeTab === 'SETTINGS' && <div className="absolute inset-0 bg-white dark:bg-slate-950 z-10"><SettingsView /></div>}

        <div className="flex-1 relative overflow-hidden bg-slate-50 dark:bg-slate-900">
          {/* Map Area (Only visible on Booking Tab) */}
          <div className={`absolute inset-0 z-0 ${activeTab !== 'BOOKING' ? 'hidden' : ''}`}>
            <DynamicMap
              pickup={pickup}
              dropoff={dropoff}
              driverLocation={driverLoc}
              showRoute={flowState === 'SELECTING_RIDE' || flowState === 'SEARCHING' || flowState === 'DRIVER_ASSIGNED' || flowState === 'IN_RIDE'}
              onLocationSensed={(lat, lon) => {
                if (!pickup) {
                  setPickup([lat, lon]);
                  setPickupText('Current Location');
                }
              }}
            />
          </div>


          {/* Floating UI Overlay Base (Only visible on Booking Tab) */}
          <div className={`absolute bottom-0 left-0 right-0 md:left-6 md:top-6 md:bottom-auto md:w-[400px] z-20 pointer-events-none ${activeTab !== 'BOOKING' ? 'hidden' : ''}`}>

            {/* STATE 1: Search Location */}
            {(flowState === 'IDLE' || flowState === 'SEARCHING') && (
              <Card className="pointer-events-auto glass-card shadow-2xl rounded-t-3xl md:rounded-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-5">
                <CardHeader className="bg-transparent pb-2">
                  <CardTitle className="text-xl">Where to?</CardTitle>
                  <CardDescription>Find a ride instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 bg-transparent pb-6">
                  <div className="relative flex flex-col gap-3">
                    {/* Connecting Line */}
                    <div className="absolute left-[23.5px] top-[24px] bottom-[24px] w-0.5 bg-slate-200 dark:bg-slate-800 z-0 border-l border-dashed border-slate-300 dark:border-slate-700"></div>

                    <LocationSearch
                      placeholder="Enter pickup location"
                      value={pickupText}
                      onChange={setPickupText}
                      onSelect={(lat, lon, name) => {
                        setPickup([lat, lon]);
                        setPickupText(name);
                      }}
                    />

                    <LocationSearch
                      placeholder="Enter Dropoff location"
                      value={dropoffText}
                      onChange={setDropoffText}
                      onSelect={(lat, lon, name) => {
                        setDropoff([lat, lon]);
                        setDropoffText(name);
                      }}
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button
                      variant={isScheduled ? "outline" : "default"}
                      className={`flex-1 justify-center font-medium h-12 rounded-xl transition-all ${isScheduled ? 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900' : 'bg-[#1E5EFF] text-white shadow-md hover:bg-blue-700'}`}
                      onClick={() => {
                        setIsScheduled(false);
                        setScheduleTime('');
                      }}
                    >
                      <Clock className="w-5 h-5 mr-2" /> Now
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={isScheduled ? "default" : "outline"}
                          className={`flex-1 justify-center font-medium h-12 rounded-xl transition-all ${isScheduled ? 'bg-[#1E5EFF] text-white shadow-md hover:bg-blue-700' : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                        >
                          <Calendar className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" /> {isScheduled ? scheduleTime : 'Schedule'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule a Ride</DialogTitle>
                          <DialogDescription>
                            Choose a date and time for your upcoming trip.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Select defaultValue="tomorrow">
                              <SelectTrigger>
                                <SelectValue placeholder="Select Date" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                                <SelectItem value="next">Next Week</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Time</label>
                            <Select defaultValue="8am" onValueChange={(val) => setScheduleTime(val)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="06:00 AM">06:00 AM</SelectItem>
                                <SelectItem value="07:00 AM">07:00 AM</SelectItem>
                                <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                                <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                                <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                              if (!scheduleTime) setScheduleTime('08:00 AM');
                              setIsScheduled(true);
                            }}>
                              Confirm Pickup Time
                            </Button>
                          </DialogTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
                <CardFooter className="bg-transparent pt-2 pb-6 md:pb-4 border-t border-slate-100 dark:border-white/10 rounded-b-3xl md:rounded-b-xl">
                  <Button
                    className="w-full h-14 text-lg font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-slate-200 shadow-md transition-all active:scale-[0.98]"
                    onClick={handleFindRide}
                    disabled={!dropoffText}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {isScheduled ? `Schedule for ${scheduleTime}` : 'Search Rides'}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* STATE 2: Select Ride */}
            {flowState === 'SELECTING_RIDE' && (
              <Card className="pointer-events-auto glass-card shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="relative h-40 w-full bg-blue-50/50 dark:bg-slate-900/40 flex items-center justify-center border-b border-slate-200/50 dark:border-white/10 p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
                  <img src="/mult_cab.png" alt="Available Cabs" className="h-32 w-auto object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full h-8 w-8 z-10"
                    onClick={() => setFlowState('IDLE')}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4 bg-transparent border-b border-slate-200/50 dark:border-white/10">
                  <h3 className="font-bold text-xl tracking-tight">Choose your ride</h3>
                  <p className="text-sm text-slate-500 font-medium">Safe and reliable options for any trip</p>
                </div>
                <CardContent className="p-0 bg-transparent">
                  <div className="overflow-y-auto max-h-[40vh] md:max-h-[500px]">
                    {/* Shared Option */}
                    <div
                      className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 ${selectedVehicle === 'Shared' ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                      onClick={() => setSelectedVehicle('Shared')}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-14 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-sm">
                          <img src="/car-icon.png" alt="Car Icon" className="w-12 h-auto object-contain dark:invert" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Shared</h4>
                            <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                              <span className="text-[10px] mr-1">👤</span>
                              <span className="text-xs font-bold">1-2</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">2 min • {getDropoffTime(tripDuration + 2)} dropoff</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">${(9.50 * sharedSeats).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Economy Option */}
                    <div
                      className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 ${selectedVehicle === 'Economy' ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                      onClick={() => setSelectedVehicle('Economy')}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-14 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-sm">
                          <img src="/car-icon.png" alt="Car Icon" className="w-12 h-auto object-contain dark:invert" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Economy</h4>
                            <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                              <span className="text-[10px] mr-1">👤</span>
                              <span className="text-xs font-bold">4</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">2 min • {getDropoffTime(tripDuration)} dropoff</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">$14.50</p>
                      </div>
                    </div>

                    {/* EV Option */}
                    <div
                      className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 ${selectedVehicle === 'EV' ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                      onClick={() => setSelectedVehicle('EV')}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-14 flex items-center justify-center bg-green-50/50 dark:bg-green-900/10 rounded-2xl overflow-hidden border border-green-100 dark:border-green-900/30 shadow-sm">
                          <img src="/car-icon.png" alt="Car Icon" className="w-12 h-auto object-contain dark:invert hue-rotate-[120deg]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">EV</h4>
                            <span className="text-green-600 dark:text-green-400 text-[10px] font-black px-1.5 py-0.5 bg-green-100 dark:bg-green-900/40 rounded-md tracking-wider">ECO</span>
                            <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                              <span className="text-[10px] mr-1">👤</span>
                              <span className="text-xs font-bold">4</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">3 min • {getDropoffTime(tripDuration + 1)} dropoff</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">$15.20</p>
                      </div>
                    </div>

                    {/* Comfort Option */}
                    <div
                      className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 ${selectedVehicle === 'Comfort' ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                      onClick={() => setSelectedVehicle('Comfort')}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-14 flex items-center justify-center bg-slate-900 dark:bg-white rounded-2xl overflow-hidden shadow-lg">
                          <img src="/car-icon.png" alt="Car Icon" className="w-12 h-auto object-contain invert dark:invert-0" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">Comfort</h4>
                            <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                              <span className="text-[10px] mr-1">👤</span>
                              <span className="text-xs font-bold">4</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">4 min • {getDropoffTime(tripDuration + 5)} dropoff</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">$21.20</p>
                      </div>
                    </div>

                    {/* XL Option */}
                    <div
                      className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 ${selectedVehicle === 'XL' ? 'bg-blue-50/40 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                      onClick={() => setSelectedVehicle('XL')}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-14 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-sm">
                          <img src="/car-icon.png" alt="Car Icon" className="w-14 h-auto object-contain dark:invert" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">XL</h4>
                            <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                              <span className="text-[10px] mr-1">👤</span>
                              <span className="text-xs font-bold">6</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">6 min • {getDropoffTime(tripDuration + 8)} dropoff</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">$28.90</p>
                      </div>
                    </div>

                    {/* Shared Ride Counter - Only visible if 'Shared' is selected */}
                    {selectedVehicle === 'Shared' && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 fade-in">
                        <div className="space-y-0.5">
                          <h4 className="font-medium text-sm text-slate-900 dark:text-white">Shared Ride Options</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">How many seats do you need?</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white dark:bg-slate-950 px-3 py-1 rounded-full border dark:border-slate-800 shadow-sm">
                          <button className="text-xl font-bold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white px-2" onClick={() => setSharedSeats(Math.max(1, sharedSeats - 1))}>-</button>
                          <span className="font-bold text-lg w-4 text-center">{sharedSeats}</span>
                          <button className="text-xl font-bold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white px-2" onClick={() => setSharedSeats(Math.min(2, sharedSeats + 1))}>+</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Action */}
                  <div className="pt-6 flex items-center justify-between px-6 bg-transparent pb-8 border-t border-slate-200/50 dark:border-white/10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-all w-[140px] justify-between border border-transparent hover:border-slate-300 dark:hover:border-white/20 group">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="shrink-0 transition-transform group-hover:scale-110">
                              {renderPaymentIcon(paymentMethod)}
                            </div>
                            <span className="text-sm font-bold truncate tracking-tight">{paymentMethod.split(' ')[0]}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-2xl p-2 border-slate-100 shadow-2xl">
                        <DropdownMenuItem className="rounded-xl h-12 font-bold" onClick={() => setPaymentMethod('Cash')}>
                          <Banknote className="w-5 h-5 mr-3 text-green-600" /> Cash
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl h-12 font-bold" onClick={() => setPaymentMethod('Visa •••• 1234')}>
                          <CreditCard className="w-5 h-5 mr-3 text-blue-600" /> Visa •••• 1234
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl h-12 font-bold" onClick={() => setPaymentMethod('Paytm')}>
                          <div className="w-5 h-5 mr-3 flex items-center justify-center">
                            <img src="https://www.vectorlogo.zone/logos/paytm/paytm-icon.svg" alt="Paytm" className="w-full h-full object-contain" />
                          </div>
                          Paytm
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      className="rounded-[24px] bg-black dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-200 text-white dark:text-black h-16 text-xl font-black transition-all active:scale-[0.97] flex-1 ml-4 shadow-xl shadow-slate-200 dark:shadow-none"
                      onClick={handleConfirmRide}
                    >
                      Confirm {selectedVehicle}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STATE 3: Searching */}
            {flowState === 'SEARCHING' && (
              <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden  flex flex-col items-center justify-center p-8 text-center bg-white/95 dark:bg-slate-950/95 backdrop-blur">
                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute inset-4 bg-blue-200 dark:bg-blue-800/50 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute inset-2 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Search className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Finding your ride</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Connecting you to drivers nearby...</p>

                {/* Action / Payment modifier */}
                <div className="mt-6 flex flex-col gap-3 w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{paymentMethod}</span>
                        </div>
                        <span className="text-blue-600 text-sm font-semibold">Change</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem onClick={() => setPaymentMethod('Cash')}>Cash</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPaymentMethod('Visa •••• 1234')}>Visa •••• 1234</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPaymentMethod('Paytm')}>Paytm</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="w-full h-12 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-xl" onClick={() => setFlowState('IDLE')}>
                    Cancel Request
                  </Button>
                </div>
              </Card>
            )}

            {/* STATE 4: Accepted / Driver Incoming */}
            {flowState === 'DRIVER_ASSIGNED' && (
              <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 bg-white dark:bg-slate-950">
                <div className="bg-blue-600 text-white p-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-bold text-2xl mb-1">2 min</h3>
                      <p className="text-blue-100 text-sm">Driver is arriving soon</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
                      Economy
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="p-5 flex items-center justify-between border-b dark:border-slate-800">
                    <div className="flex gap-4 items-center">
                      <div className="relative">
                        <Avatar className="w-14 h-14 border-2 border-white dark:border-slate-950 shadow">
                          <AvatarImage src="https://ui.shadcn.com/avatars/03.png" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex items-center gap-1 px-1.5 py-0.5 rounded shadow-sm border dark:border-slate-800 text-[10px] font-bold">
                          <span>4.9</span> <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">Michael</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Toyota Camry - White</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded uppercase font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wider">
                        NYC 482
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2 text-slate-700 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-900">
                      <Phone className="w-4 h-4" /> Call
                    </Button>
                    <Button className="flex-1 rounded-xl h-12 gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white" onClick={startTrip}>
                      <MessageSquare className="w-4 h-4" /> Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* STATE 5: In Ride */}
            {flowState === 'IN_RIDE' && (
              <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 bg-white">
                <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-slate-200 text-xs font-medium opacity-80 uppercase tracking-widest">Arrival Estimate</p>
                    <h3 className="font-bold text-xl drop-shadow-sm flex items-center gap-2"><Clock className="w-5 h-5" /> Dropoff at {getDropoffTime(tripDuration)}</h3>
                  </div>
                  <Badge className="bg-emerald-800 hover:bg-emerald-900 border-none px-3 py-1 text-sm shadow-sm">
                    {formatTime(currentTime)}
                  </Badge>
                </div>
                <div className="p-4 bg-slate-50 border-b flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Navigation className="w-5 h-5 text-emerald-600" />
                      <p className="font-medium text-slate-800 dark:text-slate-900">123 Broadway, New York</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-500">Edit</Button>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-slate-600" />
                          <span className="font-medium text-slate-800">{paymentMethod}</span>
                        </div>
                        <span className="text-blue-600 text-sm font-semibold">Change</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem onClick={() => setPaymentMethod('Cash')}>Cash</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPaymentMethod('Visa •••• 1234')}>Visa •••• 1234</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPaymentMethod('Paytm')}>Paytm</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl flex-1 h-14 bg-slate-50">
                      <Phone className="w-5 h-5 text-slate-700 mr-2" /> Call Driver
                    </Button>

                    {/* CHAT SHEET TRIGGGER */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="rounded-xl flex-1 h-14 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 relative">
                          <MessageSquare className="w-5 h-5 mr-2" /> Chat
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">1</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="h-[70vh] sm:h-[600px] flex flex-col rounded-t-3xl sm:rounded-xl">
                        <SheetHeader className="text-left border-b pb-4 shrink-0">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="https://ui.shadcn.com/avatars/03.png" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                              <SheetTitle>Michael</SheetTitle>
                              <SheetDescription>Toyota Camry • White</SheetDescription>
                            </div>
                          </div>
                        </SheetHeader>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-4">
                          {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-900 rounded-bl-sm'}`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Chat Input Area */}
                        <div className="pt-4 border-t flex gap-2 shrink-0">
                          <Input
                            placeholder="Type a message..."
                            className="rounded-full h-12"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && chatMessage.trim()) {
                                setMessages([...messages, { sender: 'user', text: chatMessage }]);
                                setChatMessage('');
                                // Mock auto-reply
                                setTimeout(() => {
                                  setMessages(prev => [...prev, { sender: 'driver', text: 'Got it!' }]);
                                }, 1500);
                              }
                            }}
                          />
                          <Button
                            className="rounded-full w-12 h-12 p-0 bg-blue-600 hover:bg-blue-700 shrink-0"
                            onClick={() => {
                              if (chatMessage.trim()) {
                                setMessages([...messages, { sender: 'user', text: chatMessage }]);
                                setChatMessage('');
                                // Mock auto-reply
                                setTimeout(() => {
                                  setMessages(prev => [...prev, { sender: 'driver', text: 'Got it!' }]);
                                }, 1500);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white ml-[-2px] mt-[2px]"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* Fast forward the simulation */}
                  <Button variant="default" className="w-full rounded-xl h-14 bg-slate-900 text-white text-lg font-medium shadow-md hover:bg-black transition-colors" onClick={completeTrip}>
                    End Trip
                  </Button>
                </div>
              </Card>
            )}

            {/* STATE 6: Completed / Rating */}
            {flowState === 'POST_RIDE' && (
              <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 bg-white p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-emerald-600 text-2xl">✓</span>
                  </div>
                  <h2 className="text-2xl font-bold">You arrived!</h2>
                  <p className="text-slate-500 mt-1">Hope you enjoyed the ride with Michael</p>
                </div>

                <div className="bg-slate-50 border rounded-2xl p-4 mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Trip Fare</span>
                    <span className="font-bold font-mono text-lg">$14.50</span>
                  </div>
                  {tip > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 animate-in fade-in slide-in-from-top-1">
                      <span className="text-sm font-medium">Tip</span>
                      <span className="font-bold font-mono">+${tip.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                    <span className="flex items-center gap-2 text-slate-500"><CreditCard className="w-4 h-4" /> Paid with Visa 4242</span>
                    {tip > 0 && <span className="font-bold text-slate-900 font-mono">${(14.50 + tip).toFixed(2)}</span>}
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-medium mb-3 text-center">Add a tip for Michael</p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 5].map((amount) => (
                      <Button
                        key={amount}
                        variant={tip === amount && !showCustomTip ? "default" : "outline"}
                        className={`flex-1 rounded-xl h-12 font-bold ${tip === amount && !showCustomTip ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-600 dark:text-slate-300'}`}
                        onClick={() => {
                          setTip(amount);
                          setShowCustomTip(false);
                        }}
                      >
                        ${amount}
                      </Button>
                    ))}
                    <Button
                      variant={showCustomTip ? "default" : "outline"}
                      className={`flex-1 rounded-xl h-12 font-bold ${showCustomTip ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-600 dark:text-slate-300'}`}
                      onClick={() => setShowCustomTip(!showCustomTip)}
                    >
                      Other
                    </Button>
                  </div>

                  {showCustomTip && (
                    <div className="relative animate-in slide-in-from-top-2 fade-in">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <Input
                        type="number"
                        placeholder="Enter custom amount"
                        className="h-12 pl-8 rounded-xl border-slate-200"
                        value={customTipValue}
                        onChange={(e) => {
                          setCustomTipValue(e.target.value);
                          setTip(parseFloat(e.target.value) || 0);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="text-center mb-6">
                  <p className="font-medium mb-3">Rate your driver</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-0 ${rating >= star ? 'text-yellow-400' : 'text-slate-200'}`}
                      >
                        <Star className={`w-10 h-10 ${rating >= star ? 'fill-yellow-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-black hover:bg-slate-800 h-14 rounded-xl text-lg text-white" disabled={rating === 0} onClick={resetFlow}>
                  {rating > 0 ? 'Submit Rating' : 'Rate to continue'}
                </Button>
              </Card>
            )}

          </div>
        </div>
      </main>

    </div>
  );
}
