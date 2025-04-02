'use client';

import { useAppSelector, useAppDispatch } from '../../lib/hooks/reduxHooks';
import { 
  markAsRead, 
  markAllAsRead, 
  clearNotifications 
} from '../../lib/redux/slices/notificationsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from './NotificationItem';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ 
  isOpen, 
  onClose 
}: NotificationsPanelProps) {
  const dispatch = useAppDispatch();
  const { items, unreadCount } = useAppSelector(state => state.notifications);
  
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };
  
  const handleClearAll = () => {
    dispatch(clearNotifications());
  };
  
  const handleNotificationClick = (id: string) => {
    dispatch(markAsRead(id));
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm bg-red-600 text-white py-0.5 px-2 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                disabled={items.length === 0}
              >
                Clear all
              </button>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No notifications yet.
                </div>
              ) : (
                items.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification.id)}
                  />
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 