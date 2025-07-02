'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'chat' | 'system' | 'info';
  title: string;
  message: string;
  chatRoomId?: string;
  senderId?: string;
  senderName?: string;
  timestamp: Date;
  read: boolean;
  readAt?: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  hasMore: boolean;
  loadingMore: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  loadMore: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_PER_PAGE = 20;
const STORAGE_KEY = 'companion_notifications';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const unreadCount = allNotifications.filter(n => !n.read).length;

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
          readAt: n.readAt ? new Date(n.readAt) : undefined
        }));
        setAllNotifications(parsed);
        setNotifications(parsed.slice(0, NOTIFICATIONS_PER_PAGE));
        setHasMore(parsed.length > NOTIFICATIONS_PER_PAGE);
      } catch (error) {
        console.error('Failed to load notifications from storage:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (allNotifications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifications));
    }
  }, [allNotifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    console.log('🔔 NotificationContext: Adding notification:', {
      type: newNotification.type,
      title: newNotification.title,
      message: newNotification.message,
      id: newNotification.id
    });

    setAllNotifications(prev => {
      const updated = [newNotification, ...prev];
      console.log('🔔 NotificationContext: Total notifications after add:', updated.length);
      return updated;
    });

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, page * NOTIFICATIONS_PER_PAGE);
    });
  };

  const markAsRead = (id: string) => {
    const readAt = new Date();
    
    setAllNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true, readAt } : notification
      )
    );
    
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true, readAt } : notification
      )
    );
  };

  const markAllAsRead = () => {
    const readAt = new Date();
    
    setAllNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true, readAt }))
    );
    
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true, readAt }))
    );
  };

  const removeNotification = (id: string) => {
    setAllNotifications(prev => prev.filter(notification => notification.id !== id));
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setAllNotifications([]);
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * NOTIFICATIONS_PER_PAGE;
      const endIndex = nextPage * NOTIFICATIONS_PER_PAGE;
      const moreNotifications = allNotifications.slice(startIndex, endIndex);
      
      setNotifications(prev => [...prev, ...moreNotifications]);
      setPage(nextPage);
      setHasMore(endIndex < allNotifications.length);
      setLoadingMore(false);
    }, 500);
  };

  // Auto-remove old notifications (older than 7 days instead of 1 hour)
  useEffect(() => {
    const interval = setInterval(() => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      setAllNotifications(prev => {
        const filtered = prev.filter(notification => notification.timestamp > sevenDaysAgo);
        return filtered;
      });
      
      setNotifications(prev => {
        const filtered = prev.filter(notification => notification.timestamp > sevenDaysAgo);
        return filtered;
      });
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        hasMore,
        loadingMore,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        loadMore
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}