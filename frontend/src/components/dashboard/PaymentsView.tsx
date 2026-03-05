"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { CreditCard, Landmark, Smartphone, Wallet, Plus, ShieldCheck } from "lucide-react";

export function PaymentsView() {
    const [upiId, setUpiId] = useState("");

    return (
        <div className="p-10 md:p-12 h-screen overflow-y-auto w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500 bg-background">
            <div className="mb-12">
                <h2 className="text-4xl font-black tracking-tight mb-3 text-slate-900 dark:text-white">Payment Methods</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Securely manage your preferred ways to pay for rides.</p>
            </div>

            <Tabs defaultValue="upi" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 h-14 bg-slate-100 dark:bg-card rounded-xl p-1 border dark:border-white/5">
                    <TabsTrigger value="upi" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                        <Smartphone className="w-4 h-4 mr-2 hidden sm:block" /> UPI
                    </TabsTrigger>
                    <TabsTrigger value="cards" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                        <CreditCard className="w-4 h-4 mr-2 hidden sm:block" /> Cards
                    </TabsTrigger>
                    <TabsTrigger value="wallets" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                        <Wallet className="w-4 h-4 mr-2 hidden sm:block" /> Wallets
                    </TabsTrigger>
                    <TabsTrigger value="netbanking" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                        <Landmark className="w-4 h-4 mr-2 hidden sm:block" /> Netbanking
                    </TabsTrigger>
                </TabsList>

                {/* UPI SECTION */}
                <TabsContent value="upi" className="space-y-4">
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="w-5 h-5 text-black dark:text-white" /> Add UPI ID
                            </CardTitle>
                            <CardDescription>Enter your Virtual Payment Address (VPA)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="upi">UPI ID</Label>
                                    <Input
                                        id="upi"
                                        placeholder="e.g. rahul@oksbi or 9876543210@paytm"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="h-12"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-slate-500 gap-2 bg-slate-50 dark:bg-card p-3 rounded-lg border border-slate-100 dark:border-white/5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    We'll send a 1₹ request to verify this ID. It will be refunded automatically.
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full sm:w-auto h-11" disabled={!upiId.includes('@')}>Verify & Add UPI</Button>
                        </CardFooter>
                    </Card>

                    <h3 className="font-semibold text-lg mt-8 mb-4">Saved UPI IDs</h3>
                    <Card className="border shadow-sm">
                        <CardContent className="p-0">
                            <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full flex items-center justify-center font-bold">G</div>
                                    <div>
                                        <p className="font-medium">Google Pay</p>
                                        <p className="text-sm text-slate-500">rahul.123@okaxis</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">Remove</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CARDS SECTION */}
                <TabsContent value="cards" className="space-y-4">
                    <div className="relative group perspective-1000 max-w-md mx-auto w-full">
                        <div className="h-60 w-full glass-card border-0 bg-gradient-to-br from-slate-900 to-black p-8 rounded-[28px] shadow-2xl relative overflow-hidden transition-transform duration-500 hover:scale-[1.02] group-hover:rotate-x-1 group-hover:rotate-y-2">
                            {/* Card Chip & Type  */}
                            <div className="flex justify-between items-start mb-10">
                                <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md shadow-inner flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 border border-black/10 grid grid-cols-3 grid-rows-3 opacity-30">
                                        {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-black/40" />)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h3 className="font-extrabold text-2xl italic tracking-tighter opacity-80">VISA</h3>
                                </div>
                            </div>

                            {/* Card Number */}
                            <div className="mb-8">
                                <p className="font-mono text-2xl tracking-[0.25em] text-white flex justify-between">
                                    <span>••••</span>
                                    <span>••••</span>
                                    <span>••••</span>
                                    <span>4242</span>
                                </p>
                            </div>

                            {/* Holder & Expiry */}
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Card Holder</p>
                                    <p className="font-bold text-base tracking-wide text-white/90">RAHUL GUPTA</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Expires</p>
                                    <p className="font-bold text-base tracking-wide text-white/90">12/28</p>
                                </div>
                            </div>

                            {/* Realistic Gloss Effect */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30 pointer-events-none" />
                            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]" />
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-14 border-dashed border-2 hover:bg-slate-50 dark:hover:bg-slate-900 mt-4 rounded-xl">
                                <Plus className="w-5 h-5 mr-2" /> Add New Credit/Debit Card
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Card</DialogTitle>
                                <DialogDescription>Enter your card details securely.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Card Number</Label>
                                    <Input placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Expiry Date</Label>
                                        <Input placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CVV</Label>
                                        <Input placeholder="123" type="password" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cardholder Name</Label>
                                    <Input placeholder="Name on card" />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogTrigger asChild>
                                    <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-slate-900 dark:hover:bg-slate-100">Save Card</Button>
                                </DialogTrigger>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* WALLETS SECTION */}
                <TabsContent value="wallets" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Paytm */}
                        <Card className="border shadow-sm hover:border-black dark:hover:border-white transition-colors cursor-pointer group">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shadow-sm bg-white p-2">
                                        <img src="https://www.vectorlogo.zone/logos/paytm/paytm-ar21.svg" alt="Paytm" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:text-black dark:group-hover:text-white transition-colors">Paytm Wallet</h4>
                                        <p className="text-sm text-slate-500">Link your account</p>
                                    </div>
                                </div>
                                <ChevronRightIcon />
                            </CardContent>
                        </Card>

                        {/* PhonePe */}
                        <Card className="border shadow-sm hover:border-indigo-500 transition-colors cursor-pointer group">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm p-2">
                                        <img src="https://www.vectorlogo.zone/logos/phonepe/phonepe-ar21.svg" alt="PhonePe" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:text-indigo-600 transition-colors">PhonePe</h4>
                                        <p className="text-sm text-slate-500">Link your account</p>
                                    </div>
                                </div>
                                <ChevronRightIcon />
                            </CardContent>
                        </Card>

                        {/* Amazon Pay */}
                        <Card className="border shadow-sm hover:border-orange-500 transition-colors cursor-pointer group">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-2 shadow-sm">
                                        <img src="https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" alt="Amazon Pay" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:text-orange-500 transition-colors">Amazon Pay</h4>
                                        <p className="text-sm text-slate-500">Link your account</p>
                                    </div>
                                </div>
                                <ChevronRightIcon />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* NETBANKING SECTION */}
                <TabsContent value="netbanking" className="space-y-4">
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <CardTitle>Select your Bank</CardTitle>
                            <CardDescription>We support all major Indian banks for seamless payments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { name: 'HDFC Bank', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2020/11/hdfc_bank_logo.png' },
                                    { name: 'SBI', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2023/05/sbi_logo-freelogovectors.net_.png' },
                                    { name: 'ICICI Bank', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2018/02/icici-bank-logo.png' },
                                    { name: 'Axis Bank', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2023/11/axis_bank_logo-freelogovectors.net_.png' },
                                    { name: 'Kotak Bank', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2021/11/kotak-mahindra-bank-logo-freelogovectors.net_.png' },
                                    { name: 'Yes Bank', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2021/11/yes-bank-logo-freelogovectors.net_.png' },
                                    { name: 'PNB', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2021/11/punjab-national-bank-logo-freelogovectors.net_.png' },
                                    { name: 'Bank of Baroda', logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2021/11/bank-of-baroda-logo-freelogovectors.net_.png' }
                                ].map(bank => (
                                    <Button key={bank.name} variant="outline" className="h-24 justify-center flex-col gap-3 glass-card border-0 hover:scale-105 transition-all duration-300 rounded-2xl overflow-hidden p-3">
                                        <div className="h-10 flex items-center justify-center w-full">
                                            <img src={bank.logo} alt={bank.name} className="max-h-full max-w-full object-contain dark:brightness-200" />
                                        </div>
                                        <span className="text-[11px] font-bold truncate w-full px-1 text-center text-slate-700 dark:text-slate-200">{bank.name}</span>
                                    </Button>
                                ))}
                            </div>

                            <div className="mt-6">
                                <Label>Or search for another bank</Label>
                                <Input placeholder="Start typing bank name..." className="mt-2" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}

function ChevronRightIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 transition-transform group-hover:translate-x-1"><path d="m9 18 6-6-6-6" /></svg>
    );
}
