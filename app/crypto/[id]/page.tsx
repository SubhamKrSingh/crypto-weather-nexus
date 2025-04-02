'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks/reduxHooks';
import { fetchCryptoData, fetchCryptoHistory } from '../../lib/redux/slices/cryptoSlice';
import { useFavorites } from '../../lib/hooks/useFavorites';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

export default function CryptoDetailPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const coinId = params.id as string;
  
  const { coins, history, loading, error } = useAppSelector(state => state.crypto);
  const { isCoinFavorite, toggleCoinFavorite } = useFavorites();
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Find the coin data
  const coin = coins.find(c => c.id === coinId);
  const coinHistory = history[coinId];
  const isFavorite = isCoinFavorite(coinId);
  
  useEffect(() => {
    // Fetch coin data if not available
    if (!coin) {
      dispatch(fetchCryptoData());
    }
    
    // Fetch historical data if not available
    if (!coinHistory) {
      dispatch(fetchCryptoHistory(coinId));
    }
  }, [dispatch, coin, coinHistory, coinId]);
  
  // Format price with commas and 2 decimal places
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(price));
  };
  
  // Format large numbers with commas
  const formatNumber = (num: string) => {
    return new Intl.NumberFormat('en-US').format(parseFloat(num));
  };
  
  // Format market cap in billions
  const formatMarketCap = (marketCap: string) => {
    if (!marketCap) return '$0';
    
    const marketCapValue = parseFloat(marketCap);
    
    if (isNaN(marketCapValue)) return '$0';
    
    if (marketCapValue >= 1e12) {
      return `$${(marketCapValue / 1e12).toFixed(2)} Trillion`;
    }
    if (marketCapValue >= 1e9) {
      return `$${(marketCapValue / 1e9).toFixed(2)} Billion`;
    }
    if (marketCapValue >= 1e6) {
      return `$${(marketCapValue / 1e6).toFixed(2)} Million`;
    }
    return formatPrice(marketCap);
  };
  
  // Get the change percentage color
  const getChangeColor = (change: string) => {
    if (!change) return 'text-gray-600 dark:text-gray-400';
    
    const changeValue = parseFloat(change);
    
    if (isNaN(changeValue)) return 'text-gray-600 dark:text-gray-400';
    
    if (changeValue > 0) return 'text-green-600 dark:text-green-400';
    if (changeValue < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };
  
  // Format the change percentage
  const formatChange = (change: string) => {
    if (!change) return '0.00%';
    
    const changeValue = parseFloat(change);
    
    if (isNaN(changeValue)) return '0.00%';
    
    const sign = changeValue > 0 ? '↑' : changeValue < 0 ? '↓' : '';
    return `${sign} ${Math.abs(changeValue).toFixed(2)}%`;
  };
  
  // Format timestamp for the chart
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Get cryptocurrency icon based on symbol
  const getIconUrl = (symbol: string) => {
    // Use simple emoji fallbacks instead of external images
    return symbol.toLowerCase();
  };
  
  if (loading && !coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error && !coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  if (!coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Cryptocurrency not found. Please check the ID and try again.
          </p>
        </div>
        <Link href="/" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
          Back to Dashboard
        </Link>
      </div>
      
      {/* Header with coin info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-16 w-16 mr-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-2xl font-bold">
              {/* Use simple emoji fallbacks instead of images */}
              {coin.symbol === 'BTC' && '₿'}
              {coin.symbol === 'ETH' && 'Ξ'}
              {coin.symbol === 'SOL' && 'S'}
              {!['BTC', 'ETH', 'SOL'].includes(coin.symbol) && coin.symbol.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {coin.name} ({coin.symbol})
              </h1>
              <div className={`text-xl ${getChangeColor(coin.changePercent24Hr)}`}>
                {formatChange(coin.changePercent24Hr)} (24h)
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-right mr-4">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {coin.livePrice 
                  ? formatPrice(coin.livePrice)
                  : formatPrice(coin.priceUsd)}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {coin.livePrice && 'LIVE'}
              </div>
            </div>
            
            <button
              onClick={() => toggleCoinFavorite(coinId)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                isFavorite
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 mr-2 ${
                  isFavorite ? 'text-yellow-500 fill-yellow-500' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
        
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatMarketCap(coin.marketCapUsd)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
            <p className={`text-xl font-bold ${getChangeColor(coin.changePercent24Hr)}`}>
              {formatChange(coin.changePercent24Hr)}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Symbol</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{coin.symbol}</p>
          </div>
        </div>
      </div>
      
      {/* Historical Price Data */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Price History
        </h2>
        
        {!coinHistory && (
          <LoadingSpinner />
        )}
        
        {coinHistory && (
          <>
            {/* Chart */}
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={coinHistory.data.map(item => ({
                    time: formatTimestamp(item.time),
                    price: parseFloat(item.priceUsd)
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => {
                      if (value === undefined || value === null || isNaN(value)) {
                        return '$0.00';
                      }
                      return `$${value.toFixed(2)}`;
                    }}
                  />
                  <Tooltip 
                    formatter={(value: number) => {
                      if (value === undefined || value === null || isNaN(value)) {
                        return ['$0.00', 'Price'];
                      }
                      return [`$${value.toFixed(2)}`, 'Price'];
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                    name="Price (USD)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Recent Prices Table */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Prices
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price (USD)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {coinHistory.data.slice(0, 10).map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatTimestamp(item.time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatPrice(item.priceUsd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 