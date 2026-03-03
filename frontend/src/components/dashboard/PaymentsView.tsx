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
        <div className="p-6 md:p-8 h-full overflow-y-auto w-full max-w-4xl mx-auto animate-in fade-in duration-300">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Payment Methods</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage how you pay for your rides. All transactions are secure.</p>
            </div>

            <Tabs defaultValue="upi" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8 h-14 bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
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
                                <Smartphone className="w-5 h-5 text-blue-600" /> Add UPI ID
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
                                <div className="flex items-center text-sm text-slate-500 gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
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
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">G</div>
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
                    <Card className="border shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <CreditCard className="w-8 h-8 opacity-80" />
                                <span className="font-bold italic text-xl opacity-80">VISA</span>
                            </div>
                            <div className="space-y-1 mb-6">
                                <p className="font-mono text-xl tracking-[0.2em] opacity-90">•••• •••• •••• 4242</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs uppercase opacity-60 tracking-wider">Card Holder</p>
                                    <p className="font-medium tracking-wide">RAHUL GUPTA</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase opacity-60 tracking-wider">Expires</p>
                                    <p className="font-medium tracking-wide">12/28</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save Card</Button>
                                </DialogTrigger>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* WALLETS SECTION */}
                <TabsContent value="wallets" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Paytm */}
                        <Card className="border shadow-sm hover:border-blue-500 transition-colors cursor-pointer group">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shadow-sm bg-white p-1">
                                        <img src="https://logos-world.net/wp-content/uploads/2020/11/Paytm-Logo.png" alt="Paytm" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:text-blue-600 transition-colors">Paytm Wallet</h4>
                                        <p className="text-sm text-slate-500">Link your account</p>
                                    </div>
                                </div>
                                <ChevronRightIcon />
                            </CardContent>
                        </Card>

                        {/* PhonePe */}
                        <Card className="border shadow-sm hover:border-purple-500 transition-colors cursor-pointer group">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm p-1">
                                        <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-logo-icon.png" alt="PhonePe" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold group-hover:text-purple-600 transition-colors">PhonePe</h4>
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
                                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-1 shadow-sm">
                                        <img src="https://logos-world.net/wp-content/uploads/2021/04/Amazon-Pay-Logo.png" alt="Amazon Pay" className="w-full h-full object-contain" />
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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                                    <Button key={bank.name} variant="outline" className="h-20 justify-center flex-col gap-2 bg-white dark:bg-slate-900 border hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl overflow-hidden p-2">
                                        <div className="h-8 flex items-center justify-center w-full">
                                            <img src={bank.logo} alt={bank.name} className="max-h-full max-w-full object-contain dark:brightness-200 dark:contrast-200" />
                                        </div>
                                        <span className="text-[10px] font-semibold truncate w-full px-1 text-center text-slate-600 dark:text-slate-300">{bank.name}</span>
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
