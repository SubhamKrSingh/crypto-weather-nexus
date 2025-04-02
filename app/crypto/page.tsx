'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks/reduxHooks';
import { fetchCryptoData } from '../lib/redux/slices/cryptoSlice';
import CryptoCard from '../components/crypto/CryptoCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Link from 'next/link';
import { useFavorites } from '../lib/hooks/useFavorites';

export default function CryptoIndexPage() {
  const dispatch = useAppDispatch();
  const { coins, loading, error } = useAppSelector(state => state.crypto);
  const { favorites } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Fetch crypto data if not available
    if (coins.length === 0) {
      dispatch(fetchCryptoData());
    }
    
    // Refresh crypto data every 5 minutes
    const intervalId = setInterval(() => {
      dispatch(fetchCryptoData());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [dispatch, coins.length]);
  
  // Filter coins based on search term
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort coins to prioritize favorites
  const sortedCoins = [...filteredCoins].sort((a, b) => {
    const aIsFavorite = favorites?.coins?.includes(a.id) || false;
    const bIsFavorite = favorites?.coins?.includes(b.id) || false;
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0;
  });
  
  const favoriteCoins = sortedCoins.filter(coin => favorites?.coins?.includes(coin.id) || false);
  const regularCoins = sortedCoins.filter(coin => !(favorites?.coins?.includes(coin.id) || false));
  
  const renderContent = () => {
    if (loading && coins.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      );
    }
    
    if (error && coins.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <ErrorMessage message={error} />
        </div>
      );
    }
    
    if (filteredCoins.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <div className="text-center max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-lg">
              {coins.length === 0 
                ? "No cryptocurrency data available." 
                : "No cryptocurrencies match your search."}
            </p>
            {coins.length > 0 && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        {favoriteCoins.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center text-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Favorite Cryptocurrencies
            </h2>
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden">
              {favoriteCoins.map(coin => (
                <CryptoCard key={coin.id} coin={coin} />
              ))}
            </div>
          </section>
        )}
        
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center text-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            All Cryptocurrencies
          </h2>
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden">
            {regularCoins.map(coin => (
              <CryptoCard key={coin.id} coin={coin} />
            ))}
          </div>
        </section>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/20 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/" 
              className="mr-4 p-2 rounded-full bg-green-900/30 text-green-400 hover:bg-green-800/40 hover:text-green-300 transition-all"
              aria-label="Back to Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-green-400 to-emerald-600 bg-clip-text text-transparent tracking-tight">Cryptocurrency</h1>
          </div>
          <p className="text-gray-400 ml-11">Real-time cryptocurrency prices, market caps, and trends.</p>
        </div>
        
        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="w-full pl-10 px-4 py-3 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
} 