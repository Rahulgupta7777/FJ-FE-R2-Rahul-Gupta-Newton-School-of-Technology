'use client';

import { ArrowLeft, ChevronRight, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface RideSelectionProps {
    selectedVehicle: string;
    setSelectedVehicle: (v: any) => void;
    sharedSeats: number;
    setSharedSeats: (s: number) => void;
    paymentMethod: 'Cash' | 'Visa •••• 1234' | 'Paytm';
    setPaymentMethod: (m: 'Cash' | 'Visa •••• 1234' | 'Paytm') => void;
    getDropoffTime: (mins?: number) => string;
    tripDuration: number;
    renderPaymentIcon: (method: string) => React.ReactNode;
    onConfirm: () => void;
    onBack: () => void;
}

export function RideSelection({
    selectedVehicle,
    setSelectedVehicle,
    sharedSeats,
    setSharedSeats,
    paymentMethod,
    setPaymentMethod,
    getDropoffTime,
    tripDuration,
    renderPaymentIcon,
    onConfirm,
    onBack
}: RideSelectionProps) {
    return (
        <Card className="pointer-events-auto glass-card shadow-2xl rounded-t-3xl md:rounded-xl border-0 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="relative h-40 w-full bg-blue-50/50 dark:bg-slate-900/40 flex items-center justify-center border-b border-slate-200/50 dark:border-white/10 p-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-400 via-transparent to-transparent"></div>
                <img src="/mult_cab.png" alt="Available Cabs" className="h-32 w-auto object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full h-8 w-8 z-10"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
            </div>
            <div className="p-4 bg-transparent border-b border-slate-200/50 dark:border-white/10">
                <h3 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Choose your ride</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Safe and reliable options for any trip</p>
            </div>
            <CardContent className="p-0 bg-transparent">
                <div className="overflow-y-auto max-h-[40vh] md:max-h-[500px]">
                    {/* Shared Option */}
                    <div
                        className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 group ${selectedVehicle === 'Shared' ? 'bg-black/5 dark:bg-white/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                        onClick={() => setSelectedVehicle('Shared')}
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-14 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105 group-hover:shadow-md">
                                <img src="/car-icon.png" alt="Car Icon" className="w-12 h-auto object-contain dark:invert transition-transform group-hover:rotate-2" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-black dark:group-hover:text-slate-300">Shared</h4>
                                    <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                        <span className="text-[10px] mr-1">👤</span>
                                        <span className="text-xs font-bold">1-2</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">2 min • {getDropoffTime(tripDuration + 2)} dropoff</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">${((2.50 + tripDuration * 1.50) * sharedSeats).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Economy Option */}
                    <div
                        className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 group ${selectedVehicle === 'Economy' ? 'bg-black/5 dark:bg-white/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                        onClick={() => setSelectedVehicle('Economy')}
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-14 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105 group-hover:shadow-md">
                                <img src="/car-icon.png" alt="Car Icon" className="w-12 h-auto object-contain dark:invert transition-transform group-hover:rotate-2" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-black dark:group-hover:text-slate-300">Economy</h4>
                                    <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                        <span className="text-[10px] mr-1">👤</span>
                                        <span className="text-xs font-bold">4</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">2 min • {getDropoffTime(tripDuration)} dropoff</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">${(5.00 + tripDuration * 2.10).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* EV Option */}
                    <div
                        className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 group ${selectedVehicle === 'EV' ? 'bg-green-600/5 dark:bg-green-500/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                        onClick={() => setSelectedVehicle('EV')}
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-14 flex items-center justify-center bg-green-50/50 dark:bg-green-900/10 rounded-2xl overflow-hidden border border-green-100 dark:border-green-900/30 shadow-sm transition-transform group-hover:scale-105 group-hover:shadow-md">
                                <img src="/car-icon.png" alt="Car Icon" className="w-12 h-auto object-contain dark:invert hue-rotate-[120deg] transition-transform group-hover:rotate-2" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-black dark:group-hover:text-slate-300">EV</h4>
                                    <span className="text-green-600 dark:text-green-400 text-[10px] font-black px-1.5 py-0.5 bg-green-100 dark:bg-green-900/40 rounded-md tracking-wider">ECO</span>
                                    <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                        <span className="text-[10px] mr-1">👤</span>
                                        <span className="text-xs font-bold">4</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">3 min • {getDropoffTime(tripDuration + 1)} dropoff</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">${(6.00 + tripDuration * 2.30).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Comfort Option */}
                    <div
                        className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 group ${selectedVehicle === 'Comfort' ? 'bg-black/5 dark:bg-white/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                        onClick={() => setSelectedVehicle('Comfort')}
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-14 flex items-center justify-center bg-slate-900 dark:bg-white rounded-2xl overflow-hidden shadow-lg transition-transform group-hover:scale-105">
                                <img src="/car-icon.png" alt="Car Icon" className="w-12 h-auto object-contain invert dark:invert-0 transition-transform group-hover:rotate-2" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-black dark:group-hover:text-slate-300">Comfort</h4>
                                    <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                        <span className="text-[10px] mr-1">👤</span>
                                        <span className="text-xs font-bold">4</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">4 min • {getDropoffTime(tripDuration + 5)} dropoff</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">${(10.00 + tripDuration * 3.50).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* XL Option */}
                    <div
                        className={`p-5 flex items-center justify-between cursor-pointer border-b border-slate-50 dark:border-white/5 transition-all duration-300 group ${selectedVehicle === 'XL' ? 'bg-black/5 dark:bg-white/10' : 'bg-white dark:bg-slate-950'} hover:bg-slate-50 dark:hover:bg-slate-900/50`}
                        onClick={() => setSelectedVehicle('XL')}
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-14 flex items-center justify-center bg-slate-100/80 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105 group-hover:shadow-md">
                                <img src="/car-icon.png" alt="Car Icon" className="w-14 h-auto object-contain dark:invert transition-transform group-hover:rotate-2" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-black dark:group-hover:text-slate-300">XL</h4>
                                    <div className="flex items-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                        <span className="text-[10px] mr-1">👤</span>
                                        <span className="text-xs font-bold">6</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">6 min • {getDropoffTime(tripDuration + 8)} dropoff</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-xl text-slate-900 dark:text-white tracking-tight">${(15.00 + tripDuration * 5.20).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Shared Ride Counter - Only visible if 'Shared' is selected */}
                    {selectedVehicle === 'Shared' && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 fade-in">
                            <div className="space-y-0.5">
                                <h4 className="font-medium text-sm text-slate-900 dark:text-white">Shared Ride Options</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">How many seats do you need?</p>
                            </div>
                            <div className="flex items-center gap-4 bg-white dark:bg-slate-950 px-3 py-1 rounded-full border dark:border-slate-800 shadow-sm">
                                <button className="text-xl font-bold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white px-2" onClick={() => setSharedSeats(Math.max(1, sharedSeats - 1))}>-</button>
                                <span className="font-bold text-lg w-4 text-center">{sharedSeats}</span>
                                <button className="text-xl font-bold text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white px-2" onClick={() => setSharedSeats(Math.min(2, sharedSeats + 1))}>+</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Selected Action */}
                <div className="pt-6 flex items-center justify-between px-6 bg-transparent pb-8 border-t border-slate-200/50 dark:border-white/10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 transition-all w-[140px] justify-between border border-transparent hover:border-slate-300 dark:hover:border-white/20 group">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="shrink-0 transition-transform group-hover:scale-110">
                                        {renderPaymentIcon(paymentMethod)}
                                    </div>
                                    <span className="text-sm font-bold truncate tracking-tight text-slate-900 dark:text-white">{paymentMethod.split(' ')[0]}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 border-slate-200 dark:border-white/10 glass-card">
                            <DropdownMenuItem className="rounded-xl p-3 cursor-pointer flex gap-3 items-center" onClick={() => setPaymentMethod('Visa •••• 1234')}>
                                {renderPaymentIcon('Visa •••• 1234')} <span>Visa •••• 1234</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl p-3 cursor-pointer flex gap-3 items-center" onClick={() => setPaymentMethod('Paytm')}>
                                {renderPaymentIcon('Paytm')} <span>Paytm</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl p-3 cursor-pointer flex gap-3 items-center" onClick={() => setPaymentMethod('Cash')}>
                                {renderPaymentIcon('Cash')} <span>Cash</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        className="flex-1 h-[52px] ml-4 text-lg font-bold rounded-2xl bg-[#000000] dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xl shadow-slate-500/10 transition-all active:scale-[0.98] group relative overflow-hidden"
                        onClick={onConfirm}
                    >
                        <div className="absolute inset-0 bg-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        Confirm {selectedVehicle}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
