'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/ThemeChanger'; // aapka hook
import { Sun, Moon, Monitor } from 'lucide-react'; // ya koi icon library

type ThemeState = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  // assume your hook provides `theme` (one of 'light'|'dark'|'system') and `setTheme`
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} style={{ width: 120, height: 36 }} />;
  }

  const options: { id: ThemeState; icon: React.ReactNode; label: string }[] = [
    { id: 'light', icon: <Sun size={16} />, label: 'Light' },
    { id: 'system', icon: <Monitor size={16} />, label: 'System' },
    { id: 'dark', icon: <Moon size={16} />, label: 'Dark' },
  ];

  return (
    <div
      className={`${className} inline-flex items-center rounded-lg ${
        isDarkMode
          ? 'bg-white/6 backdrop-blur border border-white/8'
          : 'bg-black/6 backdrop-blur border border-black/8'
      } p-1 space-x-1`}
    >
      {options.map((opt) => {
        const active = theme === opt.id;
        console.log('theme in themebutton', opt);
        return (
          <button
            key={opt.id}
            onClick={() => toggleTheme(opt.id)}
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all
              ${
                active
                  ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-300 shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-600'
              }
            `}
            aria-label={`Switch to ${opt.label} mode`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
