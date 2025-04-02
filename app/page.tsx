'use client';

import { useEffect } from 'react';
import { useAppDispatch } from './lib/hooks/reduxHooks';
import { fetchWeatherData } from './lib/redux/slices/weatherSlice';
import { fetchCryptoData } from './lib/redux/slices/cryptoSlice';
import { fetchNewsData } from './lib/redux/slices/newsSlice';
import { hydrateFavorites } from './lib/redux/slices/favoritesSlice';
import Dashboard from './components/Dashboard';

export default function HomePage() {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Load favorites from localStorage
    dispatch(hydrateFavorites());
    
    // Fetch initial data
    dispatch(fetchWeatherData());
    dispatch(fetchCryptoData());
    dispatch(fetchNewsData());
    
    // Set up periodic data refresh (every 60 seconds)
    const intervalId = setInterval(() => {
      dispatch(fetchWeatherData());
      dispatch(fetchCryptoData());
      dispatch(fetchNewsData());
    }, 60000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);
  
  return (
    <main>
      <Dashboard />
    </main>
  );
} 