'use client';

import { ReduxProvider } from './lib/redux/provider';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {children}
      <Toaster position="top-right" closeButton richColors />
    </ReduxProvider>
  );
} 