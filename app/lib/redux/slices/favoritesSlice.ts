import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  cities: string[]; // City names
  coins: string[]; // Crypto IDs
  initialized: boolean;
}

const initialState: FavoritesState = {
  cities: [],
  coins: [],
  initialized: false
};

// Helper function to load favorites from localStorage (client-side only)
const loadFavorites = (): FavoritesState => {
  if (typeof window === 'undefined') {
    return initialState;
  }
  
  try {
    const favoritesJson = localStorage.getItem('favorites');
    if (!favoritesJson) return { ...initialState, initialized: true };
    
    const parsed = JSON.parse(favoritesJson) as Partial<FavoritesState>;
    
    // Ensure both arrays exist
    return {
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      coins: Array.isArray(parsed.coins) ? parsed.coins : [],
      initialized: true
    };
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
    return { ...initialState, initialized: true };
  }
};

// Helper function to save favorites to localStorage
const saveFavorites = (state: FavoritesState) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    // Only save the data we need, not the state flag
    const dataToSave = {
      cities: state.cities,
      coins: state.coins
    };
    localStorage.setItem('favorites', JSON.stringify(dataToSave));
    console.log('Saved favorites:', dataToSave);
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleCityFavorite: (state, action: PayloadAction<string>) => {
      const cityName = action.payload;
      
      // Ensure cities array exists
      if (!state.cities) {
        state.cities = [];
      }
      
      const index = state.cities.indexOf(cityName);
      
      if (index === -1) {
        state.cities.push(cityName);
      } else {
        state.cities.splice(index, 1);
      }
      
      saveFavorites(state);
    },
    
    toggleCoinFavorite: (state, action: PayloadAction<string>) => {
      const coinId = action.payload;
      
      // Ensure coins array exists
      if (!state.coins) {
        state.coins = [];
      }
      
      const index = state.coins.indexOf(coinId);
      
      if (index === -1) {
        state.coins.push(coinId);
        console.log(`Added ${coinId} to favorites, new state:`, state.coins);
      } else {
        state.coins.splice(index, 1);
        console.log(`Removed ${coinId} from favorites, new state:`, state.coins);
      }
      
      saveFavorites(state);
    },
    
    clearAllFavorites: (state) => {
      state.cities = [];
      state.coins = [];
      saveFavorites(state);
    },
    
    hydrateFavorites: (state) => {
      const loaded = loadFavorites();
      state.cities = loaded.cities;
      state.coins = loaded.coins;
      state.initialized = true;
      console.log('Hydrated favorites:', state);
    },
  },
});

export const { 
  toggleCityFavorite, 
  toggleCoinFavorite, 
  clearAllFavorites,
  hydrateFavorites
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 