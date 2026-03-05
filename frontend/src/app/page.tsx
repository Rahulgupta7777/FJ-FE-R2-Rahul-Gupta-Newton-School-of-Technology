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
import { PaymentsView } from '@/components/dashboard/PaymentsView';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { TripsView } from '@/components/dashboard/TripsView';
import LocationSearch from '@/components/LocationSearch';

// New Modular Components
import { SidebarMenu } from '@/components/layout/SidebarMenu';
import { RideSelection } from '@/components/booking/RideSelection';
import { TripStatus } from '@/components/booking/TripStatus';
import { NotificationStack } from '@/components/notifications';
import { useNotifications } from '@/hooks/useNotifications';

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
  const [distanceKm] = useState(8.4); // 12 min * 0.7 km/min

  const [pickup, setPickup] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState<[number, number] | null>(null);
  const [driverLoc, setDriverLoc] = useState<[number, number] | null>(null);

  const [pickupText, setPickupText] = useState('Current Location');
  const [dropoffText, setDropoffText] = useState('');

  const [selectedVehicle, setSelectedVehicle] = useState<'Economy' | 'Comfort' | 'XL' | 'Shared' | 'EV'>('Economy');
  const [sharedSeats, setSharedSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Visa •••• 1234' | 'Paytm'>('Visa •••• 1234');

  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedHour, setSelectedHour] = useState("09");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');

  const { notifications, addNotification, removeNotification } = useNotifications();
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'driver', text: 'I am arriving in 2 minutes.' },
    { sender: 'user', text: 'Okay, I am outside.' },
  ]);

  // Handle flow state alerts
  useEffect(() => {
    switch (flowState) {
      case 'DRIVER_ASSIGNED':
        addNotification({
          title: 'Driver Assigned',
          message: 'Arjun (5.0★) is arriving in 2 minutes.',
          type: 'ride'
        });
        break;
      case 'IN_RIDE':
        addNotification({
          title: 'Trip Started',
          message: 'Safe journey! You will reach your destination in 12 minutes.',
          type: 'ride'
        });
        break;
      case 'POST_RIDE':
        addNotification({
          title: 'Arrived!',
          message: 'You have reached your destination. Please rate your experience.',
          type: 'ride'
        });
        break;
    }
  }, [flowState, addNotification]);

  // Promotion Alert
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        title: 'Promotion Alert 🎁',
        message: 'Get 25% off on your next Shared ride! Use code NEX25.',
        type: 'promotion'
      });
    }, 15000);
    return () => clearTimeout(timer);
  }, [addNotification]);

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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium animate-pulse">Loading securely...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex overflow-hidden bg-background font-sans transition-colors duration-500">
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
              <Button variant="secondary" size="icon" className="rounded-full shadow-lg pointer-events-auto bg-white/90 dark:bg-black/90 backdrop-blur border-0">
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 flex flex-col bg-background border-0">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <img src="/cab_car_logos/newlog.png" alt="Logo" className="w-8 h-8 object-contain" />
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">NexRide</span>
                </div>
                <nav className="flex flex-col gap-2">
                  <Button variant="ghost" className={`justify-start h-12 rounded-xl font-bold ${activeTab === 'BOOKING' ? 'bg-slate-100 dark:bg-white/10' : ''}`} onClick={() => { setActiveTab('BOOKING'); setIsSidebarOpen(false); }}>Booking</Button>
                  <Button variant="ghost" className={`justify-start h-12 rounded-xl font-bold ${activeTab === 'TRIPS' ? 'bg-slate-100 dark:bg-white/10' : ''}`} onClick={() => { setActiveTab('TRIPS'); setIsSidebarOpen(false); }}>Trips</Button>
                  <Button variant="ghost" className={`justify-start h-12 rounded-xl font-bold ${activeTab === 'PAYMENTS' ? 'bg-slate-100 dark:bg-white/10' : ''}`} onClick={() => { setActiveTab('PAYMENTS'); setIsSidebarOpen(false); }}>Payments</Button>
                  <Button variant="ghost" className={`justify-start h-12 rounded-xl font-bold ${activeTab === 'SETTINGS' ? 'bg-slate-100 dark:bg-white/10' : ''}`} onClick={() => { setActiveTab('SETTINGS'); setIsSidebarOpen(false); }}>Settings</Button>
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
                showRoute={!!(pickup && dropoff) && ['SELECTING_RIDE', 'SEARCHING', 'DRIVER_ASSIGNED', 'IN_RIDE'].includes(flowState)}
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
                      <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400 z-10 transition-colors group-focus-within/input:bg-black"></div>
                        <LocationSearch
                          placeholder="Enter pickup location"
                          value={pickupText}
                          onChange={setPickupText}
                          onSelect={(lat, lon, name) => { setPickup([lat, lon]); setPickupText(name); }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-black dark:hover:text-white transition-all"
                          onClick={() => {
                            if ("geolocation" in navigator) {
                              navigator.geolocation.getCurrentPosition((pos) => {
                                const { latitude, longitude } = pos.coords;
                                setPickup([latitude, longitude]);
                                setPickupText("Current Location");
                              });
                            }
                          }}
                        >
                          <div className="relative flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full border-2 border-current"></div>
                            <div className="absolute w-1 h-1 bg-current rounded-full"></div>
                            <div className="absolute -top-1 w-0.5 h-1.5 bg-current"></div>
                            <div className="absolute -bottom-1 w-0.5 h-1.5 bg-current"></div>
                            <div className="absolute -left-1 w-1.5 h-0.5 bg-current"></div>
                            <div className="absolute -right-1 w-1.5 h-0.5 bg-current"></div>
                          </div>
                        </Button>
                      </div>
                      <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-black dark:bg-white z-10 transition-transform group-focus-within/input:scale-110"></div>
                        <LocationSearch
                          placeholder="Enter dropoff location"
                          value={dropoffText}
                          onChange={setDropoffText}
                          onSelect={(lat, lon, name) => { setDropoff([lat, lon]); setDropoffText(name); }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button variant={isScheduled ? "outline" : "default"} className={`flex-1 h-14 rounded-2xl font-bold ${!isScheduled ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 shadow-lg' : ''}`} onClick={() => setIsScheduled(false)}><Clock className="w-5 h-5 mr-3" /> Now</Button>
                      <Dialog>
                        <DialogTrigger asChild><Button variant={isScheduled ? "default" : "outline"} className={`flex-1 h-14 rounded-2xl font-bold ${isScheduled ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 shadow-lg' : ''}`}><Calendar className="w-5 h-5 mr-3" /> {isScheduled ? scheduleTime : 'Later'}</Button></DialogTrigger>
                        <DialogContent className="glass-card shadow-3xl border-0 p-0 overflow-hidden max-w-[400px] rounded-[32px]">
                          <div className="p-8 space-y-8 bg-background">
                            <DialogHeader>
                              <DialogTitle className="text-3xl font-black italic tracking-tighter">Schedule a ride</DialogTitle>
                              <p className="text-slate-500 font-medium">Choose a time for your pickup</p>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Date</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                  {['Today', 'Tomorrow', 'Oct 14', 'Oct 15'].map((day) => (
                                    <button
                                      key={day}
                                      onClick={() => setSelectedDate(day)}
                                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedDate === day ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                      {day}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Time</label>
                                <div className="flex items-center justify-between gap-4 py-4 border-y border-slate-100 dark:border-white/5">
                                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative">
                                    <select
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      value={selectedHour}
                                      onChange={(e) => setSelectedHour(e.target.value)}
                                    >
                                      {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                    <span className="text-3xl font-black group-hover:scale-110 transition-transform">{selectedHour}</span>
                                    <span className="text-[10px] font-bold text-slate-400">HOUR</span>
                                  </div>
                                  <span className="text-2xl font-black text-slate-300">:</span>
                                  <div className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative">
                                    <select
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      value={selectedMinute}
                                      onChange={(e) => setSelectedMinute(e.target.value)}
                                    >
                                      {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <span className="text-3xl font-black group-hover:scale-110 transition-transform">{selectedMinute}</span>
                                    <span className="text-[10px] font-bold text-slate-400">MIN</span>
                                  </div>
                                  <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                                    <button
                                      onClick={() => setSelectedPeriod("AM")}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${selectedPeriod === "AM" ? 'bg-white dark:bg-black shadow-sm' : 'text-slate-400'}`}
                                    >
                                      AM
                                    </button>
                                    <button
                                      onClick={() => setSelectedPeriod("PM")}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${selectedPeriod === "PM" ? 'bg-white dark:bg-black shadow-sm' : 'text-slate-400'}`}
                                    >
                                      PM
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <DialogFooter className="pt-2">
                              <Button
                                className="w-full h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-lg font-black premium-shadow transition-all active:scale-[0.98]"
                                onClick={() => {
                                  setIsScheduled(true);
                                  setScheduleTime(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
                                }}
                              >
                                Set pickup time
                              </Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-10 px-8">
                    <Button className="w-full h-[64px] text-xl font-black rounded-2xl bg-black dark:bg-white text-white dark:text-black premium-shadow transition-all active:scale-[0.98]" onClick={handleFindRide} disabled={!dropoffText}><Search className="w-6 h-6 mr-3" /> {isScheduled ? `Book for ${scheduleTime}` : 'Search Ride'}</Button>
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
                    distanceKm={distanceKm}
                    renderPaymentIcon={renderPaymentIcon} onConfirm={handleConfirmRide} onBack={() => setFlowState('IDLE')}
                  />
                </div>
              )}

              <div className="pointer-events-auto max-w-[440px] animate-in slide-in-from-left-10 duration-500">
                <TripStatus
                  pickupText={pickupText} dropoffText={dropoffText}
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
              <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-xl animate-in fade-in duration-700">
                {activeTab === 'TRIPS' && <TripsView />}
                {activeTab === 'PAYMENTS' && <PaymentsView />}
                {activeTab === 'SETTINGS' && <SettingsView />}
              </div>
            )}
          </main>
        </div>
      </main>
      <NotificationStack notifications={notifications} onRemove={removeNotification} />
    </div>
  );
}
