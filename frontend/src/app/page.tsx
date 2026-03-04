'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Search, Calendar, Menu, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TripsView } from '@/components/dashboard/TripsView';
import { PaymentsView } from '@/components/dashboard/PaymentsView';
import { SettingsView } from '@/components/dashboard/SettingsView';
import LocationSearch from '@/components/LocationSearch';

// New Modular Components
import { SidebarMenu } from '@/components/layout/SidebarMenu';
import { RideSelection } from '@/components/booking/RideSelection';
import { TripStatus } from '@/components/booking/TripStatus';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'BOOKING' | 'TRIPS' | 'PAYMENTS' | 'SETTINGS'>('BOOKING');
  const [flowState, setFlowState] = useState<FlowState>('IDLE');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [tripDuration] = useState(12);

  const [pickup, setPickup] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState<[number, number] | null>(null);
  const [driverLoc, setDriverLoc] = useState<[number, number] | null>(null);

  const [pickupText, setPickupText] = useState('Current Location');
  const [dropoffText, setDropoffText] = useState('');

  const [selectedVehicle, setSelectedVehicle] = useState<'Economy' | 'Comfort' | 'XL' | 'Shared' | 'EV'>('Economy');
  const [sharedSeats, setSharedSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Visa •••• 1234' | 'Paytm'>('Visa •••• 1234');

  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState<string>('');

  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');

  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'driver', text: 'I am arriving in 2 minutes.' },
    { sender: 'user', text: 'Okay, I am outside.' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie('authToken');
    const isAuth = localStorage.getItem('isAuthenticated');

    if (!token || !isAuth) {
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem('isAuthenticated');
      router.push('/login');
    } else {
      const storedName = localStorage.getItem('user_name');
      const storedAvatar = localStorage.getItem('profile_image');
      if (storedName) setUserName(storedName);
      if (storedAvatar) setProfileImage(storedAvatar);
      setIsAuthChecking(false);
    }
  }, [router]);

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  const getDropoffTime = (minutes?: number) => formatTime(new Date(currentTime.getTime() + (minutes || tripDuration) * 60000));

  const handleFindRide = () => setFlowState('SELECTING_RIDE');
  const handleConfirmRide = () => {
    setFlowState('SEARCHING');
    setTimeout(() => {
      if (pickup) setDriverLoc([pickup[0] + 0.005, pickup[1] + 0.005]);
      else setDriverLoc([40.7200, -73.9900]);
      setFlowState('DRIVER_ASSIGNED');
    }, 2000);
  };

  const renderPaymentIcon = (method: string) => {
    const { Banknote, CreditCard } = require('lucide-react');
    if (method === 'Cash') return <Banknote className="w-5 h-5 text-green-600" />;
    if (method === 'Paytm') return <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="w-5 h-5 object-contain" />;
    return <CreditCard className="w-5 h-5 text-slate-600" />;
  };

  if (isAuthChecking) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium animate-pulse">Loading securely...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex overflow-hidden bg-slate-50 font-sans">
      <SidebarMenu
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userName}
        setUserName={setUserName}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        avatarList={AVATAR_LIST}
      />

      <main className="flex-1 relative flex flex-col h-full w-full">
        {/* Mobile Header */}
        <header className="md:hidden absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-transparent pointer-events-none">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full shadow-lg pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur">
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col bg-white dark:bg-slate-950">
              <div className="p-6">
                <h2 className="text-xl font-bold">NexRide</h2>
                <nav className="mt-6 flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" onClick={() => { setActiveTab('BOOKING'); setIsSidebarOpen(false); }}>Booking</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { setActiveTab('TRIPS'); setIsSidebarOpen(false); }}>Trips</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { setActiveTab('PAYMENTS'); setIsSidebarOpen(false); }}>Payments</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { setActiveTab('SETTINGS'); setIsSidebarOpen(false); }}>Settings</Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <main className="flex-1 relative flex flex-col h-full w-full">
            <div className={`absolute inset-0 transition-all duration-1000 ${activeTab === 'BOOKING' ? 'opacity-100 blur-0 scale-100' : 'opacity-40 blur-sm scale-110'}`}>
              <DynamicMap
                pickup={pickup}
                dropoff={dropoff}
                driverLocation={driverLoc}
                onMapClick={(lat: number, lon: number) => {
                  if (!pickup) {
                    setPickup([lat, lon]);
                    setPickupText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
                  } else if (!dropoff) {
                    setDropoff([lat, lon]);
                    setDropoffText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
                  }
                }}
              />
            </div>

            <div className={`absolute inset-0 z-10 pointer-events-none flex flex-col p-6 md:p-10 ${activeTab !== 'BOOKING' ? 'hidden' : ''}`}>
              {/* Search Card Overlay */}
              {(flowState === 'IDLE' || flowState === 'SEARCHING') && flowState !== 'SEARCHING' && (
                <Card className="pointer-events-auto glass-card max-w-[440px] shadow-2xl rounded-3xl border-0 overflow-hidden animate-in slide-in-from-left-10 duration-500">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-3xl font-black italic tracking-tighter">Where to?</CardTitle>
                    <CardDescription className="text-base text-slate-500">Find your next destination</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8">
                    <div className="relative flex flex-col gap-4">
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400 z-10"></div>
                        <LocationSearch placeholder="Enter pickup location" value={pickupText} onChange={setPickupText} onSelect={(lat, lon, name) => { setPickup([lat, lon]); setPickupText(name); }} />
                      </div>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-black z-10"></div>
                        <LocationSearch placeholder="Enter dropoff location" value={dropoffText} onChange={setDropoffText} onSelect={(lat, lon, name) => { setDropoff([lat, lon]); setDropoffText(name); }} />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant={isScheduled ? "outline" : "default"} className={`flex-1 h-14 rounded-2xl font-bold ${!isScheduled ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 shadow-lg' : ''}`} onClick={() => setIsScheduled(false)}><Clock className="w-5 h-5 mr-3" /> Now</Button>
                      <Dialog>
                        <DialogTrigger asChild><Button variant={isScheduled ? "default" : "outline"} className={`flex-1 h-14 rounded-2xl font-bold ${isScheduled ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 shadow-lg' : ''}`}><Calendar className="w-5 h-5 mr-3" /> {isScheduled ? scheduleTime : 'Later'}</Button></DialogTrigger>
                        <DialogContent className="glass-card border-0">
                          <DialogHeader><DialogTitle className="text-2xl font-black">Schedule a Ride</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-6">
                            <Select onValueChange={setScheduleTime}><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select Pickup Time" /></SelectTrigger>
                              <SelectContent><SelectItem value="08:00 AM">08:00 AM</SelectItem><SelectItem value="09:00 AM">09:00 AM</SelectItem></SelectContent></Select>
                          </div>
                          <DialogFooter><Button className="w-full h-14 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100" onClick={() => setIsScheduled(true)}>Set Schedule</Button></DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-10 px-8">
                    <Button className="w-full h-[64px] text-xl font-black rounded-2xl bg-black dark:bg-white text-white dark:text-black premium-shadow transition-all active:scale-[0.98]" onClick={handleFindRide} disabled={!dropoffText}><Search className="w-6 h-6 mr-3" /> {isScheduled ? `Book for ${scheduleTime}` : 'Search NexRide'}</Button>
                  </CardFooter>
                </Card>
              )}

              {flowState === 'SELECTING_RIDE' && (
                <div className="pointer-events-auto max-w-[440px] animate-in slide-in-from-left-10 duration-500">
                  <RideSelection
                    selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle}
                    sharedSeats={sharedSeats} setSharedSeats={setSharedSeats}
                    paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                    getDropoffTime={getDropoffTime} tripDuration={tripDuration}
                    renderPaymentIcon={renderPaymentIcon} onConfirm={handleConfirmRide} onBack={() => setFlowState('IDLE')}
                  />
                </div>
              )}

              <div className="pointer-events-auto max-w-[440px] animate-in slide-in-from-left-10 duration-500">
                <TripStatus
                  flowState={flowState} selectedVehicle={selectedVehicle} userName={userName}
                  paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                  rating={rating} setRating={setRating}
                  tip={tip} setTip={setTip}
                  showCustomTip={showCustomTip} setShowCustomTip={setShowCustomTip}
                  customTipValue={customTipValue} setCustomTipValue={setCustomTipValue}
                  chatMessage={chatMessage} setChatMessage={setChatMessage}
                  messages={messages} setMessages={setMessages}
                  currentTime={currentTime} tripDuration={tripDuration}
                  getDropoffTime={getDropoffTime} formatTime={formatTime}
                  onCancel={() => setFlowState('IDLE')}
                  onStartTrip={() => setFlowState('IN_RIDE')}
                  onCompleteTrip={() => { setFlowState('POST_RIDE'); setDriverLoc(null); }}
                  onReset={() => { setDropoff(null); setDriverLoc(null); setDropoffText(''); setFlowState('IDLE'); setRating(0); setTip(0); }}
                />
              </div>
            </div>

            {(activeTab === 'TRIPS' || activeTab === 'PAYMENTS' || activeTab === 'SETTINGS') && (
              <div className="absolute inset-0 z-20 bg-slate-50/50 dark:bg-black/50 backdrop-blur-xl animate-in fade-in duration-700">
                {activeTab === 'TRIPS' && <TripsView />}
                {activeTab === 'PAYMENTS' && <PaymentsView />}
                {activeTab === 'SETTINGS' && <SettingsView />}
              </div>
            )}
          </main>
        </div>
      </main>
    </div>
  );
}
