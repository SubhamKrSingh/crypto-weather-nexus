'use client';

import Link from 'next/link';
import { useFavorites } from '../../lib/hooks/useFavorites';
import { formatCurrency, formatPercentage } from '../../lib/utils/format';
import { CryptoData } from '../../lib/types/crypto';

interface CryptoCardProps {
  coin: CryptoData;
  onToggleFavorite?: (coinId: string) => void;
}

export default function CryptoCard({ coin, onToggleFavorite }: CryptoCardProps) {
  const { isCoinFavorite, toggleCoinFavorite: hookToggleCoinFavorite } = useFavorites();
  const isFavorite = isCoinFavorite(coin.id);
  
  // Use the provided toggle function or fall back to the hook's function
  const handleToggleFavorite = (coinId: string) => {
    if (onToggleFavorite) {
      onToggleFavorite(coinId);
    } else {
      hookToggleCoinFavorite(coinId);
    }
  };
  
  // Determine styling for price change
  const getPriceChangeColor = (change: number | string | undefined) => {
    if (!change) return 'text-gray-400';
    
    const changeNum = typeof change === 'string' ? parseFloat(change) : change;
    
    if (changeNum > 0) return 'text-green-500';
    if (changeNum < 0) return 'text-red-500';
    return 'text-gray-400';
  };
  
  // Get the price and change values, handling both API formats
  const getPrice = () => {
    if (coin.livePrice) return formatCurrency(parseFloat(coin.livePrice));
    if (coin.priceUsd) return formatCurrency(parseFloat(coin.priceUsd));
    if (coin.current_price) return formatCurrency(coin.current_price);
    return '$0.00';
  };
  
  const getPriceChange = () => {
    if (coin.changePercent24Hr) {
      const changeValue = parseFloat(coin.changePercent24Hr);
      return formatPercentage(changeValue);
    }
    if (coin.price_change_percentage_24h) {
      return formatPercentage(coin.price_change_percentage_24h);
    }
    return '0.00%';
  };
  
  const getPriceChangeValue = () => {
    if (coin.changePercent24Hr) return parseFloat(coin.changePercent24Hr);
    if (coin.price_change_percentage_24h) return coin.price_change_percentage_24h;
    return 0;
  };
  
  // Get the coin image
  const getCoinImage = () => {
    if (coin.image) return coin.image;
    
    // Fallback icons based on coin ID
    if (coin.id === 'bitcoin') return 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png';
    if (coin.id === 'ethereum') return 'https://assets.coingecko.com/coins/images/279/large/ethereum.png';
    if (coin.id === 'solana') return 'https://assets.coingecko.com/coins/images/4128/large/solana.png';
    
    return `https://cryptoicons.org/api/icon/${coin.symbol.toLowerCase()}/200`;
  };
  
  return (
    <Link href={`/crypto/${coin.id}`} className="block">
      <div className="p-4 bg-gray-800/80 hover:bg-gray-800 border-b border-gray-700 transition duration-300 hover:shadow-lg hover:shadow-teal-900/10">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3 bg-gray-700/50 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={getCoinImage()} 
                alt={coin.name} 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{coin.name}</h3>
              <p className="text-xs text-gray-400 uppercase bg-gray-700/50 px-2 py-0.5 rounded-sm inline-block">{coin.symbol}</p>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleFavorite(coin.id);
            }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`p-1.5 rounded-full ${isFavorite ? 'text-yellow-300' : 'text-gray-300'} hover:text-yellow-300 hover:bg-gray-700/50 focus:outline-none transition-colors`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 15.585l-7.778 4.09 1.484-8.661-6.293-6.139 8.703-1.267L10 0 13.885 3.608l8.702 1.267-6.293 6.139 1.484 8.661L10 15.585z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">{getPrice()}</span>
            <span className={`text-sm ${getPriceChangeColor(getPriceChangeValue())}`}>
              {getPriceChange()}
            </span>
          </div>
          
          <div className="w-1/2">
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-teal-500 h-2" 
                style={{ width: `${Math.min(100, Math.max(1, getPriceChangeValue() + 10))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}