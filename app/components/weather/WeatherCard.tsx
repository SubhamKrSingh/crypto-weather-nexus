'use client';

import Link from 'next/link';
import { WeatherData } from '../../lib/redux/slices/weatherSlice';
import { useFavorites } from '../../lib/hooks/useFavorites';
import { CityWeather } from '../../lib/types/weather';

interface WeatherCardProps {
  city: CityWeather;
}

export default function WeatherCard({ city }: WeatherCardProps) {
  const { isCityFavorite, toggleCityFavorite } = useFavorites();
  const isFavorite = isCityFavorite(city?.city);
  
  // Handle missing data - provide fallback for city
  if (!city || !city.current) {
    return (
      <div className="p-3 bg-gray-800 rounded-lg">
        <div className="text-center py-4 text-gray-400">
          Weather data unavailable
        </div>
      </div>
    );
  }
  
  // Get the weather image URL or use a fallback image
  const getWeatherImage = () => {
    if (city?.current?.iconUrl) return city.current.iconUrl;
    
    // Fallback images based on condition
    const condition = city?.current?.condition?.toLowerCase() || '';
    
    if (condition.includes('clear') || condition.includes('sunny')) {
      return 'https://openweathermap.org/img/wn/01d@2x.png';
    } else if (condition.includes('cloud')) {
      return 'https://openweathermap.org/img/wn/03d@2x.png';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'https://openweathermap.org/img/wn/10d@2x.png';
    } else if (condition.includes('snow')) {
      return 'https://openweathermap.org/img/wn/13d@2x.png';
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return 'https://openweathermap.org/img/wn/50d@2x.png';
    }
    
    // Default fallback
    return 'https://openweathermap.org/img/wn/02d@2x.png';
  };
  
  // Helper function to get background color based on temperature
  const getTempColor = (temp: number): string => {
    if (temp > 30) return 'from-red-500/10 to-orange-500/10';
    if (temp > 20) return 'from-orange-400/10 to-yellow-500/10';
    if (temp > 10) return 'from-yellow-400/10 to-blue-400/10';
    return 'from-blue-400/10 to-indigo-500/10';
  };
  
  return (
    <Link 
      href={`/weather/${city.id}`} 
      className="block"
    >
      <div className="p-4 bg-gray-800/80 hover:bg-gray-800 border-b border-gray-700 transition duration-300 hover:shadow-lg hover:shadow-teal-900/10">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold text-white text-lg flex items-center">
              {city.city}
              {city.country !== "Unknown" && (
                <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                  {city.country}
                </span>
              )}
            </h3>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCityFavorite(city.city);
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
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <div className="w-16 h-16 mr-3">
              <img 
                src={getWeatherImage()} 
                alt={city?.current?.condition || 'Weather'}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">{Math.round(city?.current?.temp || 0)}°</span>
              <span className="text-sm text-gray-400 capitalize">{city?.current?.condition || 'Unknown'}</span>
            </div>
          </div>
          
          <div className="flex flex-col text-right">
            <div className="flex items-center text-xs text-gray-400 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              {city?.current?.humidity || 0}% humidity
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {city?.current?.windSpeed || 0} mph
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 