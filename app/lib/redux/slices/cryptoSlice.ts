import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
  livePrice?: string;
  timestamp: number;
}

export interface CryptoHistoryData {
  data: {
    priceUsd: string;
    time: number;
  }[];
}

interface CryptoState {
  coins: CryptoData[];
  history: Record<string, CryptoHistoryData>;
  loading: boolean;
  error: string | null;
}

// Predefined coins
const DEFAULT_COINS = ['bitcoin', 'ethereum', 'solana'];

const initialState: CryptoState = {
  coins: [],
  history: {},
  loading: false,
  error: null,
};

export const fetchCryptoData = createAsyncThunk(
  'crypto/fetchCryptoData',
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_COINCAP_API_URL;
      
      const response = await axios.get(`${apiUrl}/assets`);
      const allCoins = response.data.data;
      
      // Filter only the coins we want to display
      const filteredCoins = allCoins.filter((coin: CryptoData) => 
        DEFAULT_COINS.includes(coin.id)
      );
      
      return filteredCoins.map((coin: CryptoData) => ({
        ...coin,
        timestamp: Date.now(),
      }));
    } catch (error) {
      // Provide fallback data if API fails
      console.error("Error fetching crypto data:", error);
      
      // Return fallback data for the predefined coins
      return [
        {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          priceUsd: "68241.52",
          changePercent24Hr: "1.25",
          marketCapUsd: "1350672170563.45",
          timestamp: Date.now()
        },
        {
          id: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          priceUsd: "3456.78",
          changePercent24Hr: "2.15",
          marketCapUsd: "415678945612.34",
          timestamp: Date.now()
        },
        {
          id: "solana",
          symbol: "SOL",
          name: "Solana",
          priceUsd: "145.67",
          changePercent24Hr: "-0.83",
          marketCapUsd: "65432178901.23",
          timestamp: Date.now()
        }
      ];
    }
  }
);

export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchCryptoHistory',
  async (coinId: string, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_COINCAP_API_URL;
      // Get 7 days of history, interval is in milliseconds (1 hour = 3600000)
      const response = await axios.get(
        `${apiUrl}/assets/${coinId}/history?interval=h1`
      );
      
      return {
        coinId,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching history for ${coinId}:`, error);
      
      // Generate 7 days of mock price data
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const mockData = [];
      
      // Set base price based on coin type
      let basePrice = 0;
      if (coinId === 'bitcoin') basePrice = 65000;
      else if (coinId === 'ethereum') basePrice = 3400;
      else if (coinId === 'solana') basePrice = 140;
      else basePrice = 100;
      
      // Generate data points for the last 7 days (one per day)
      for (let i = 0; i < 168; i++) { // 7 days * 24 hours
        const time = now - (i * 3600000); // every hour
        // Random price fluctuation between -3% and +3%
        const fluctuation = (Math.random() * 6 - 3) / 100;
        const hourlyPrice = basePrice * (1 + fluctuation);
        
        mockData.push({
          priceUsd: hourlyPrice.toString(),
          time,
          date: new Date(time).toISOString()
        });
      }
      
      return {
        coinId,
        data: mockData
      };
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateLivePrice: (state, action: PayloadAction<{ id: string; price: string }>) => {
      const { id, price } = action.payload;
      const coinIndex = state.coins.findIndex(coin => coin.id === id);
      
      if (coinIndex !== -1) {
        state.coins[coinIndex].livePrice = price;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false;
        state.coins = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        const { coinId, data } = action.payload;
        state.history[coinId] = { data };
      });
  },
});

export const { updateLivePrice } = cryptoSlice.actions;
export default cryptoSlice.reducer; 