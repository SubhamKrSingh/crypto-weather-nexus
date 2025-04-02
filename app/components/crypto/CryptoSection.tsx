'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../lib/hooks/reduxHooks';
import { fetchCryptoData } from '../../lib/redux/slices/cryptoSlice';
import CryptoCard from './CryptoCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import Link from 'next/link';
import { useFavorites } from '../../lib/hooks/useFavorites';
import { cn } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';

export default function CryptoSection({ className }: { className?: string }) {
  const { coins, loading, error } = useAppSelector(state => state.crypto);
  const dispatch = useAppDispatch();
  const { favorites, toggleCoinFavorite } = useFavorites();

  useEffect(() => {
    if (coins.length === 0 && !loading && !error) {
      dispatch(fetchCryptoData());
    }

    // Force hydration of favorites from localStorage
    const checkFavorites = () => {
      if (!favorites || !Array.isArray(favorites.coins)) {
        // If favorites is not properly hydrated, try to load from localStorage directly
        try {
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            console.log('Loading favorites from localStorage:', JSON.parse(storedFavorites));
          }
        } catch (e) {
          console.error('Error loading favorites from localStorage:', e);
        }
      }
    };
    
    // Check after a short delay to ensure React has hydrated
    const timer = setTimeout(checkFavorites, 500);
    return () => clearTimeout(timer);
  }, [coins.length, loading, error, dispatch, favorites]);
  
  // Get top coins (by market cap or prioritize favorites)
  const coinsToShow = () => {
    // Get favorite coins (with null check)
    const favoriteCoins = coins.filter(coin => 
      favorites?.coins?.includes(coin.id) || false
    );
    
    // If we have 3 or more favorites, show top 3
    if (favoriteCoins.length >= 3) {
      return favoriteCoins.slice(0, 3);
    }
    
    // Otherwise, add top coins (by market cap) until we have 3
    const topNonFavoriteCoins = coins
      .filter(coin => !(favorites?.coins?.includes(coin.id) || false))
      .slice(0, 3 - favoriteCoins.length);
    
    return [...favoriteCoins, ...topNonFavoriteCoins];
  };
  
  const renderContentLegacy = () => {
    if (loading && coins.length === 0) {
      return <LoadingSpinner />;
    }
    
    if (error && coins.length === 0) {
      return <ErrorMessage message={error} />;
    }
    
    if (coins.length === 0) {
      return (
        <p className="text-gray-400 text-center py-6">No cryptocurrency data available.</p>
      );
    }
    
    return (
      <div className="space-y-0">
        {coinsToShow().map(coin => (
          <CryptoCard key={coin.id} coin={coin} onToggleFavorite={toggleCoinFavorite} />
        ))}
        
        <div className="px-4 pb-4 pt-2">
          <Link 
            href="/crypto" 
            className="text-sm text-teal-400 hover:text-teal-300 flex items-center justify-center py-2"
          >
            View all crypto data
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  };
  
  // Either use the legacy render or the modern one
  const content = renderContentLegacy();
  
  return (
    <section className={cn("", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
          Cryptocurrency
        </h2>
        <Link
          href="/crypto"
          className="text-xs text-teal-400 hover:text-teal-300 flex items-center transition-colors"
        >
          View all
          <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>

      {loading && coins.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-800/50 animate-pulse rounded-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
                <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="h-6 bg-gray-700 rounded w-20"></div>
                <div className="w-1/2 h-2 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error && coins.length === 0 ? (
        <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-sm">
          <p className="text-red-400 text-sm">Failed to load cryptocurrency data</p>
        </div>
      ) : (
        // Use either the content variable or the direct rendering
        content || (
          <div className="space-y-px">
            {coins
              .slice(0, 5)
              .map((coin) => (
                <CryptoCard key={coin.id} coin={coin} onToggleFavorite={toggleCoinFavorite} />
              ))}
          </div>
        )
      )}
    </section>
  );
} 