import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { spaceGrotesk, inter } from './lib/fonts';

export const metadata: Metadata = {
  title: 'CryptoWeather Nexus',
  description: 'Your all-in-one dashboard for cryptocurrency and weather information',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 