'use client';

import { Search, CreditCard, Star, Phone, MessageSquare, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { useState, useEffect } from 'react';
import { Heart, House } from 'lucide-react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'buy-button-id': string;
                'publishable-key': string;
            };
        }
    }
}

interface TripStatusProps {
    pickupText?: string;
    dropoffText?: string;
    flowState: 'IDLE' | 'SELECTING_RIDE' | 'SEARCHING' | 'DRIVER_ASSIGNED' | 'IN_RIDE' | 'POST_RIDE';
    selectedVehicle: string;
    userName: string;
    paymentMethod: 'Cash' | 'Visa •••• 1234' | 'Paytm';
    setPaymentMethod: (m: 'Cash' | 'Visa •••• 1234' | 'Paytm') => void;
    rating: number;
    setRating: (r: number) => void;
    tip: number;
    setTip: (t: number) => void;
    showCustomTip: boolean;
    setShowCustomTip: (s: boolean) => void;
    customTipValue: string;
    setCustomTipValue: (v: string) => void;
    chatMessage: string;
    setChatMessage: (m: string) => void;
    messages: { sender: string; text: string }[];
    setMessages: (msgs: any) => void;
    currentTime: Date;
    tripDuration: number;
    getDropoffTime: (mins?: number) => string;
    formatTime: (date: Date) => string;
    onCancel: () => void;
    onStartTrip: () => void;
    onCompleteTrip: () => void;
    onReset: () => void;
}

export function TripStatus({
    pickupText,
    dropoffText,
    flowState,
    selectedVehicle,
    userName,
    paymentMethod,
    setPaymentMethod,
    rating,
    setRating,
    tip,
    setTip,
    showCustomTip,
    setShowCustomTip,
    customTipValue,
    setCustomTipValue,
    chatMessage,
    setChatMessage,
    messages,
    setMessages,
    currentTime,
    tripDuration,
    getDropoffTime,
    formatTime,
    onCancel,
    onStartTrip,
    onCompleteTrip,
    onReset
}: TripStatusProps) {
    const [timeLeft, setTimeLeft] = useState(2);
    const [isThankYou, setIsThankYou] = useState(false);
    const [postRideStep, setPostRideStep] = useState<'SUMMARY' | 'PAYMENT' | 'FEEDBACK'>('SUMMARY');

    useEffect(() => {
        if (flowState === 'POST_RIDE') {
            const script = document.createElement('script');
            script.src = "https://js.stripe.com/v3/buy-button.js";
            script.async = true;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [flowState]);

    useEffect(() => {
        if (flowState === 'DRIVER_ASSIGNED' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 60000);
            return () => clearInterval(timer);
        }
    }, [flowState, timeLeft]);

    // Handle initial message from driver
    useEffect(() => {
        if (flowState === 'DRIVER_ASSIGNED' && messages.length === 0) {
            setMessages([{ sender: 'driver', text: "Hello! I'm on my way. I'll be there in 2 minutes." }]);
        }
    }, [flowState, messages.length, setMessages]);

    if (isThankYou) {
        return (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in zoom-in-95 bg-white dark:bg-slate-950 p-8 text-center backdrop-blur">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                </div>
                <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Thank You!</h2>
                <p className="text-slate-500 dark:text-slate-400 font-bold mb-8">We've received your feedback. See you soon on your next ride!</p>
                <Button
                    className="w-full h-14 bg-black dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-200 text-white dark:text-black rounded-xl text-lg font-black"
                    onClick={() => {
                        setIsThankYou(false);
                        onReset();
                    }}
                >
                    Back to Home
                </Button>
            </Card>
        );
    }

    if (flowState === 'SEARCHING') {
        return (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden  flex flex-col items-center justify-center p-8 text-center bg-white/95 dark:bg-slate-950/95 backdrop-blur">
                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900/50 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-4 bg-slate-200 dark:bg-slate-800/50 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute inset-2 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black shadow-lg">
                        <Search className="w-8 h-8" />
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Finding your ride</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Connecting you to drivers nearby...</p>

                <div className="mt-6 flex flex-col gap-3 w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{paymentMethod}</span>
                                </div>
                                <span className="text-black dark:text-white text-sm font-semibold">Change</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem onClick={() => setPaymentMethod('Cash')}>Cash</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPaymentMethod('Visa •••• 1234')}>Visa •••• 1234</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPaymentMethod('Paytm')}>Paytm</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" className="w-full h-12 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-xl" onClick={onCancel}>
                        Cancel Request
                    </Button>
                </div>
            </Card>
        );
    }

    if (flowState === 'DRIVER_ASSIGNED') {
        return (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 bg-white dark:bg-slate-950">
                <div className="bg-black dark:bg-white text-white dark:text-black p-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="font-bold text-2xl mb-1">{timeLeft} min</h3>
                            <p className="text-slate-300 dark:text-slate-600 text-sm">Driver is arriving soon</p>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
                            {selectedVehicle}
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
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Arjun</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Maruti Suzuki Dzire - White</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded uppercase font-mono font-bold text-slate-700 dark:text-slate-300 tracking-wider">
                                MH 12 BK 7586
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex gap-3">
                        <Button variant="outline" className="flex-1 rounded-xl h-12 gap-2 text-slate-700 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-900">
                            <Phone className="w-4 h-4" /> Call
                        </Button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button className="flex-1 rounded-xl h-12 gap-2 bg-black dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-black">
                                    <MessageSquare className="w-4 h-4" /> Message
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
                                            <SheetTitle>Arjun</SheetTitle>
                                            <SheetDescription>Maruti Suzuki Dzire • White</SheetDescription>
                                        </div>
                                    </div>
                                </SheetHeader>

                                <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-4">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

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
                                                setTimeout(() => {
                                                    setMessages((prev: any) => [...prev, { sender: 'driver', text: "I'll be there shortly!" }]);
                                                }, 1500);
                                            }
                                        }}
                                    />
                                    <Button
                                        className="rounded-full w-12 h-12 p-0 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 shrink-0"
                                        onClick={() => {
                                            if (chatMessage.trim()) {
                                                setMessages([...messages, { sender: 'user', text: chatMessage }]);
                                                setChatMessage('');
                                                setTimeout(() => {
                                                    setMessages((prev: any) => [...prev, { sender: 'driver', text: "I'll be there shortly!" }]);
                                                }, 1500);
                                            }
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${messages.length % 2 === 0 ? 'text-white dark:text-black' : 'text-white dark:text-black'} ml-[-2px] mt-[2px]`}><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className=''>
                        <Button variant="ghost" className="w-full bg-green-300 mt-2 text-white text-xs uppercase tracking-widest font-black cursor-pointer" onClick={onStartTrip}>Start Journey</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (flowState === 'IN_RIDE') {
        return (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 bg-white dark:bg-slate-950">
                <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
                    <div className="flex flex-col">
                        <p className="text-slate-200 text-xs font-medium opacity-80 uppercase tracking-widest">Arrival Estimate</p>
                        <h3 className="font-bold text-xl drop-shadow-sm flex items-center gap-2"><Clock className="w-5 h-5" /> Dropoff at {getDropoffTime(tripDuration)}</h3>
                    </div>
                    <Badge className="bg-emerald-800 hover:bg-emerald-900 border-none px-3 py-1 text-sm shadow-sm">
                        {formatTime(currentTime)}
                    </Badge>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-800 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Navigation className="w-5 h-5 text-black dark:text-white" />
                            <p className="font-medium text-slate-800 dark:text-slate-200">{dropoffText || "123 Broadway, New York"}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-500">Edit</Button>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{paymentMethod}</span>
                                </div>
                                <span className="text-black dark:text-white text-sm font-semibold">Change</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuItem onClick={() => setPaymentMethod('Cash')}>Cash</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPaymentMethod('Visa •••• 1234')}>Visa •••• 1234</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPaymentMethod('Paytm')}>Paytm</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl flex-1 h-14 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                            <Phone className="w-5 h-5 text-slate-700 dark:text-slate-300 mr-2" /> Call Driver
                        </Button>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="rounded-xl flex-1 h-14 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative">
                                    <MessageSquare className="w-5 h-5 mr-2" /> Chat
                                    <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">1</span>
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
                                            <SheetTitle>Arjun</SheetTitle>
                                            <SheetDescription>Maruti Suzuki Dzire • White</SheetDescription>
                                        </div>
                                    </div>
                                </SheetHeader>

                                <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-4">
                                    {messages.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-black dark:bg-white text-white dark:text-black rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>

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
                                                    setMessages((prev: any) => [...prev, { sender: 'driver', text: 'Got it!' }]);
                                                }, 1500);
                                            }
                                        }}
                                    />
                                    <Button
                                        className="rounded-full w-12 h-12 p-0 bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100 shrink-0"
                                        onClick={() => {
                                            if (chatMessage.trim()) {
                                                setMessages([...messages, { sender: 'user', text: chatMessage }]);
                                                setChatMessage('');
                                                // Mock auto-reply
                                                setTimeout(() => {
                                                    setMessages((prev: any) => [...prev, { sender: 'driver', text: 'Got it!' }]);
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

                    <Button variant="default" className="w-full rounded-xl h-14 bg-slate-900 dark:bg-slate-100 text-white dark:text-black text-lg font-medium shadow-md hover:bg-black dark:hover:bg-white transition-colors" onClick={onCompleteTrip}>
                        End Trip
                    </Button>
                </div>
            </Card>
        );
    }

    if (flowState === 'POST_RIDE') {
        return (
            <Card className="pointer-events-auto shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 bg-white dark:bg-slate-950 p-6 flex flex-col gap-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-between px-2 mb-2">
                    {['SUMMARY', 'PAYMENT', 'FEEDBACK'].map((step, idx) => (
                        <div key={step} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 ${postRideStep === step ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/20' : (idx < ['SUMMARY', 'PAYMENT', 'FEEDBACK'].indexOf(postRideStep) ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')}`}>
                                {idx < ['SUMMARY', 'PAYMENT', 'FEEDBACK'].indexOf(postRideStep) ? '✓' : idx + 1}
                            </div>
                            {idx < 2 && <div className={`h-[2px] w-8 sm:w-16 rounded-full transition-all duration-1000 ${idx < ['SUMMARY', 'PAYMENT', 'FEEDBACK'].indexOf(postRideStep) ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>}
                        </div>
                    ))}
                </div>

                {postRideStep === 'SUMMARY' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-emerald-600 dark:text-emerald-400 text-2xl">✓</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">You arrived!</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Hope you enjoyed the ride with Arjun</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 space-y-4">
                            <div className="flex justify-between items-center text-slate-500">
                                <span className="text-sm font-bold uppercase tracking-wider">Trip Fare</span>
                                <span className="font-black text-slate-900 dark:text-white">₹1200</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-500">
                                <span className="text-sm font-bold uppercase tracking-wider">Tipping</span>
                                <span className="font-black text-emerald-600 dark:text-emerald-400 animate-in fade-in">+₹{tip}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <span className="font-black text-lg text-slate-900 dark:text-white">Total Amount</span>
                                <span className="font-black text-2xl text-blue-600 dark:text-blue-400">₹{1200 + tip}</span>
                            </div>
                        </div>

                        <div>
                            <p className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4 text-center">Add a tip for Arjun</p>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {[80, 160, 400].map((amount) => (
                                    <Button
                                        key={amount}
                                        variant={tip === amount ? "default" : "outline"}
                                        className={`rounded-xl h-12 font-black transition-all ${tip === amount ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'text-slate-500 bg-white dark:bg-white/5 border-slate-200 dark:border-white/5'}`}
                                        onClick={() => { setTip(amount); setShowCustomTip(false); }}
                                    >
                                        ₹{amount}
                                    </Button>
                                ))}
                                <Button
                                    variant={showCustomTip ? "default" : "outline"}
                                    className={`rounded-xl h-12 font-black transition-all ${showCustomTip ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-500 bg-white dark:bg-white/5 border-slate-200 dark:border-white/5'}`}
                                    onClick={() => setShowCustomTip(!showCustomTip)}
                                >
                                    Other
                                </Button>
                            </div>
                            {showCustomTip && (
                                <div className="relative animate-in slide-in-from-top-2 fade-in">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <Input
                                        type="number"
                                        placeholder="Custom amount"
                                        className="h-12 pl-8 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5 font-black"
                                        value={customTipValue}
                                        onChange={(e) => {
                                            setCustomTipValue(e.target.value);
                                            setTip(parseFloat(e.target.value) || 0);
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <Button className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-lg font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all" onClick={() => setPostRideStep('PAYMENT')}>
                            Confirm Fare & Pay
                        </Button>
                    </div>
                )}

                {postRideStep === 'PAYMENT' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Complete Payment</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Your total ride fare is <span className="text-blue-600 dark:text-blue-400 font-black">₹{1200 + tip}</span></p>
                        </div>

                        <div className="p-1 glass-card border-2 border-emerald-500/20 dark:border-emerald-500/10 rounded-[32px] overflow-hidden bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-slate-950 shadow-2xl">
                            <div className="p-6 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <CreditCard className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white">NexRide Checkout</p>
                                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Stripe Secure</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="text-center py-2">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total to Pay</p>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">₹{1200 + tip}</p>
                                </div>
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-2">
                                    <stripe-buy-button
                                        buy-button-id="buy_btn_1T7ZQJ2euZ0ZOKm2yb24A8Si"
                                        publishable-key="pk_test_51T7YFD2euZ0ZOKm2yXRrakX3Rx8UK7OJIdk5XCV4oiaH9ctBu9w44lSDbOhZ7u2aaybFYSqycyPqKEOq0HyhDkUB00wQJlNi06"
                                    >
                                    </stripe-buy-button>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-lg font-black shadow-lg transition-all" onClick={() => setPostRideStep('FEEDBACK')}>
                            Next: Rate Experience
                        </Button>
                        <button className="w-full text-slate-400 dark:text-slate-600 text-sm font-bold uppercase tracking-widest py-2" onClick={() => setPostRideStep('SUMMARY')}>Back to Summary</button>
                    </div>
                )}

                {postRideStep === 'FEEDBACK' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Rate your driver</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">How was your ride with Arjun?</p>
                        </div>

                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`p-1 transition-all hover:scale-125 focus:outline-none ${rating >= star ? 'text-yellow-400' : 'text-slate-100 dark:text-slate-800'}`}
                                >
                                    <Star className={`w-12 h-12 ${rating >= star ? 'fill-yellow-400 shadow-xl' : ''}`} />
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">Add a comment</p>
                            <textarea
                                className="w-full p-5 rounded-[24px] bg-slate-50 dark:bg-slate-900 border-0 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all resize-none h-28 text-base font-medium text-slate-900 dark:text-white shadow-inner"
                                placeholder="Write your feedback..."
                            />
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-100 h-16 rounded-[24px] text-lg text-white dark:text-black font-black shadow-xl"
                            disabled={rating === 0}
                            onClick={() => {
                                const pastTrips = JSON.parse(localStorage.getItem('user_trips') || '[]');
                                const newTrip = {
                                    id: `trip-${Date.now()}`,
                                    date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }),
                                    status: "COMPLETED",
                                    pickup: pickupText || "Current Location",
                                    dropoff: dropoffText || "Destination",
                                    driver: "Arjun (Maruti Suzuki Dzire)",
                                    amount: `₹${1200 + tip}`,
                                    rating: rating,
                                    breakdown: { base: 150, distance: 650, time: 250, fee: 100, tax: 50 + tip }
                                };
                                localStorage.setItem('user_trips', JSON.stringify([newTrip, ...pastTrips]));
                                setIsThankYou(true);
                            }}
                        >
                            {rating > 0 ? 'Submit Feedback' : 'Rate to Finish'}
                        </Button>
                    </div>
                )}
            </Card>
        );
    }

    return null;
}
