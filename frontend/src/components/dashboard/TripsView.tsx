import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Calendar, CreditCard, ChevronDown, ChevronUp, Info, Star, Clock, Download, HelpCircle, TrendingUp, DollarSign } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';

export function TripsView() {
    const [expandedTrip, setExpandedTrip] = useState<string | null>(null);

    const stats = {
        totalTrips: 42,
        totalSpent: "12,450",
        totalDistance: "348",
        avgRating: 4.9
    };

    const handleDownloadReceipt = (trip: any) => {
        const doc = new jsPDF();

        // Receipt Header
        doc.setFontSize(22);
        doc.text("NexRide Receipt", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Receipt ID: ${trip.id}`, 105, 30, { align: "center" });

        // Divider
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Trip Details
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Trip Information", 20, 45);

        doc.setFontSize(11);
        doc.text(`Date: ${trip.date}`, 20, 55);
        doc.text(`Driver: ${trip.driver}`, 20, 62);
        doc.text(`Vehicle: ${trip.vehicle}`, 20, 69);
        doc.text(`Pickup: ${trip.pickup}`, 20, 76);
        doc.text(`Dropoff: ${trip.destination}`, 20, 83);

        // Fare Breakdown
        doc.setFontSize(14);
        doc.text("Fare Breakdown", 20, 100);

        doc.setFontSize(11);
        doc.text(`Base Fare:`, 20, 110);
        doc.text(`₹${trip.breakdown.base}`, 190, 110, { align: "right" });

        doc.text(`Distance (${trip.distance}):`, 20, 117);
        doc.text(`₹${trip.breakdown.distance}`, 190, 117, { align: "right" });

        doc.text(`Time (${trip.duration}):`, 20, 124);
        doc.text(`₹${trip.breakdown.time}`, 190, 124, { align: "right" });

        doc.text(`Long Pickup Fee:`, 20, 131);
        doc.text(`₹0.00`, 190, 131, { align: "right" });

        doc.setFontSize(12);
        doc.text(`Subtotal:`, 20, 145);
        doc.text(`₹${trip.price}`, 190, 145, { align: "right" });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Thank you for riding with NexRide!", 105, 280, { align: "center" });

        doc.save(`NexRide_Receipt_${trip.id}.pdf`);
    };

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
            status: "COMPLETED",
            pickup: "Times Square",
            dropoff: "Brooklyn Bridge",
            driver: "Michael (Toyota Camry)",
            amount: "₹1850",
            rating: 4.9,
            breakdown: {
                base: 250,
                distance: 1200,
                time: 300,
                fee: 50,
                tax: 50
            }
        },
        {
            id: "trip-4",
            date: "Oct 10, 8:00 AM",
            status: "COMPLETED",
            pickup: "123 Broadway, NYC",
            dropoff: "Lower Manhattan",
            driver: "Jessica (Tesla Model 3)",
            amount: "₹2450",
            rating: 5.0,
            breakdown: {
                base: 400,
                distance: 1500,
                time: 400,
                fee: 100,
                tax: 50
            }
        }
    ];

    return (
        <div className="p-6 md:p-12 h-screen overflow-y-auto w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500 pb-24 bg-background">
            <div className="mb-12">
                <h2 className="text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white">Your Trips</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Review your ride history and download receipts.</p>
            </div>

            {/* Ride Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <Card className="glass-card border-0 bg-white/50 dark:bg-white/5 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="p-2 w-fit bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-1">Total Trips</p>
                        <p className="text-2xl font-black">{stats.totalTrips}</p>
                    </div>
                </Card>
                <Card className="glass-card border-0 bg-white/50 dark:bg-white/5 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="p-2 w-fit bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-1">Total KM</p>
                        <p className="text-2xl font-black">{stats.totalDistance}</p>
                    </div>
                </Card>
                <Card className="glass-card border-0 bg-white/50 dark:bg-white/5 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="p-2 w-fit bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                        <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-1">Avg Rating</p>
                        <p className="text-2xl font-black">{stats.avgRating}</p>
                    </div>
                </Card>
                <Card className="glass-card border-0 bg-white/50 dark:bg-white/5 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="p-2 w-fit bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-1">Total Spent</p>
                        <p className="text-2xl font-black">₹{stats.totalSpent}</p>
                    </div>
                </Card>
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
                                    <div className="flex gap-4 items-end">
                                        <div className="text-right">
                                            <p className="font-black text-2xl tracking-tighter mb-1">{trip.amount}</p>
                                        </div>
                                        <div className="text-right border-l border-slate-200 dark:border-white/10 pl-3">
                                            <p className="text-[8px] text-indigo-500 font-black uppercase tracking-widest leading-none">REWARDS</p>
                                            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">
                                                +{(() => {
                                                    const cleanAmount = trip.amount.replace(/[^0-9]/g, '');
                                                    const val = parseInt(cleanAmount);
                                                    return isNaN(val) ? 0 : Math.round(val / 10);
                                                })()}
                                            </p>
                                        </div>
                                    </div>
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
                                    <div className="space-y-3 bg-slate-50 dark:bg-card p-4 rounded-2xl border border-slate-100 dark:border-white/5">
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
                                    <div className="mt-4 flex flex-col gap-4">
                                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 rounded-xl text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                                                <Info className="w-3 h-3" />
                                                <span>FARES MAY VARY BASED ON TRAFFIC AND DEMAND</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm font-bold opacity-60">
                                                <span>Fare Calculation Metrics</span>
                                                <Info className="w-4 h-4" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl">
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Standard Rate</p>
                                                    <p className="text-base font-black">₹10 / km</p>
                                                </div>
                                                <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl">
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Membership</p>
                                                    <p className="text-base font-black text-indigo-600 dark:text-indigo-400">10% Points</p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                Fare is calculated at a base rate of ₹10 per km. Premium vehicle types may carry a multiplier. Members earn 1 reward point for every ₹10 spent.
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="secondary"
                                                className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest"
                                                onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(trip); }}
                                            >
                                                <Download className="w-4 h-4 mr-2" /> Receipt
                                            </Button>
                                            <Button variant="outline" className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest">
                                                <HelpCircle className="w-4 h-4 mr-2" /> Support
                                            </Button>
                                        </div>
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
