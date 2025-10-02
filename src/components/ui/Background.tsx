'use client';
import { useTheme } from '@/hooks/ThemeChanger';
import { HydrationFix } from '@/utils/HydrationFix';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';

interface BackgroundProps {
  children: React.ReactNode;
}

const Background = ({ children }: BackgroundProps) => {
  const { isDarkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const calculateDocumentHeight = useCallback(() => {
    if (typeof document === 'undefined') return 0;
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setDocumentHeight(calculateDocumentHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateDocumentHeight]);

  useEffect(() => {
    setDocumentHeight(calculateDocumentHeight());

    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(() => {
        setDocumentHeight(calculateDocumentHeight());
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      const resizeObserver = new ResizeObserver(() => {
        setDocumentHeight(calculateDocumentHeight());
      });

      resizeObserver.observe(document.body);

      return () => {
        observer.disconnect();
        resizeObserver.disconnect();
      };
    }
  }, [calculateDocumentHeight]);

  useEffect(() => {
    if (!canvasRef.current || documentHeight === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = windowSize.width * dpr;
    canvas.height = documentHeight * dpr;
    canvas.style.width = `${windowSize.width}px`;
    canvas.style.height = `${documentHeight}px`;
    ctx.scale(dpr, dpr);

    // Enhanced snowflakes
    const snowflakes: {
      x: number;
      y: number;
      size: number;
      speed: number;
      drift: number;
      opacity: number;
      wobble: number;
      wobbleSpeed: number;
      initialY: number;
    }[] = [];

    const snowCount = Math.min(40, Math.floor(windowSize.width / 45));

    for (let i = 0; i < snowCount; i++) {
      const initialY = (Math.random() * canvas.height) / dpr;
      snowflakes.push({
        x: Math.random() * windowSize.width,
        y: initialY,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.4 + 0.15,
        drift: Math.random() * 0.3 - 0.15,
        opacity: Math.random() * 0.5 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        initialY: initialY,
      });
    }

    // Optimized meteors
    const meteors: {
      x: number;
      y: number;
      length: number;
      speed: number;
      size: number;
      active: boolean;
      alpha: number;
      trailColor: string;
      headColor: string;
      particles: Array<{ x: number; y: number; life: number; size: number }>;
    }[] = [];

    let nextMeteorTime = Math.random() * 200 + 120;
    let time = 0;

    const createMeteor = () => {
      const startX = windowSize.width + Math.random() * 100;
      const startY = Math.random() * (windowSize.height * 0.3);

      meteors.push({
        x: startX,
        y: startY,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 3 + 4,
        size: Math.random() * 2.2 + 1.5,
        active: true,
        alpha: Math.random() * 0.2 + 0.8,
        trailColor: isDarkMode
          ? `rgba(255, 220, 150, ${Math.random() * 0.2 + 0.7})`
          : `rgba(80, 140, 255, ${Math.random() * 0.3 + 0.6})`,
        headColor: isDarkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
        particles: [],
      });
    };

    const drawBackground = () => {
      if (isDarkMode) {
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height / dpr);
        bgGradient.addColorStop(0, '#020207');
        bgGradient.addColorStop(0.5, '#0a0a15');
        bgGradient.addColorStop(1, '#050510');
        ctx.fillStyle = bgGradient;
      } else {
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height / dpr);
        bgGradient.addColorStop(0, '#e6f0ff');
        bgGradient.addColorStop(0.5, '#d5e5ff');
        bgGradient.addColorStop(1, '#cfe2ff');
        ctx.fillStyle = bgGradient;
      }
      ctx.fillRect(0, 0, windowSize.width, canvas.height / dpr);
    };

    drawBackground();

    const animate = () => {
      time++;

      // Fade effect instead of full clear
      ctx.fillStyle = isDarkMode ? 'rgba(2, 2, 7, 0.12)' : 'rgba(230, 240, 255, 0.1)';
      ctx.fillRect(0, 0, windowSize.width, canvas.height / dpr);

      // Twinkling stars (dark mode only)
      if (isDarkMode && time % 90 === 0) {
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * windowSize.width;
          const y = Math.random() * (canvas.height / dpr);
          const brightness = Math.random() * 0.3 + 0.1;
          const size = Math.random() > 0.6 ? 2 : 1;

          ctx.shadowBlur = 3;
          ctx.shadowColor = `rgba(255, 255, 255, ${brightness})`;
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
          ctx.fillRect(x, y, size, size);
          ctx.shadowBlur = 0;
        }
      }

      // Draw and update snowflakes with improved rendering
      snowflakes.forEach((flake) => {
        ctx.save();
        ctx.globalAlpha = flake.opacity * (0.7 + Math.sin(time * 0.02 + flake.wobble) * 0.3);

        // Snowflake with better glow
        const gradient = ctx.createRadialGradient(
          flake.x,
          flake.y,
          0,
          flake.x,
          flake.y,
          flake.size * 3
        );

        if (isDarkMode) {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(230, 240, 255, 0.9)');
          gradient.addColorStop(0.5, 'rgba(200, 220, 255, 0.4)');
          gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Enhanced physics
        flake.wobble += flake.wobbleSpeed;
        flake.y += flake.speed;
        flake.x += flake.drift + Math.sin(flake.wobble) * 0.5;

        // Wrap around screen
        if (flake.y > canvas.height / dpr + 20) {
          flake.y = -20;
          flake.x = Math.random() * windowSize.width;
          flake.opacity = Math.random() * 0.5 + 0.2;
        }
        if (flake.x > windowSize.width + 20) flake.x = -20;
        if (flake.x < -20) flake.x = windowSize.width + 20;
      });

      // Create meteors at intervals
      if (time >= nextMeteorTime) {
        createMeteor();
        nextMeteorTime = time + Math.random() * 200 + 120;
      }

      // Draw and update meteors with particle trails
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        if (!meteor.active) continue;

        ctx.save();

        // Add sparkle particles
        if (time % 2 === 0) {
          meteor.particles.push({
            x: meteor.x,
            y: meteor.y,
            life: 1,
            size: Math.random() * 1.5 + 0.5,
          });
        }

        // Draw particles
        meteor.particles.forEach((particle, pIndex) => {
          if (particle.life <= 0) {
            meteor.particles.splice(pIndex, 1);
            return;
          }

          ctx.globalAlpha = particle.life;
          const pGradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 2
          );
          pGradient.addColorStop(0, meteor.headColor);
          pGradient.addColorStop(1, 'transparent');

          ctx.fillStyle = pGradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          particle.life -= 0.02;
        });

        // Main meteor trail with tapered shape (thick head to thin tail)
        const tailX = meteor.x - meteor.length * 1.4;
        const tailY = meteor.y + meteor.length * 1;

        // Draw multiple layers for tapered effect
        const segments = 15;
        for (let seg = 0; seg < segments; seg++) {
          const progress = seg / segments;
          const nextProgress = (seg + 1) / segments;

          const currentX = meteor.x - meteor.length * 1.4 * progress;
          const currentY = meteor.y + meteor.length * 1 * progress;
          const nextX = meteor.x - meteor.length * 1.4 * nextProgress;
          const nextY = meteor.y + meteor.length * 1 * nextProgress;

          // Thickness tapers from head (thick) to tail (thin)
          const thickness = meteor.size * (1 - progress * 0.85);

          // Color fades from bright to transparent
          let alpha = meteor.alpha * (1 - progress * 0.7);
          const segmentGradient = ctx.createLinearGradient(currentX, currentY, nextX, nextY);

          if (progress < 0.1) {
            segmentGradient.addColorStop(0, meteor.headColor);
            segmentGradient.addColorStop(1, meteor.trailColor);
          } else {
            const startAlpha = alpha;
            const endAlpha = alpha * 0.7;
            segmentGradient.addColorStop(
              0,
              meteor.trailColor.replace(/[\d\.]+\)$/, `${startAlpha})`)
            );
            segmentGradient.addColorStop(
              1,
              meteor.trailColor.replace(/[\d\.]+\)$/, `${endAlpha})`)
            );
          }

          ctx.strokeStyle = segmentGradient;
          ctx.lineWidth = Math.max(thickness, 0.3);
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }

        // Enhanced head glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = meteor.headColor;

        const glowGradient = ctx.createRadialGradient(
          meteor.x,
          meteor.y,
          0,
          meteor.x,
          meteor.y,
          meteor.size * 4
        );
        glowGradient.addColorStop(0, meteor.headColor);
        glowGradient.addColorStop(0.3, meteor.trailColor);
        glowGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.restore();

        // Update position
        meteor.x -= meteor.speed * 1.4;
        meteor.y += meteor.speed * 1;

        // Remove when off screen
        if (meteor.x < -meteor.length * 3 || meteor.y > canvas.height / dpr + meteor.length * 2) {
          meteors.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDarkMode, documentHeight, windowSize]);

  return (
    <StyledWrapper $isDarkMode={isDarkMode} suppressHydrationWarning>
      <canvas ref={canvasRef} />
      <HydrationFix>
        <ContentContainer>
          <>{children}</>
        </ContentContainer>
      </HydrationFix>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $isDarkMode: boolean }>`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: ${({ $isDarkMode }) =>
    $isDarkMode
      ? 'linear-gradient(to bottom, #020207, #0a0a15)'
      : 'linear-gradient(to bottom, #e6f0ff, #cfe2ff)'};

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100vh;
`;

export default React.memo(Background);
