'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, MessageCircle, Info, Loader2 } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { notifications, unreadCount, hasMore, loadingMore, markAsRead, markAllAsRead, removeNotification, loadMore } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Debug logging for notifications
  useEffect(() => {
    console.log('🔔 NotificationBell: Notifications updated:', {
      count: notifications.length,
      unreadCount,
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        read: n.read
      }))
    });
  }, [notifications, unreadCount]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate button position for desktop dropdown
  const updateButtonPosition = useCallback(() => {
    if (!isMobile && bellButtonRef.current) {
      const rect = bellButtonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8, // 8px margin below button
        right: window.innerWidth - rect.right // Distance from right edge
      });
    }
  }, [isMobile]);

  // Handle opening with animation
  const handleOpen = useCallback(() => {
    updateButtonPosition(); // Update position before opening
    setIsAnimating(true);
    setIsOpen(true);
    // Start slide-up animation after component renders
    requestAnimationFrame(() => {
      setIsAnimating(false);
    });
  }, [updateButtonPosition]);

  // Handle closing with animation
  const handleClose = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 300); // Match transition duration
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClose]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!listRef.current || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const threshold = 100; // Load more when 100px from bottom

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMore();
    }
  }, [loadingMore, hasMore, loadMore]);

  // Add scroll listener
  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Update position on window resize and scroll (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleResize = () => {
      if (isOpen) {
        updateButtonPosition();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateButtonPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, updateButtonPosition, isMobile]);

  const handleNotificationClick = useCallback((notification: any) => {
    markAsRead(notification.id);
    
    if (notification.type === 'chat' && notification.chatRoomId) {
      router.push(`/chat?room=${notification.chatRoomId}`);
      handleClose();
    }
  }, [markAsRead, router, handleClose]);

  const handleBellClick = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleClose, handleOpen]);

  const handleRemoveNotification = useCallback((e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    removeNotification(notificationId);
  }, [removeNotification]);

  const createNotificationClickHandler = useCallback((notification: any) => {
    return () => handleNotificationClick(notification);
  }, [handleNotificationClick]);

  const createRemoveClickHandler = useCallback((notificationId: string) => {
    return (e: React.MouseEvent) => handleRemoveNotification(e, notificationId);
  }, [handleRemoveNotification]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        ref={bellButtonRef}
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 md:-top-1 md:-right-1 bg-red-500 rounded-full h-3 w-3 md:h-3.5 md:w-3.5 border-1 md:border-2 border-white"></span>
        )}
      </button>

      {/* Notification Dropdown using Portal */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <div 
              className={`fixed inset-0 z-40 transition-all duration-300 ${
                isAnimating ? 'bg-black/0' : 'bg-black/50'
              }`}
              onClick={handleClose}
            />
          )}
          
          {/* Notification Panel */}
          <div 
            className={`
              fixed z-[9999] overflow-hidden bg-white border flex flex-col
              md:w-96 md:rounded-lg md:shadow-xl md:border-gray-200 md:h-auto md:max-h-[32rem]
              bottom-0 left-0 right-0 h-[85vh] rounded-t-xl
              md:bottom-auto md:left-auto md:right-auto
              transform transition-all duration-300 ease-out
              ${isAnimating ? 
                'translate-y-full md:translate-y-0 opacity-0 md:opacity-100' : 
                'translate-y-0 md:translate-y-0 opacity-100'
              }
            `}
            style={!isMobile ? {
              top: `${buttonPosition.top}px`,
              right: `${buttonPosition.right}px`
            } : {}}
          >
            {/* Mobile Handle */}
            <div className="md:hidden flex justify-center pt-2 pb-1">
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">알림</h3>
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    모두 읽기
                  </button>
                )}
                {/* Mobile Close Button */}
                <button
                  onClick={handleClose}
                  className="md:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div 
              ref={listRef}
              className="flex-1 overflow-y-auto md:max-h-80"
            >
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg mb-1">새로운 알림이 없습니다</p>
                  <p className="text-sm">알림이 오면 여기에 표시됩니다</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-4 md:py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'
                      }`}
                      onClick={createNotificationClickHandler(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-base md:text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
                                )}
                              </div>
                              <p className={`text-sm md:text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'} line-clamp-2`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2 md:mt-1">
                                <p className="text-xs text-gray-400">
                                  {formatTimeAgo(notification.timestamp)}
                                </p>
                                {notification.read && notification.readAt && (
                                  <p className="text-xs text-gray-400">
                                    읽음 · {formatTimeAgo(notification.readAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                              <button
                                onClick={createRemoveClickHandler(notification.id)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator for infinite scroll */}
                  {loadingMore && (
                    <div className="px-4 py-3 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                      <p className="text-xs text-gray-500 mt-1">알림을 불러오는 중...</p>
                    </div>
                  )}
                  
                  {/* End of list indicator */}
                  {!hasMore && notifications.length > 0 && (
                    <div className="px-4 py-3 text-center text-xs text-gray-400 border-t border-gray-100">
                      모든 알림을 확인했습니다
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}