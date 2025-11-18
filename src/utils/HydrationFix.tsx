'use client';

import { useEffect, useState } from 'react';

interface HydrationFixProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

/**
 * Highly optimized hydration fix component to prevent server-client mismatch
 * Uses multiple optimization techniques for better performance
 */
export function HydrationFix({ children, fallback = null, delay = 0 }: HydrationFixProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Use requestIdleCallback or setTimeout for non-blocking hydration
    const hydrate = () => setIsHydrated(true);

    if (delay > 0) {
      // Optional delay for better perceived performance
      const timer = setTimeout(hydrate, delay);
      return () => clearTimeout(timer);
    } else if (typeof requestIdleCallback !== 'undefined') {
      // Use idle callback if available for non-blocking execution
      const id = requestIdleCallback(hydrate);
      return () => cancelIdleCallback(id);
    } else {
      // Fallback to microtask for immediate but non-blocking execution
      Promise.resolve().then(hydrate);
    }
  }, [delay]);

  // Prevent server-client mismatch for initial render
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Alternative: Even more optimized version with SSR detection
export function OptimizedHydrationFix({ children, fallback = null }: HydrationFixProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Minimal effect - just set the state
    setIsClient(true);
  }, []);

  // Return children immediately if we're confident it's client-side
  // This avoids unnecessary re-renders for components that don't need hydration protection
  if (typeof window !== 'undefined' && isClient) {
    return <>{children}</>;
  }

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Ultra-minimal version for maximum performance
export default function MinimalHydrationFix({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}

// Custom hook version for granular control
export function useHydrationFix(delay = 0) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsHydrated(true), delay);
      return () => clearTimeout(timer);
    } else {
      setIsHydrated(true);
    }
  }, [delay]);

  return isHydrated;
}

// Usage example with the hook:
// function MyComponent() {
//   const isHydrated = useHydrationFix();
//   if (!isHydrated) return <Loader />;
//   return <div>Your content</div>;
// }
