'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f5f9ff] to-[#e6f0ff] dark:bg-[#081015]'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-4'>Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Try again
        </button>
      </div>
    </div>
  );
}
