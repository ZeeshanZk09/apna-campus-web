'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/hooks/ThemeChanger';
interface BackgroundProps {
  children: ReactNode;
  videoSrc?: string;
  posterImg?: string;
}

export default function Background({ children, videoSrc = '/videos/bg1.mp4' }: BackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { theme } = useTheme();
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onLoad = () => {
      setIsLoaded(true);
    };
    const onError = () => {
      setHasError(true);
      console.error('Background video error');
    };

    vid.addEventListener('loadeddata', onLoad);
    vid.addEventListener('error', onError);

    return () => {
      vid.removeEventListener('loadeddata', onLoad);
      vid.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div className='relative w-full min-h-screen overflow-hidden'>
      {/* Video layer if loaded & no error */}
      {/* {theme !== 'light' && !hasError && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isLoaded ? 'opacity-70' : 'opacity-0'
          }`}
        />
      )} */}

      {/* Gradients overlays for readability */}
      {/* <div
        className={
          theme != 'light'
            ? 'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none'
            : ''
        }
      /> */}
      {/* <div
        className={
          theme != 'light'
            ? 'absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none'
            : ''
        }
      /> */}

      {/* Noise / texture */}
      {/* <div
        className='absolute inset-0 pointer-events-none mix-blend-overlay opacity-5'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/ %3E%3C/ filter %3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      /> */}

      {/* Vignette */}
      {/* <div
        className={
          theme != 'light'
            ? `absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.7)]`
            : ''
        }
      /> */}

      {/* Ambient particles */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {[...Array(100)].map((_, idx) => {
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = 8 + Math.random() * 8;
          return (
            <span
              key={idx}
              className={`absolute size-[${Math.random() * 2}rem] z-[${idx}] block ${
                theme === 'dark' ? 'bg-blue-600/60' : 'bg-blue-600/60'
              } rounded-full`}
              style={{
                width: 10,
                height: 10,
                left: `${left}%`,
                top: `${top}%`,
                animation: `drift ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Content */}
      <div className='relative z-10'>{children}</div>

      {/* CSS for particles */}
      <style jsx>{`
        @keyframes drift {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          50% {
            transform: translate(20px, -20px);
            opacity: 0.5;
          }
          100% {
            transform: translate(40px, -40px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
