'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Clock, CreditCard, ChevronRight, Menu, Phone, MessageSquare, Star, Search, Car, Loader2, Calendar } from 'lucide-react';

const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">Loading...</div>
});

type FlowState = 'IDLE' | 'SELECTING_RIDE' | 'SEARCHING' | 'ACCEPTED' | 'IN_RIDE' | 'COMPLETED';

export default function Home() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userName, setUserName] = useState('User');
  const [flowState, setFlowState] = useState<FlowState>('IDLE');

  // Mocks
  const [pickup, setPickup] = useState<[number, number]>([40.7128, -74.0060]); // NYC Start
  const [dropoff, setDropoff] = useState<[number, number] | null>(null);
  const [driverLoc, setDriverLoc] = useState<[number, number] | null>(null);

  // Inputs
  const [pickupText, setPickupText] = useState('Current Location');
  const [dropoffText, setDropoffText] = useState('');

  // Rating
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Basic auth check
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      router.push('/login');
    } else {
      const storedName = localStorage.getItem('userName');
      if (storedName) setUserName(storedName);
      setIsAuthChecking(false);
    }
  }, [router]);

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
    setDropoff([40.7306, -73.9866]); // Simulate selecting a dropoff in map
    setFlowState('SELECTING_RIDE');
  };

  const handleConfirmRide = () => {
    setFlowState('SEARCHING');
    setTimeout(() => {
      setDriverLoc([40.7200, -73.9900]);
      setFlowState('ACCEPTED');
    }, 2000);
  };

  const startTrip = () => {
    setFlowState('IN_RIDE');
    // Simulate map moving
    setPickup([40.7200, -73.9900]);
  };

  const completeTrip = () => {
    setFlowState('COMPLETED');
    setDriverLoc(null);
  };

  const resetFlow = () => {
    setDropoff(null);
    setDriverLoc(null);
    setDropoffText('');
    setFlowState('IDLE');
    setRating(0);
  };

  return (
    <div className="relative h-screen w-full flex overflow-hidden bg-slate-50 font-sans">

      {/* Sidebar Navigation - Common App Style */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full z-10 shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">R</span>
            RideShare
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start font-medium bg-slate-100">Booking</Button>
          <Button variant="ghost" className="w-full justify-start text-slate-500">My Trips</Button>
          <Button variant="ghost" className="w-full justify-start text-slate-500">Payments</Button>
          <Button variant="ghost" className="w-full justify-start text-slate-500">Settings</Button>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://ui.shadcn.com/avatars/02.png" />
              <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-slate-500">5.0 ★ Rating</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col h-full w-full">
        {/* Mobile Header */}
        <header className="md:hidden absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-transparent pointer-events-none">
          <Button variant="secondary" size="icon" className="rounded-full shadow-lg pointer-events-auto bg-white/90 backdrop-blur">
            <Menu className="w-5 h-5 text-slate-700" />
          </Button>
          <Avatar className="pointer-events-auto border-2 border-white shadow-lg">
            <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">RG</AvatarFallback>
          </Avatar>
        </header>

        {/* Map Area */}
        <div className="absolute inset-0 z-0">
          <DynamicMap pickup={pickup} dropoff={dropoff} driverLocation={driverLoc} showRoute={flowState === 'IN_RIDE'} />
        </div>

        {/* Floating UI Overlay Base */}
        <div className="absolute bottom-0 left-0 right-0 md:left-6 md:top-6 md:bottom-auto md:w-[400px] z-10 pointer-events-none">

          {/* STATE 1: IDLE / Search Location */}
          {flowState === 'IDLE' && (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-2xl border-0 overflow-hidden animate-in slide-in-from-bottom-5">
              <CardHeader className="bg-white pb-4">
                <CardTitle className="text-xl">Where to?</CardTitle>
                <CardDescription>Find a ride instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 bg-white pb-6">
                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"></div>
                  <Input
                    value={pickupText}
                    onChange={(e) => setPickupText(e.target.value)}
                    className="pl-8 bg-slate-50 border-transparent focus-visible:ring-black"
                  />
                </div>
                <div className="absolute left-4 top-[90px] bottom-[110px] w-0.5 bg-slate-200"></div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-sm bg-blue-600"></div>
                  <Input
                    placeholder="Enter Dropoff location"
                    value={dropoffText}
                    onChange={(e) => setDropoffText(e.target.value)}
                    className="pl-8 bg-slate-100 border-transparent font-medium focus-visible:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button variant="outline" className="flex-1 justify-start font-normal text-slate-600">
                    <Clock className="w-4 h-4 mr-2" /> Now
                  </Button>
                  <Button variant="outline" className="flex-1 justify-start font-normal text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" /> Schedule
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="bg-white pt-2 pb-6 md:pb-4 border-t border-slate-100">
                <Button className="w-full bg-black hover:bg-slate-800 text-white text-lg h-12 rounded-xl" onClick={handleFindRide}>
                  Search Routes
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* STATE 2: Select Ride */}
          {flowState === 'SELECTING_RIDE' && (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
              <div className="p-4 bg-white flex items-center justify-between border-b">
                <h3 className="font-semibold text-lg">Choose a ride</h3>
                <Button variant="ghost" size="sm" onClick={() => setFlowState('IDLE')}>Cancel</Button>
              </div>
              <CardContent className="p-0 bg-white">
                <div className="overflow-y-auto max-h-[40vh] md:max-h-[500px]">
                  {/* Economy Option */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-100 cursor-pointer hover:bg-slate-50 bg-blue-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-slate-200 rounded flex items-center justify-center">
                        <Car className="text-slate-500 w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">Economy <span className="text-slate-500 font-normal text-sm">👤 4</span></h4>
                        </div>
                        <p className="text-sm text-slate-500">2 min • 15:34 dropoff</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">$14.50</p>
                    </div>
                  </div>

                  {/* Comfort Option */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-100 cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-slate-200 rounded flex items-center justify-center">
                        <Car className="text-slate-600 w-9 h-9" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">Comfort <span className="text-slate-500 font-normal text-sm">👤 4</span></h4>
                        </div>
                        <p className="text-sm text-slate-500">4 min • 15:32 dropoff</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">$21.20</p>
                    </div>
                  </div>

                  {/* XL Option */}
                  <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-slate-200 rounded flex items-center justify-center">
                        <Car className="text-slate-700 w-10 h-10" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">XL <span className="text-slate-500 font-normal text-sm">👤 6</span></h4>
                        </div>
                        <p className="text-sm text-slate-500">6 min • 15:34 dropoff</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">$28.90</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center text-sm font-medium text-slate-700">
                      <CreditCard className="w-4 h-4 mr-2" /> Visa •••• 4242
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg h-12 rounded-xl" onClick={handleConfirmRide}>
                    Confirm Economy
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STATE 3: Searching */}
          {flowState === 'SEARCHING' && (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden  flex flex-col items-center justify-center p-8 text-center bg-white/95 backdrop-blur">
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-4 bg-blue-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute inset-2 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Search className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Finding your ride</h3>
              <p className="text-slate-500 text-sm">Connecting you to drivers nearby...</p>

              <Button variant="outline" className="mt-8 rounded-full" onClick={() => setFlowState('IDLE')}>
                Cancel Request
              </Button>
            </Card>
          )}

          {/* STATE 4: Accepted / Driver Incoming */}
          {flowState === 'ACCEPTED' && (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 bg-white">
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
                <div className="p-5 flex items-center justify-between border-b">
                  <div className="flex gap-4 items-center">
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-white shadow">
                        <AvatarImage src="https://ui.shadcn.com/avatars/03.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white flex items-center gap-1 px-1.5 py-0.5 rounded shadow-sm border text-[10px] font-bold">
                        <span>4.9</span> <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Michael</h4>
                      <p className="text-slate-500 text-sm">Toyota Camry - White</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-slate-100 px-3 py-1.5 rounded uppercase font-mono font-bold text-slate-700 tracking-wider">
                      NYC 482
                    </div>
                  </div>
                </div>

                <div className="p-4 flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2 text-slate-700">
                    <Phone className="w-4 h-4" /> Call
                  </Button>
                  <Button className="flex-1 rounded-xl h-12 gap-2 bg-slate-900 hover:bg-black text-white" onClick={startTrip}>
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
                <div>
                  <p className="text-emerald-100 text-sm uppercase font-semibold tracking-wider mb-1">Heading to Destination</p>
                  <h3 className="font-bold text-xl drop-shadow-sm">Dropoff in 12 min</h3>
                </div>
                <Badge className="bg-emerald-800 hover:bg-emerald-900 border-none px-3 py-1 text-sm">
                  15:46
                </Badge>
              </div>
              <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Navigation className="w-5 h-5 text-emerald-600" />
                  <p className="font-medium text-slate-800">123 Broadway, New York</p>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500">Edit</Button>
              </div>
              <div className="p-4 flex justify-between items-center gap-4">
                <Button variant="outline" className="rounded-xl w-14 h-14 p-0 shrink-0">
                  <Phone className="w-5 h-5 text-slate-700" />
                </Button>
                {/* Invisible button to fast forward the simulation */}
                <Button variant="default" className="flex-1 rounded-xl h-14 bg-slate-900 text-white text-lg font-medium" onClick={completeTrip}>
                  End Trip Simulation
                </Button>
              </div>
            </Card>
          )}

          {/* STATE 6: Completed / Rating */}
          {flowState === 'COMPLETED' && (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 bg-white p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 text-2xl">✓</span>
                </div>
                <h2 className="text-2xl font-bold">You arrived!</h2>
                <p className="text-slate-500 mt-1">Hope you enjoyed the ride with Michael</p>
              </div>

              <div className="bg-slate-50 border rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-500">Trip Fare</span>
                  <span className="font-bold font-mono text-lg">$14.50</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2 text-slate-500"><CreditCard className="w-4 h-4" /> Paid with Visa 4242</span>
                </div>
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
      </main>

    </div>
  );
}
