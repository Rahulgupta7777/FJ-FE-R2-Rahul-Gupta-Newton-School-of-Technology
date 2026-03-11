import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

type TabType = 'BOOKING' | 'TRIPS' | 'PAYMENTS' | 'SETTINGS';

interface MobileHeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export function MobileHeader({
    isSidebarOpen,
    setIsSidebarOpen,
    activeTab,
    setActiveTab
}: MobileHeaderProps) {
    return (
        <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg pointer-events-auto bg-white dark:bg-slate-900 border-0">
                        <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0 flex flex-col bg-background border-0">
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <img src="/cab_car_logos/newlog.png" alt="Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">NexRide</span>
                        </div>
                        <nav className="flex flex-col gap-2">
                            <Button variant="ghost" className={`justify-start h-12 rounded-xl font-bold ${activeTab === 'BOOKING' ? 'bg-slate-100 dark:bg-white/10' : ''}`} onClick={() => { setActiveTab('BOOKING'); setIsSidebarOpen(false); }}>Booking</Button>
                            <Button variant="ghost" className={`justify-start h-12 rounded-xl font-bold ${activeTab === 'TRIPS' ? 'bg-slate-100 dark:bg-white/10' : ''}`} onClick={() => { setActiveTab('TRIPS'); setIsSidebarOpen(false); }}>Trips</Button>
                            <Button variant="ghost" className={`justify-start h-12 rounded-xl font-bold ${activeTab === 'PAYMENTS' ? 'bg-slate-100 dark:bg-white/10' : ''}`} onClick={() => { setActiveTab('PAYMENTS'); setIsSidebarOpen(false); }}>Payments</Button>
                            <Button variant="ghost" className={`justify-start h-12 rounded-xl font-bold ${activeTab === 'SETTINGS' ? 'bg-slate-100 dark:bg-white/10' : ''}`} onClick={() => { setActiveTab('SETTINGS'); setIsSidebarOpen(false); }}>Settings</Button>
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
