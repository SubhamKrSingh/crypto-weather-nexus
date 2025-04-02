'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks/reduxHooks';
import { fetchWeatherData, fetchForecast } from '../../lib/redux/slices/weatherSlice';
import { useFavorites } from '../../lib/hooks/useFavorites';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

export default function WeatherDetailPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const cityId = parseInt(params.id as string);
  
  const { cities, forecasts, loading, error } = useAppSelector(state => state.weather);
  const { isCityFavorite, toggleCityFavorite } = useFavorites();
  const [selectedTab, setSelectedTab] = useState<'forecast' | 'history'>('forecast');
  
  // Find the city data
  const city = cities.find(c => c.id === cityId);

  useEffect(() => {
    if (cities.length === 0 && !loading && !error) {
      dispatch(fetchWeatherData());
    }
    
    if (city && !forecasts[city.id]) {
      dispatch(fetchForecast(city.id));
    }
  }, [dispatch, cities.length, city, forecasts, loading, error]);
  
  if (loading && !city) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error && !city) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  if (!city) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            City not found. Please check the ID and try again.
          </p>
        </div>
        <Link href="/" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  const isFavorite = isCityFavorite(city.city);
  const forecast = forecasts[city.id] || null;
  
  // Get the appropriate icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${city.icon}@4x.png`;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
          Back to Dashboard
        </Link>
      </div>
      
      {/* Header with city info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative h-24 w-24 mr-4">
              <Image
                src={iconUrl}
                alt={city.conditions}
                fill
                sizes="100px"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {city.city}
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                {city.conditions}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => toggleCityFavorite(city.city)}
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
        
        {/* Current Weather Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{Math.round(city.temperature)}°C</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{city.humidity}%</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{city.windSpeed} m/s</p>
          </div>
        </div>
      </div>
      
      {/* Forecast/History Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-800">
          <div className="flex">
            <button
              className={`px-6 py-4 font-medium ${
                selectedTab === 'forecast' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedTab('forecast')}
            >
              7-Day Forecast
            </button>
            <button
              className={`px-6 py-4 font-medium ${
                selectedTab === 'history' 
                  ? 'text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedTab('history')}
            >
              Weather History
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {selectedTab === 'forecast' ? (
            <div>
              <h3 className="text-lg font-medium mb-4">Temperature trend for the week</h3>
              {!forecast ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {forecast.daily.slice(0, 7).map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-20">{formatDay(day.date)}</div>
                      <div className="flex-1 px-4">
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ 
                              width: `${getTemperaturePercentage(day.minTemp, day.maxTemp, 0, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-300 w-10 text-right">{Math.round(day.minTemp)}°</span>
                        <span className="mx-2">-</span>
                        <span className="text-orange-300 w-10">{Math.round(day.maxTemp)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">Detailed weather data</h3>
              <div className="py-8 text-center text-gray-400">
                Historical weather data will be available soon.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to format the day
function formatDay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Helper function to calculate temperature percentage for the bar
function getTemperaturePercentage(min: number, max: number, absMin: number, absMax: number): number {
  const range = absMax - absMin;
  const adjustedMax = ((max - absMin) / range) * 100;
  const adjustedMin = ((min - absMin) / range) * 100;
  return adjustedMax - adjustedMin;
}

// Function to get weather icon based on condition
function getWeatherIcon(condition: string) {
  const lowerCondition = condition.toLowerCase();
  
  if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="5" fill="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.722-3.722l-.707-.707M17.985 6.271l.707-.707M6.271 17.985l-.707.707m12.421 0l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  } else if (lowerCondition.includes('cloud')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    );
  } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14.256A5 5 0 0016.667 9.5 6 6 0 105.5 15.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 19l1.5 1.5m3-3l1.5 1.5m-3-3L9 16.5m6 0l-1.5 1.5" />
      </svg>
    );
  } else {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    );
  }
} 