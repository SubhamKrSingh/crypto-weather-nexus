import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'price_alert' | 'weather_alert';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
}

// Maximum number of notifications to keep
const MAX_NOTIFICATIONS = 30;

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const { type, title, message } = action.payload;
      const id = Date.now().toString();
      
      // Add the new notification at the beginning of the array
      state.items.unshift({
        id,
        type,
        title,
        message,
        timestamp: Date.now(),
        read: false,
      });
      
      state.unreadCount += 1;
      
      // Keep only the most recent MAX_NOTIFICATIONS notifications
      if (state.items.length > MAX_NOTIFICATIONS) {
        // Calculate how many unread notifications we're removing
        const removedItems = state.items.splice(MAX_NOTIFICATIONS);
        const unreadRemoved = removedItems.filter(item => !item.read).length;
        
        // Adjust the unread count
        state.unreadCount = Math.max(0, state.unreadCount - unreadRemoved);
      }
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(item => item.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllAsRead: (state) => {
      state.items.forEach(item => {
        item.read = true;
      });
      state.unreadCount = 0;
    },
    
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const { 
  addNotification, 
  markAsRead, 
  markAllAsRead, 
  clearNotifications 
} = notificationsSlice.actions;

export default notificationsSlice.reducer; 