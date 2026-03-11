'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { PaymentsView } from '@/components/dashboard/PaymentsView';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { TripsView } from '@/components/dashboard/TripsView';

// New Modular Components
import { SidebarMenu } from '@/components/layout/SidebarMenu';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { SearchRideCard } from '@/components/booking/SearchRideCard';
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
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
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

  const [pickupText, setPickupText] = useState('New Delhi, Delhi, India');
  const [dropoffText, setDropoffText] = useState('');

  const [selectedVehicle, setSelectedVehicle] = useState<'Economy' | 'Comfort' | 'XL' | 'Shared' | 'EV'>('Economy');
  const [sharedSeats, setSharedSeats] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Visa •••• 1234' | 'Paytm'>('Visa •••• 1234');

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
      const storedPhone = localStorage.getItem('user_phone');
      const storedAvatar = localStorage.getItem('profile_image');
      if (storedName) setUserName(storedName);
      if (storedPhone) setPhoneNumber(storedPhone);
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
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />

      <main className="flex-1 relative flex flex-col h-full w-full">
        <MobileHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 relative overflow-hidden flex flex-col mt-16 md:mt-0">
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
              {(flowState === 'IDLE' || flowState === 'SEARCHING') && flowState !== 'SEARCHING' && (
                <SearchRideCard
                  pickupText={pickupText}
                  setPickupText={setPickupText}
                  dropoffText={dropoffText}
                  setDropoffText={setDropoffText}
                  setPickup={setPickup}
                  setDropoff={setDropoff}
                  onSearch={handleFindRide}
                />
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
