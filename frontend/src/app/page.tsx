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
          <div className="flex-1 relative">
            <DynamicMap 
              pickup={pickup} 
              dropoff={dropoff} 
              driverLoc={driverLoc}
              onMapClick={(lat, lon) => {
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

          <div className={`absolute bottom-0 left-0 right-0 md:left-6 md:top-6 md:bottom-auto md:w-[400px] z-20 pointer-events-none ${activeTab !== 'BOOKING' ? 'hidden' : ''}`}>
            {/* Search Card */}
            {(flowState === 'IDLE' || flowState === 'SEARCHING') && flowState !== 'SEARCHING' && (
              <Card className="pointer-events-auto glass-card shadow-2xl rounded-t-3xl md:rounded-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-5">
                <CardHeader className="bg-transparent pb-2">
                  <CardTitle className="text-xl">Where to?</CardTitle>
                  <CardDescription>Find a ride instantly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 bg-transparent pb-6">
                  <div className="relative flex flex-col gap-3">
                    <LocationSearch placeholder="Enter pickup location" value={pickupText} onChange={setPickupText} onSelect={(lat, lon, name) => { setPickup([lat, lon]); setPickupText(name); }} />
                    <LocationSearch placeholder="Enter Dropoff location" value={dropoffText} onChange={setDropoffText} onSelect={(lat, lon, name) => { setDropoff([lat, lon]); setDropoffText(name); }} />
                  </div>
                  <div className="pt-2 flex gap-3">
                    <Button variant={isScheduled ? "outline" : "default"} className="flex-1 h-12 rounded-xl" onClick={() => setIsScheduled(false)}><Clock className="w-5 h-5 mr-2" /> Now</Button>
                    <Dialog>
                      <DialogTrigger asChild><Button variant={isScheduled ? "default" : "outline"} className="flex-1 h-12 rounded-xl"><Calendar className="w-5 h-5 mr-2" /> {isScheduled ? scheduleTime : 'Schedule'}</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Schedule a Ride</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                          <Select onValueChange={setScheduleTime}><SelectTrigger><SelectValue placeholder="Select Time" /></SelectTrigger>
                          <SelectContent><SelectItem value="08:00 AM">08:00 AM</SelectItem><SelectItem value="09:00 AM">09:00 AM</SelectItem></SelectContent></Select>
                        </div>
                        <DialogFooter><Button className="w-full bg-blue-600" onClick={() => setIsScheduled(true)}>Confirm</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
                <CardFooter className="bg-transparent pt-2 pb-6 border-t border-slate-100">
                  <Button className="w-full h-14 text-lg font-semibold rounded-xl bg-slate-900 text-white" onClick={handleFindRide} disabled={!dropoffText}><Search className="w-5 h-5 mr-2" /> {isScheduled ? `Schedule for ${scheduleTime}` : 'Search Rides'}</Button>
                </CardFooter>
              </Card>
            )}

            {flowState === 'SELECTING_RIDE' && (
              <RideSelection
                selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle}
                sharedSeats={sharedSeats} setSharedSeats={setSharedSeats}
                paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                getDropoffTime={getDropoffTime} tripDuration={tripDuration}
                renderPaymentIcon={renderPaymentIcon} onConfirm={handleConfirmRide} onBack={() => setFlowState('IDLE')}
              />
            )}

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

          <div className={`flex-1 overflow-y-auto ${activeTab === 'BOOKING' ? 'hidden' : ''}`}>
            {activeTab === 'TRIPS' && <TripsView />}
            {activeTab === 'PAYMENTS' && <PaymentsView />}
            {activeTab === 'SETTINGS' && <SettingsView />}
          </div>
        </div>
      </main>
    </div>
  );
}
