'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../lib/hooks/reduxHooks';
import { fetchWeatherData, WeatherData } from '../lib/redux/slices/weatherSlice';
import WeatherCard from '../components/weather/WeatherCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Link from 'next/link';
import { useFavorites } from '../lib/hooks/useFavorites';
import { CityWeather } from '../lib/types/weather';

export default function WeatherIndexPage() {
  const dispatch = useAppDispatch();
  const { cities, loading, error } = useAppSelector(state => state.weather);
  const { favorites } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Fetch weather data if not available
    if (cities.length === 0) {
      dispatch(fetchWeatherData());
    }
    
    // Refresh weather data every 5 minutes
    const intervalId = setInterval(() => {
      dispatch(fetchWeatherData());
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [dispatch, cities.length]);
  
  // Convert WeatherData to CityWeather format
  const adaptWeatherData = (city: WeatherData): CityWeather => {
    return {
      id: city.id.toString(),
      city: city.city,
      country: "Unknown", // Default value as it's not in the original data
      lat: 0, // Default value
      lon: 0, // Default value
      timezone: "UTC", // Default value
      current: {
        temp: city.temperature,
        feelsLike: city.temperature - 2, // Approximate feels like
        humidity: city.humidity,
        windSpeed: city.windSpeed,
        condition: city.conditions,
        iconUrl: `https://openweathermap.org/img/wn/${city.icon}@2x.png`,
        precipitation: 0, // Default value
        pressure: 1013, // Default value
        visibility: 10000, // Default value
        uvIndex: 0 // Default value
      }
    };
  };
  
  // Convert cities to CityWeather format
  const adaptedCities = cities.map(city => adaptWeatherData(city));
  
  // Filter cities based on search term
  const filteredCities = adaptedCities.filter(city => 
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort cities to show favorites first
  const sortedCities = [...filteredCities].sort((a, b) => {
    const aIsFavorite = favorites?.cities?.includes(a.city) || false;
    const bIsFavorite = favorites?.cities?.includes(b.city) || false;
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0;
  });
  
  const favoriteCities = sortedCities.filter(city => favorites?.cities?.includes(city.city) || false);
  const regularCities = sortedCities.filter(city => !(favorites?.cities?.includes(city.city) || false));
  
  const renderContent = () => {
    if (loading && cities.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      );
    }
    
    if (error && cities.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <ErrorMessage message={error} />
        </div>
      );
    }
    
    if (filteredCities.length === 0) {
      return (
        <div className="flex items-center justify-center py-32">
          <div className="text-center max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <p className="text-gray-400 text-lg">
              {cities.length === 0 
                ? "No weather data available." 
                : "No cities match your search."}
            </p>
            {cities.length > 0 && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-teal-600/20 text-teal-400 rounded-lg hover:bg-teal-600/30 transition-colors"
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
        {favoriteCities.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center text-teal-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Favorite Cities
            </h2>
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden">
              {favoriteCities.map(city => (
                <WeatherCard key={city.id} city={city} />
              ))}
            </div>
          </section>
        )}
        
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center text-teal-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
            All Cities
          </h2>
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden">
            {regularCities.map(city => (
              <WeatherCard key={city.id} city={city} />
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
              className="mr-4 p-2 rounded-full bg-teal-900/30 text-teal-400 hover:bg-teal-800/40 hover:text-teal-300 transition-all"
              aria-label="Back to Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent tracking-tight">Weather</h1>
          </div>
          <p className="text-gray-400 ml-11">Real-time weather information and forecasts for cities worldwide.</p>
        </div>
        
        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search cities..."
            className="w-full pl-10 px-4 py-3 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all shadow-lg"
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