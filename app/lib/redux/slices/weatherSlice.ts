import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface WeatherData {
  id: number;
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
  icon: string;
  timestamp: number;
}

export interface WeatherHistoryData {
  cityId: number;
  history: {
    date: string;
    temperature: number;
    humidity: number;
  }[];
}

export interface ForecastData {
  cityId: number;
  daily: {
    date: string;
    minTemp: number;
    maxTemp: number;
    humidity: number;
    conditions: string;
  }[];
}

interface WeatherState {
  cities: WeatherData[];
  history: Record<string, WeatherHistoryData>;
  forecasts: Record<number, ForecastData>;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  cities: [],
  history: {},
  forecasts: {},
  loading: false,
  error: null,
};

// Predefined cities
const DEFAULT_CITIES = [
  { id: 5128581, name: 'New York' },
  { id: 2643743, name: 'London' },
  { id: 1850147, name: 'Tokyo' },
];

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (_, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const apiUrl = process.env.NEXT_PUBLIC_WEATHER_API_URL;
      
      const requests = DEFAULT_CITIES.map((city) => 
        axios.get(`${apiUrl}/weather?id=${city.id}&units=metric&appid=${apiKey}`)
      );
      
      const responses = await Promise.all(requests);
      
      return responses.map((response) => {
        const data = response.data;
        return {
          id: data.id,
          city: data.name,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          conditions: data.weather[0].main,
          icon: data.weather[0].icon,
          timestamp: Date.now(),
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchWeatherHistory = createAsyncThunk(
  'weather/fetchWeatherHistory',
  async (cityId: number, { rejectWithValue }) => {
    try {
      // In a real app, we would use a real API for historical data
      // For this demo, we'll simulate it with 5 days of data
      const history = Array.from({ length: 5 }).map((_, i) => {
        return {
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          temperature: Math.floor(Math.random() * 15) + 10, // Random temp between 10-25
          humidity: Math.floor(Math.random() * 50) + 30, // Random humidity between 30-80
        };
      });
      
      return { cityId, history };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (cityId: number, { rejectWithValue }) => {
    try {
      // In a real app, we would use a real API for forecast data
      // For this demo, we'll simulate it with a 7-day forecast
      const dailyForecast = Array.from({ length: 7 }).map((_, i) => {
        return {
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          minTemp: Math.floor(Math.random() * 10) + 5, // Random min temp between 5-15
          maxTemp: Math.floor(Math.random() * 15) + 10, // Random max temp between 10-25
          humidity: Math.floor(Math.random() * 50) + 30, // Random humidity between 30-80
          conditions: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
        };
      });
      
      return { cityId, daily: dailyForecast };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    simulateWeatherAlert: (state, action: PayloadAction<string>) => {
      // This action will be used by the WebSocket simulation
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWeatherHistory.fulfilled, (state, action) => {
        const { cityId, history } = action.payload;
        state.history[cityId] = { cityId, history };
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        const { cityId, daily } = action.payload;
        state.forecasts[cityId] = { cityId, daily };
      });
  },
});

export const { simulateWeatherAlert } = weatherSlice.actions;
export default weatherSlice.reducer; 