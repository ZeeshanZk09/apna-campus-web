// src/components/ToastProvider.tsx
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position='top-center'
      toastOptions={{
        duration: 2000,
        style: {
          fontSize: '16px',
          padding: '12px 16px',
        },
      }}
    />
  );
}
