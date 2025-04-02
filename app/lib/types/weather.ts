/**
 * Type definitions for weather data
 */

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  iconUrl: string;
  precipitation: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
}

export interface ForecastDay {
  date: string;
  minTemp: number;
  maxTemp: number;
  condition: string;
  iconUrl: string;
  chanceOfRain: number;
  sunrise: string;
  sunset: string;
}

export interface HistoricalDay {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  condition: string;
  iconUrl: string;
  humidity: number;
  precipitation: number;
}

export interface CityWeather {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  current: CurrentWeather;
  forecast?: ForecastDay[];
  history?: HistoricalDay[];
}

export interface WeatherState {
  cities: CityWeather[];
  loading: boolean;
  error: string | null;
} 