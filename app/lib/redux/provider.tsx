'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect, useRef } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../services/webSocketService';
import { hydrateFavorites } from './slices/favoritesSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Use a ref to track initialization status
  const initialized = useRef(false);
  
  useEffect(() => {
    // Only initialize WebSocket and hydrate favorites once
    if (!initialized.current) {
      // Initialize the WebSocket connection
      connectWebSocket();
      
      // Hydrate favorites from localStorage
      store.dispatch(hydrateFavorites());
      
      initialized.current = true;

      // Log the initial state of favorites
      const state = store.getState();
      console.log('Initial favorites state:', state.favorites);
    }
    
    // Cleanup on unmount
    return () => {
      disconnectWebSocket();
    };
  }, []);
  
  // FavoritesInitializer component to ensure favorites are hydrated in the client
  const FavoritesInitializer = () => {
    useEffect(() => {
      // Ensure favorites are hydrated after client-side navigation
      store.dispatch(hydrateFavorites());
    }, []);
    return null;
  };
  
  return (
    <Provider store={store}>
      <FavoritesInitializer />
      {children}
    </Provider>
  );
}