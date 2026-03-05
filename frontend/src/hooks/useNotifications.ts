"use client";

import { useState, useCallback, useEffect } from 'react';

export type NotificationType = 'ride' | 'message' | 'promotion' | 'system';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    timestamp: Date;
    icon?: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification: Notification = {
            ...notification,
            id,
            timestamp: new Date(),
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
    };
}
