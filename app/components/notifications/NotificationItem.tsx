'use client';

import { Notification } from '../../lib/redux/slices/notificationsSlice';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export default function NotificationItem({ 
  notification, 
  onClick 
}: NotificationItemProps) {
  const formattedTime = formatDistanceToNow(new Date(notification.timestamp), { 
    addSuffix: true 
  });
  
  // Convert timestamp to readable time
  const getFormattedTime = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };
  
  const isWeatherAlert = notification.type === 'weather_alert';
  
  return (
    <div 
      className={`
        p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer
        ${notification.read ? 'opacity-75' : 'bg-blue-50 dark:bg-blue-900/20'}
      `}
      onClick={onClick}
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className={`
          flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3
          ${isWeatherAlert 
            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
            : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
          }
        `}>
          {isWeatherAlert ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {notification.title}
            </p>
            
            {!notification.read && (
              <span className="inline-block h-2 w-2 bg-blue-600 rounded-full ml-2"></span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {notification.message}
          </p>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {getFormattedTime(notification.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
} 