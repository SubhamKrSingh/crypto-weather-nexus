'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '../lib/hooks/reduxHooks';
import { Bell } from './icons/Bell';

interface HeaderProps {
  toggleNotifications: () => void;
}

export default function Header({ toggleNotifications }: HeaderProps) {
  const pathname = usePathname();
  const { unreadCount } = useAppSelector(state => state.notifications);
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <header className="bg-gradient-to-r from-gray-900 to-black text-white border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="group">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-sm">CN</span>
                </div>
                <div className="bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent font-extrabold text-xl tracking-tight">
                  CryptoWeather <span className="font-light">Nexus</span>
                </div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2">
              <Link 
                href="/" 
                className={`px-4 py-2 rounded-lg transition-colors ${isActive('/') 
                  ? 'bg-gray-800 text-white font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </span>
              </Link>
              
              <Link 
                href="/weather" 
                className={`px-4 py-2 rounded-lg transition-colors ${isActive('/weather') 
                  ? 'bg-blue-900/50 text-blue-100 font-medium' 
                  : 'text-gray-400 hover:text-blue-100 hover:bg-blue-900/30'}`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 weather-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                  </svg>
                  Weather
                </span>
              </Link>
              
              <Link 
                href="/crypto" 
                className={`px-4 py-2 rounded-lg transition-colors ${isActive('/crypto') 
                  ? 'bg-green-900/50 text-green-100 font-medium' 
                  : 'text-gray-400 hover:text-green-100 hover:bg-green-900/30'}`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 crypto-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Crypto
                </span>
              </Link>
              
              <Link 
                href="/news" 
                className={`px-4 py-2 rounded-lg transition-colors ${isActive('/news') 
                  ? 'bg-purple-900/50 text-purple-100 font-medium' 
                  : 'text-gray-400 hover:text-purple-100 hover:bg-purple-900/30'}`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 news-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                  </svg>
                  News
                </span>
              </Link>
            </nav>
          </div>
          
          <button 
            onClick={toggleNotifications}
            className="relative p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 rounded-full bg-teal-500 w-4 h-4 text-xs flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
} 