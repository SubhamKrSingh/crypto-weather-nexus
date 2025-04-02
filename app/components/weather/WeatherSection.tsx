'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../lib/hooks/reduxHooks';
import { fetchWeatherData, WeatherData } from '../../lib/redux/slices/weatherSlice';
import WeatherCard from './WeatherCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import Link from 'next/link';
import { useFavorites } from '../../lib/hooks/useFavorites';
import { CityWeather } from '../../lib/types/weather';

export default function WeatherSection() {
  const { cities, loading, error } = useAppSelector(state => state.weather);
  const dispatch = useAppDispatch();
  const { favorites } = useFavorites();
  
  useEffect(() => {
    if (cities.length === 0 && !loading && !error) {
      dispatch(fetchWeatherData());
    }
  }, [cities.length, loading, error, dispatch]);
  
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
  
  // Select top 3 cities to display (prioritize favorites)
  const citiesToShow = () => {
    // Convert all cities to the CityWeather format
    const adaptedCities = cities.map(city => adaptWeatherData(city));
    
    // Get favorite cities with the new format
    const adaptedFavoriteCities = adaptedCities.filter(city => 
      favorites?.cities?.includes(city.city) || false
    );
    
    if (adaptedFavoriteCities.length < 3) {
      const nonFavoriteCities = adaptedCities.filter(city => 
        !(favorites?.cities?.includes(city.city) || false)
      );
      
      return [
        ...adaptedFavoriteCities,
        ...nonFavoriteCities.slice(0, 3 - adaptedFavoriteCities.length)
      ];
    } else {
      return adaptedFavoriteCities.slice(0, 3);
    }
  };
  
  const renderContent = () => {
    if (loading && cities.length === 0) {
      return <LoadingSpinner />;
    }
    
    if (error && cities.length === 0) {
      return <ErrorMessage message={error} />;
    }
    
    if (cities.length === 0) {
      return (
        <p className="text-gray-400 text-center py-6">No weather data available.</p>
      );
    }
    
    const adaptedCities = citiesToShow();
    
    return (
      <div className="space-y-3">
        {adaptedCities.map(city => (
          <WeatherCard key={city.id} city={city} />
        ))}
        
        <div className="px-4 pb-4 pt-2">
          <Link 
            href="/weather" 
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center py-2"
          >
            View all weather data →
          </Link>
        </div>
      </div>
    );
  };
  
  return renderContent();
} 