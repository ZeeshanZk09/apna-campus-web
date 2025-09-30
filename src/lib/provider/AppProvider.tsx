// lib/redux/provider.tsx
'use client';

import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { makeStore, AppStore } from '@/lib/redux/store';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | undefined>(null);
  if (!storeRef.current) storeRef.current = makeStore();

  // Optional: tell react-query to use navigator.onLine (it does by default), but we ensure it's configured
  if (typeof window !== 'undefined') {
    // keep react-query aware of connectivity changes
    onlineManager.setEventListener((setOnline) => {
      const onOnline = () => setOnline(true);
      const onOffline = () => setOnline(false);
      window.addEventListener('online', onOnline);
      window.addEventListener('offline', onOffline);
      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
      };
    });
  }

  // QueryClient options tuned for an offline-first, resilient app:
  const queryClientRef = useRef<QueryClient>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 3,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          refetchIntervalInBackground: false,
          // cacheTime: 1000 * 60 * 60 * 24, // keep cache for 24 hours
          staleTime: 1000 * 60 * 2, // consider fresh for 2 minutes
          networkMode: 'online', // will queue when offline
        },
        mutations: {
          retry: 2,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
      },
    });
  }

  return (
    <Provider store={storeRef.current!}>
      <QueryClientProvider client={queryClientRef.current!}>{children}</QueryClientProvider>
    </Provider>
  );
}
