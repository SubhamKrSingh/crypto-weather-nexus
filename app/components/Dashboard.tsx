'use client';

import { useState } from 'react';
import Header from './Header';
import WeatherSection from './weather/WeatherSection';
import CryptoSection from './crypto/CryptoSection';
import NewsSection from './news/NewsSection';
import NotificationsPanel from './notifications/NotificationsPanel';

export default function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/20 to-gray-950 text-white">
      <Header toggleNotifications={toggleNotifications} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent tracking-tight">
            <span className="font-light">Welcome to your</span> Dashboard
          </h1>
          <p className="text-gray-400">Overview of weather, cryptocurrency, and news information.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weather Section */}
          <div className="col-span-1">
            <div className="card group h-full bg-gray-900/80 hover:bg-gray-900 border border-gray-800 hover:border-teal-800/50 transition-all shadow-lg hover:shadow-teal-900/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between group-hover:border-teal-800/50 transition-colors">
                <h2 className="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 weather-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  Weather
                </h2>
              </div>
              <div className="h-full flex flex-col">
                <WeatherSection />
              </div>
            </div>
          </div>
          
          {/* Crypto Section */}
          <div className="col-span-1">
            <div className="card group h-full bg-gray-900/80 hover:bg-gray-900 border border-gray-800 hover:border-teal-800/50 transition-all shadow-lg hover:shadow-teal-900/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between group-hover:border-teal-800/50 transition-colors">
                <h2 className="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 crypto-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cryptocurrency
                </h2>
              </div>
              <div className="h-full flex flex-col">
                <CryptoSection />
              </div>
            </div>
          </div>
          
          {/* News Section */}
          <div className="col-span-1">
            <div className="card group h-full bg-gray-900/80 hover:bg-gray-900 border border-gray-800 hover:border-teal-800/50 transition-all shadow-lg hover:shadow-teal-900/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between group-hover:border-teal-800/50 transition-colors">
                <h2 className="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 news-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-1M8 6h1" />
                  </svg>
                  News
                </h2>
              </div>
              <div className="h-full flex flex-col">
                <NewsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notifications Panel (Slide-in) */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
} 