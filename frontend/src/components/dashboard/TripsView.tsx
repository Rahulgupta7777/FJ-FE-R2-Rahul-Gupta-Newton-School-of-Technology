"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Calendar, CreditCard } from "lucide-react";

export function TripsView() {
    const trips = [
        {
            id: "trip-1",
            date: "Today, 10:30 AM",
            status: "COMPLETED",
            pickup: "123 Broadway, NYC",
            dropoff: "Central Park West",
            driver: "Michael (Toyota Camry)",
            amount: "$14.50",
            rating: 5,
        },
        {
            id: "trip-2",
            date: "Yesterday, 6:15 PM",
            status: "COMPLETED",
            pickup: "JFK Airport",
            dropoff: "123 Broadway, NYC",
            driver: "Sarah (Honda Accord)",
            amount: "$45.20",
            rating: 4,
        },
        {
            id: "trip-3",
            date: "Oct 12, 9:00 AM",
            status: "CANCELLED",
            pickup: "Times Square",
            dropoff: "Brooklyn Bridge",
            driver: "Unknown",
            amount: "$0.00",
            rating: null,
        },
        {
            id: "trip-4",
            date: "Tomorrow, 8:00 AM",
            status: "SCHEDULED",
            pickup: "123 Broadway, NYC",
            dropoff: "JFK Airport",
            driver: "Pending",
            amount: "~$45.00",
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
                    <Card key={trip.id} className="glass-card border-0 hover:scale-[1.01] transition-all duration-300 ease-out p-2">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    {trip.date}
                                </CardTitle>
                                <CardDescription className="mt-1">{trip.driver}</CardDescription>
                            </div>
                            <Badge
                                variant={trip.status === 'COMPLETED' ? 'default' : trip.status === 'SCHEDULED' ? 'secondary' : 'destructive'}
                                className={trip.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-100' : ''}
                            >
                                {trip.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                {/* Route */}
                                <div className="flex-1">
                                    <div className="relative pl-6 pb-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{trip.pickup}</p>
                                    </div>
                                    <div className="relative pl-6 ml-2">
                                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-sm"></div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{trip.dropoff}</p>
                                    </div>
                                </div>

                                {/* Price & Rating */}
                                <div className="text-right flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[120px]">
                                    <p className="font-bold text-xl">{trip.amount}</p>
                                    {trip.rating && (
                                        <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                                            {trip.rating} <span className="text-yellow-400">★</span>
                                        </p>
                                    )}
                                    {trip.status === 'COMPLETED' && (
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
                                            <CreditCard className="w-3 h-3" /> Paid
                                        </p>
                                    )}
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
