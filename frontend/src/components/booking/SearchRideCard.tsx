import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Search, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import LocationSearch from '@/components/LocationSearch';

interface SearchRideCardProps {
    pickupText: string;
    setPickupText: (text: string) => void;
    dropoffText: string;
    setDropoffText: (text: string) => void;
    setPickup: (loc: [number, number] | null) => void;
    setDropoff: (loc: [number, number] | null) => void;
    onSearch: () => void;
}

export function SearchRideCard({
    pickupText,
    setPickupText,
    dropoffText,
    setDropoffText,
    setPickup,
    setDropoff,
    onSearch
}: SearchRideCardProps) {
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleTime, setScheduleTime] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState("Today");
    const [selectedHour, setSelectedHour] = useState("09");
    const [selectedMinute, setSelectedMinute] = useState("30");
    const [selectedPeriod, setSelectedPeriod] = useState("AM");

    return (
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
                <Button className="w-full h-[64px] text-xl font-black rounded-2xl bg-black dark:bg-white text-white dark:text-black premium-shadow transition-all active:scale-[0.98]" onClick={onSearch} disabled={!dropoffText}><Search className="w-6 h-6 mr-3" /> {isScheduled ? `Book for ${scheduleTime}` : 'Search Ride'}</Button>
            </CardFooter>
        </Card>
    );
}
