# CryptoWeather Nexus

A modern dashboard combining weather data, cryptocurrency information, and real-time notifications.

## 📚 Features

- **Weather Dashboard**: Display weather for multiple cities with temperature, humidity, and conditions
- **Cryptocurrency Tracker**: Track prices, market cap, and 24h changes for Bitcoin, Ethereum, and Solana
- **Crypto News**: Latest cryptocurrency news from reputable sources
- **Real-Time Updates**: Live price updates via WebSocket for cryptocurrencies
- **Favorites System**: Save your favorite cities and cryptocurrencies
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Dark Mode Support**: Built-in support for light and dark themes
- **Notification System**: Real-time alerts for significant price changes and simulated weather alerts

## 🚀 Technologies Used

- **Framework**: Next.js 13+ with App Router
- **State Management**: Redux Toolkit with Redux Thunk
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Real-time Updates**: WebSocket for live cryptocurrency price updates
- **Notifications**: Custom notification system with toast alerts

## 📦 APIs Used

- **Weather Data**: OpenWeatherMap API
- **Cryptocurrency Data**: CoinCap API
- **WebSocket Data**: CoinCap WebSocket API
- **News Data**: NewsData.io API (with fallback mock data)

## 🔧 Setup & Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/crypto-weather-nexus.git
cd crypto-weather-nexus
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory and add your API keys:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
NEXT_PUBLIC_COINCAP_WEBSOCKET_URL=wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana
NEXT_PUBLIC_COINCAP_API_URL=https://api.coincap.io/v2
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
NEXT_PUBLIC_NEWS_API_URL=https://newsdata.io/api/1
```

4. **Run the development server**

```bash
npm run dev
```

5. **Build for production**

```bash
npm run build
```

6. **Start the production server**

```bash
npm start
```

## 🏗️ Project Structure

```
crypto-weather-nexus/
├── app/                      # App router routes and components
│   ├── components/           # Shared React components
│   │   ├── crypto/           # Cryptocurrency components
│   │   ├── weather/          # Weather components
│   │   ├── news/             # News components
│   │   ├── notifications/    # Notification components
│   │   ├── ui/               # Generic UI components
│   │   └── icons/            # Icon components
│   ├── lib/                  # Utility functions and services
│   │   ├── redux/            # Redux store, slices, and actions
│   │   ├── hooks/            # Custom React hooks
│   │   └── services/         # Service functions (API, WebSocket)
│   ├── weather/              # Weather routes
│   │   └── [id]/             # Dynamic city detail page
│   ├── crypto/               # Crypto routes
│   │   └── [id]/             # Dynamic crypto detail page
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Homepage/dashboard
├── public/                   # Static files
│   └── icons/                # Icon assets
├── .env.local                # Environment variables (not in repo)
└── package.json              # Project dependencies
```

## 🎯 Design Decisions

- **App Router**: Used Next.js 13+ App Router for improved routing and better SSR/SSG support
- **Redux for State Management**: Used Redux for global state management to share data between components
- **WebSocket for Real-time Updates**: Implemented WebSocket for live cryptocurrency price updates
- **Favorites System**: Implemented client-side persistence with localStorage
- **Error Handling**: Robust error handling with fallback UI for all data fetching operations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Data Refresh Strategy**: Periodic data refresh to ensure up-to-date information
- **Modular Components**: Created reusable components for better maintainability

## 🌐 Deployment

The application is deployed on Vercel at [https://crypto-weather-nexus-rho.vercel.app/](https://crypto-weather-nexus-rho.vercel.app/)

## 🚧 Challenges and Solutions

- **API Rate Limiting**: Implemented caching and fallback data to handle API rate limiting
- **WebSocket Connection Management**: Implemented reconnection logic for WebSocket to handle disconnections
- **Mobile Responsiveness**: Used Tailwind's responsive utilities to ensure good mobile experience
- **State Synchronization**: Used Redux to keep UI in sync with real-time data updates
- **SSR with Client-side Data**: Used useEffect conditionally to prevent unnecessary API calls on the server

## 📝 Future Improvements

- Add authentication system for personalized dashboards
- Implement more cryptocurrency data (e.g., volume, supply)
- Add more cities for weather tracking
- Implement server-side caching for API requests
- Add more detailed charts and analytics
- Implement theme customization
- Add a search feature for cities and cryptocurrencies

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 
