"use client";

import { X, Bell, Info, Megaphone, CheckCircle2 } from 'lucide-react';
import { Notification, NotificationType } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationStackProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}

export function NotificationStack({ notifications, onRemove }: NotificationStackProps) {
    if (notifications.length === 0) return null;

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'ride': return <Bell className="w-5 h-5 text-blue-500" />;
            case 'message': return <Info className="w-5 h-5 text-indigo-500" />;
            case 'promotion': return <Megaphone className="w-5 h-5 text-amber-500" />;
            case 'system': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            default: return <Bell className="w-5 h-5 text-slate-500" />;
        }
    };

    const getBgColor = (type: NotificationType) => {
        switch (type) {
            case 'ride': return 'bg-blue-50/90 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50';
            case 'message': return 'bg-indigo-50/90 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50';
            case 'promotion': return 'bg-amber-50/90 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50';
            case 'system': return 'bg-emerald-50/90 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50';
            default: return 'bg-white/90 dark:bg-black/90 border-slate-200 dark:border-white/10';
        }
    };

    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-[380px] pointer-events-none">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={cn(
                        "pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300",
                        "animate-in slide-in-from-right-10 fade-in duration-500",
                        getBgColor(n.type)
                    )}
                >
                    <div className="mt-0.5 p-2 rounded-xl bg-white dark:bg-black shadow-sm border border-black/5 dark:border-white/10">
                        {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">{n.title}</h4>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full -mr-1 -mt-1 hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        onClick={() => onRemove(n.id)}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
