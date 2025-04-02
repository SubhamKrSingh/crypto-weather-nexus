import { store } from '../redux/store';
import { updateLivePrice } from '../redux/slices/cryptoSlice';
import { addNotification } from '../redux/slices/notificationsSlice';
import { simulateWeatherAlert } from '../redux/slices/weatherSlice';

// Define the shape of price data from the CoinCap WebSocket
interface PriceData {
  [key: string]: string; // e.g., { bitcoin: '29500.51', ethereum: '1800.23' }
}

// TrackedPrices to monitor price changes and determine significant changes
interface TrackedPrices {
  [key: string]: { 
    current: number;
    previous: number;
    alertThreshold: number; // Percentage threshold for alerts (e.g., 1.0 = 1%)
    lastAlertTime: number;
  };
}

// Keep track of prices for determining significant changes
const trackedPrices: TrackedPrices = {
  bitcoin: { current: 0, previous: 0, alertThreshold: 0.5, lastAlertTime: 0 },
  ethereum: { current: 0, previous: 0, alertThreshold: 0.5, lastAlertTime: 0 },
  solana: { current: 0, previous: 0, alertThreshold: 0.5, lastAlertTime: 0 },
};

// Keep track of weather alerts to prevent spamming
const weatherAlertTracking: Record<string, number> = {
  'New York': 0,
  'London': 0,
  'Tokyo': 0
};

// WebSocket connection instance
let wsConnection: WebSocket | null = null;

// Minimum interval between alerts for the same coin (30 seconds instead of 2 minutes)
const ALERT_COOLDOWN = 30 * 1000;

// Minimum interval between weather alerts for the same city (1 minute instead of 5)
const WEATHER_ALERT_COOLDOWN = 60 * 1000;

// Weather alert interval timer reference
let weatherAlertTimer: NodeJS.Timeout | null = null;

// Function to connect to the WebSocket
export const connectWebSocket = () => {
  // Don't initialize WebSocket in server-side rendering
  if (typeof window === 'undefined') return;
  
  const wsUrl = process.env.NEXT_PUBLIC_COINCAP_WEBSOCKET_URL;
  
  if (!wsUrl) {
    console.error('WebSocket URL not defined in environment variables');
    return;
  }
  
  // Close any existing connection
  if (wsConnection) {
    wsConnection.close();
  }
  
  // Create a new WebSocket connection
  wsConnection = new WebSocket(wsUrl);
  
  // Handle connection open
  wsConnection.onopen = () => {
    console.log('WebSocket connection established');
    
    // Send initial notifications immediately
    sendInitialNotifications();
  };
  
  // Handle connection error
  wsConnection.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  // Handle connection close
  wsConnection.onclose = () => {
    console.log('WebSocket connection closed');
    // Reconnect after a delay
    setTimeout(() => {
      connectWebSocket();
    }, 5000);
  };
  
  // Handle incoming messages
  wsConnection.onmessage = (event) => {
    try {
      const priceData: PriceData = JSON.parse(event.data);
      
      // Update Redux store with new prices
      Object.entries(priceData).forEach(([coinId, price]) => {
        // Update the live price in Redux
        store.dispatch(updateLivePrice({ id: coinId, price }));
        
        // Track price changes for alerts
        if (trackedPrices[coinId]) {
          const numericPrice = parseFloat(price);
          
          // Update previous and current prices
          trackedPrices[coinId].previous = trackedPrices[coinId].current;
          trackedPrices[coinId].current = numericPrice;
          
          // Check if we need to send an alert
          const priceChange = Math.abs(
            (numericPrice - trackedPrices[coinId].previous) / trackedPrices[coinId].previous * 100
          );
          
          const now = Date.now();
          const cooldownElapsed = now - trackedPrices[coinId].lastAlertTime > ALERT_COOLDOWN;
          
          if (
            trackedPrices[coinId].previous > 0 && 
            priceChange >= trackedPrices[coinId].alertThreshold && 
            cooldownElapsed
          ) {
            // Send a price alert notification
            const direction = numericPrice > trackedPrices[coinId].previous ? 'increased' : 'decreased';
            
            // Make sure priceChange and numericPrice are valid numbers before using toFixed
            const safeFormattedChange = !isNaN(priceChange) ? priceChange.toFixed(2) : '0.00';
            const safeFormattedPrice = !isNaN(numericPrice) ? numericPrice.toFixed(2) : '0.00';
            
            store.dispatch(addNotification({
              type: 'price_alert',
              title: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price Alert`,
              message: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} has ${direction} by ${safeFormattedChange}% to $${safeFormattedPrice}`
            }));
            
            // Update last alert time
            trackedPrices[coinId].lastAlertTime = now;
          }
        }
      });
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };
  
  // Start the simulated weather alerts
  startWeatherAlertSimulation();
};

// Function to disconnect from the WebSocket
export const disconnectWebSocket = () => {
  if (wsConnection) {
    wsConnection.close();
    wsConnection = null;
  }
  
  // Clear weather alert timer
  if (weatherAlertTimer) {
    clearInterval(weatherAlertTimer);
    weatherAlertTimer = null;
  }
};

// Function to simulate weather alerts periodically
const startWeatherAlertSimulation = () => {
  // Don't initialize in server-side rendering
  if (typeof window === 'undefined') return;
  
  // Clear any existing timer
  if (weatherAlertTimer) {
    clearInterval(weatherAlertTimer);
  }
  
  const WEATHER_CONDITIONS = [
    { condition: 'Heavy Rain', message: 'Expected heavy rainfall in the next 24 hours.' },
    { condition: 'Strong Winds', message: 'Wind speeds expected to reach 40mph.' },
    { condition: 'Heat Wave', message: 'Temperatures expected to rise above 100°F.' },
    { condition: 'Thunderstorm', message: 'Thunderstorms expected in the evening.' },
    { condition: 'Snow', message: 'Heavy snowfall expected overnight.' },
  ];
  
  const CITIES = ['New York', 'London', 'Tokyo'];
  
  // Function to send a weather alert
  const sendWeatherAlert = () => {
    const now = Date.now();
    
    // Get a random city that isn't on cooldown
    const availableCities = CITIES.filter(city => 
      now - (weatherAlertTracking[city] || 0) >= WEATHER_ALERT_COOLDOWN
    );
    
    // If no cities are available (all on cooldown), don't send any alert
    if (availableCities.length === 0) return;
    
    const randomCondition = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];
    const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
    
    // Update the last alert time for this city
    weatherAlertTracking[randomCity] = now;
    
    // Dispatch the weather alert action
    store.dispatch(simulateWeatherAlert(`${randomCondition.condition} in ${randomCity}`));
    
    // Create a notification for the alert
    store.dispatch(addNotification({
      type: 'weather_alert',
      title: `${randomCondition.condition} Alert for ${randomCity}`,
      message: randomCondition.message
    }));
  };
  
  // Send one alert immediately (except during initial notifications)
  if (!Object.values(weatherAlertTracking).some(time => time > 0)) {
    setTimeout(sendWeatherAlert, 6000);
  }
  
  // Send a weather alert every 20-45 seconds
  weatherAlertTimer = setInterval(sendWeatherAlert, 20000 + Math.random() * 25000);
};

// Send initial notifications to ensure the user sees notifications right away
const sendInitialNotifications = () => {
  const now = Date.now();
  
  // Send a welcome notification
  store.dispatch(addNotification({
    type: 'weather_alert',
    title: 'Welcome to CryptoWeather Nexus',
    message: 'You will receive real-time updates for weather and crypto prices.'
  }));
  
  // Initialize prices to start getting price change alerts right away
  trackedPrices.bitcoin.current = 68742.50;
  trackedPrices.bitcoin.previous = 67926.38;
  trackedPrices.ethereum.current = 3521.75;
  trackedPrices.ethereum.previous = 3493.80;
  trackedPrices.solana.current = 147.25;
  trackedPrices.solana.previous = 145.92;
  
  // Send initial crypto price notifications
  setTimeout(() => {
    store.dispatch(addNotification({
      type: 'price_alert',
      title: 'Bitcoin Price Alert',
      message: 'Bitcoin has increased by 1.2% to $68,742.50'
    }));
  }, 1500);
  
  setTimeout(() => {
    store.dispatch(addNotification({
      type: 'price_alert',
      title: 'Ethereum Price Alert',
      message: 'Ethereum has increased by 0.8% to $3,521.75'
    }));
  }, 3000);
  
  // Send an initial weather notification
  setTimeout(() => {
    const CITIES = ['New York', 'London', 'Tokyo'];
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    
    store.dispatch(addNotification({
      type: 'weather_alert',
      title: `Thunderstorm Alert for ${randomCity}`,
      message: 'Thunderstorms expected in the evening.'
    }));
    
    // Update the city's last alert time
    weatherAlertTracking[randomCity] = now;
  }, 4500);
  
  // Force another batch of notifications after a short delay
  setTimeout(() => {
    // Simulate price changes to trigger alerts
    const fakeBitcoinPrice = (69100 + Math.random() * 500).toFixed(2);
    const fakeEthereumPrice = (3550 + Math.random() * 50).toFixed(2);
    const fakeSolanaPrice = (148 + Math.random() * 5).toFixed(2);
    
    // Manually simulate price updates
    if (wsConnection) {
      const fakeData = JSON.stringify({
        bitcoin: fakeBitcoinPrice,
        ethereum: fakeEthereumPrice,
        solana: fakeSolanaPrice
      });
      
      // Call the message handler directly
      wsConnection.onmessage?.({ data: fakeData } as MessageEvent);
    }
  }, 15000);
}; 