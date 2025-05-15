"use client";
import { useTheme } from "@/hooks/ThemeChanger";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Background = () => {
  const { isDarkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [documentHeight, setDocumentHeight] = useState(0);

  // Calculate document height
  const calculateDocumentHeight = () => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
  };

  // Effect for setting up observers and calculating document height
  useEffect(() => {
    // Initial height calculation
    setDocumentHeight(calculateDocumentHeight());

    // MutationObserver to detect DOM changes that might affect height
    const observer = new MutationObserver(() => {
      setDocumentHeight(calculateDocumentHeight());
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    // Resize observer for window resizing
    const resizeObserver = new ResizeObserver(() => {
      setDocumentHeight(calculateDocumentHeight());
    });

    resizeObserver.observe(document.body);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  // Effect for canvas animation
  useEffect(() => {
    if (!canvasRef.current || documentHeight === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = documentHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background based on theme
    if (isDarkMode) {
      ctx.fillStyle = "#020207";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Meteor particles
    const meteors: {
      x: number;
      y: number;
      length: number;
      speed: number;
      size: number;
      delay: number;
      alpha: number;
      color: string;
    }[] = [];
    const meteorCount = Math.min(40, Math.floor(window.innerWidth / 30));

    // Initialize meteors with different colors based on theme
    for (let i = 0; i < meteorCount; i++) {
      meteors.push({
        x: Math.random() * canvas.width * 1.2,
        y: Math.random() * canvas.height,
        length: Math.random() * 30 + 20,
        speed: Math.random() * 2 + 1.5,
        size: Math.random() * 0.8 + 0.3,
        delay: Math.random() * 50,
        alpha: Math.random() * 0.7 + 0.3,
        color: isDarkMode
          ? `rgba(150, 220, 255, ${Math.random() * 0.7 + 0.3})`
          : `rgba(70, 130, 255, ${Math.random() * 0.7 + 0.3})`, // Blue color for light theme
      });
    }

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time++;

      // Only clear with dark background in dark mode
      if (isDarkMode) {
        ctx.fillStyle = "rgba(8, 8, 12, 0.15)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Light mode - just clear the meteors
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Draw stars only in dark mode
      if (isDarkMode && time % 100 === 0) {
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            1,
            1
          );
        }
      }

      // Update and draw meteors
      meteors.forEach((meteor) => {
        if (time < meteor.delay) return;

        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x - meteor.length * 0.6,
          meteor.y + meteor.length
        );

        if (isDarkMode) {
          gradient.addColorStop(0, meteor.color);
          gradient.addColorStop(
            0.3,
            meteor.color.replace(
              /[\d\.]+\)$/,
              parseFloat(meteor.color.split(",")[3]) * 0.7 + ")"
            )
          );
        } else {
          // Light mode gradient - blue shades
          gradient.addColorStop(0, meteor.color);
          gradient.addColorStop(
            0.3,
            meteor.color.replace(
              /[\d\.]+\)$/,
              parseFloat(meteor.color.split(",")[3]) * 0.7 + ")"
            )
          );
        }
        gradient.addColorStop(1, "transparent");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = meteor.size;
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.length * 0.6, meteor.y + meteor.length);
        ctx.stroke();

        meteor.y += meteor.speed;
        meteor.x -= meteor.speed * 0.6;

        // Reset meteor when it goes off screen
        if (
          meteor.y > canvas.height + meteor.length ||
          meteor.x < -meteor.length
        ) {
          meteor.y = Math.random() * -100;
          meteor.x = Math.random() * canvas.width * 1.1;
          meteor.length = Math.random() * 30 + 20;
          meteor.delay = time + Math.random() * 30 + 10;
          meteor.alpha = Math.random() * 0.7 + 0.3;
          meteor.color = isDarkMode
            ? `rgba(150, 220, 255, ${meteor.alpha})`
            : `rgba(70, 130, 255, ${meteor.alpha})`;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = documentHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDarkMode, documentHeight]);

  return (
    <>
      {!isDarkMode && (
        <div className="absolute w-screen min-h-screen h-full bg-[#126ea724] -z-50" />
      )}
      <StyledWrapper $isDarkMode={isDarkMode}>
        <canvas ref={canvasRef} />
      </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div<{ $isDarkMode: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  background: ${({ $isDarkMode }) =>
    $isDarkMode
      ? "linear-gradient(to bottom, #020207, #0a0a15)"
      : ""}; /* Lighter blue gradient */

  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export default React.memo(Background);
