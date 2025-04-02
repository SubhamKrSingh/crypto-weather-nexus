import { useAppSelector, useAppDispatch } from './reduxHooks';
import { toggleCityFavorite as toggleCity, toggleCoinFavorite as toggleCoin } from '../redux/slices/favoritesSlice';

export function useFavorites() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites);
  
  // City favorites functions
  const toggleCityFavorite = (cityName: string) => {
    dispatch(toggleCity(cityName));
  };
  
  const isCityFavorite = (cityName: string) => {
    return Array.isArray(favorites?.cities) && favorites.cities.includes(cityName);
  };
  
  // Coin favorites functions
  const toggleCoinFavorite = (coinId: string) => {
    dispatch(toggleCoin(coinId));
  };
  
  const isCoinFavorite = (coinId: string) => {
    return Array.isArray(favorites?.coins) && favorites.coins.includes(coinId);
  };
  
  return {
    favorites,
    toggleCityFavorite,
    isCityFavorite,
    toggleCoinFavorite,
    isCoinFavorite
  };
} 