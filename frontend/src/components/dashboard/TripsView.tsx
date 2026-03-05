"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Calendar, CreditCard, ChevronDown, ChevronUp, Info, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TripsView() {
    const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

    const trips = [
        {
            id: "trip-1",
            date: "Today, 10:30 AM",
            status: "COMPLETED",
            pickup: "123 Broadway, NYC",
            dropoff: "Central Park West",
            driver: "Arjun (Maruti Suzuki Dzire)",
            amount: "₹1200",
            rating: 4.88,
            breakdown: {
                base: 150,
                distance: 650,
                time: 250,
                fee: 100,
                tax: 50
            }
        },
        {
            id: "trip-2",
            date: "Yesterday, 6:15 PM",
            status: "COMPLETED",
            pickup: "JFK Airport",
            dropoff: "123 Broadway, NYC",
            driver: "Sarah (Honda Accord)",
            amount: "₹3800",
            rating: 4.5,
            breakdown: {
                base: 500,
                distance: 2200,
                time: 800,
                fee: 200,
                tax: 100
            }
        },
        {
            id: "trip-3",
            date: "Oct 12, 9:00 AM",
            status: "CANCELLED",
            pickup: "Times Square",
            dropoff: "Brooklyn Bridge",
            driver: "Unknown",
            amount: "₹0",
            rating: null,
        },
        {
            id: "trip-4",
            date: "Tomorrow, 8:00 AM",
            status: "SCHEDULED",
            pickup: "123 Broadway, NYC",
            dropoff: "JFK Airport",
            driver: "Pending",
            amount: "~₹3800",
            rating: null,
        }
    ];

    return (
        <div className="p-10 md:p-12 h-screen overflow-y-auto w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="mb-12">
                <h2 className="text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white">My Trips</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Manage your past rides and upcoming schedules.</p>
            </div>

            <div className="space-y-6 pb-20">
                {trips.map((trip) => (
                    <Card
                        key={trip.id}
                        className={`glass-card border-0 transition-all duration-300 ease-out p-1 overflow-hidden cursor-pointer active:scale-[0.99] ${expandedTrip === trip.id ? 'ring-2 ring-black dark:ring-white border-transparent' : 'hover:bg-slate-50/50 dark:hover:bg-white/5'}`}
                        onClick={() => setExpandedTrip(expandedTrip === trip.id ? null : trip.id)}
                    >
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2 font-black tracking-tight">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    {trip.date}
                                </CardTitle>
                                <CardDescription className="mt-1 font-bold">{trip.driver}</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant={trip.status === 'COMPLETED' ? 'default' : trip.status === 'SCHEDULED' ? 'secondary' : 'destructive'}
                                    className={`font-black tracking-widest text-[10px] py-1 ${trip.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-400 border-0' : ''}`}
                                >
                                    {trip.status}
                                </Badge>
                                {expandedTrip === trip.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="relative pl-6 pb-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{trip.pickup}</p>
                                    </div>
                                    <div className="relative pl-6 ml-2">
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-sm"></div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{trip.dropoff}</p>
                                    </div>
                                </div>

                                <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[120px]">
                                    <p className="font-black text-2xl tracking-tighter">{trip.amount}</p>
                                    {trip.rating && (
                                        <div className="flex items-center gap-1.5 mt-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full border border-yellow-200/50 dark:border-yellow-700/30">
                                            <span className="text-xs font-black text-yellow-700 dark:text-yellow-500">{trip.rating}</span>
                                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {expandedTrip === trip.id && trip.breakdown && (
                                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-500">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <Info className="w-3 h-3" /> Fare Breakdown
                                    </h4>
                                    <div className="space-y-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-slate-500">Base Fare</span>
                                            <span>₹{trip.breakdown.base}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-slate-500">Distance Traveled</span>
                                            <span>₹{trip.breakdown.distance}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-slate-500">Time Duration</span>
                                            <span>₹{trip.breakdown.time}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-slate-500">Booking Fee</span>
                                            <span>₹{trip.breakdown.fee}</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t border-slate-200 dark:border-slate-800 pt-3">
                                            <span className="text-slate-500 font-bold italic">Taxes & Fees</span>
                                            <span className="font-bold">₹{trip.breakdown.tax}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black pt-2">
                                            <span className="text-slate-900 dark:text-white">Total Amount</span>
                                            <span className="text-black dark:text-white">{trip.amount}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Button variant="outline" className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest">Get Receipt</Button>
                                        <Button variant="outline" className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest">Support</Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
