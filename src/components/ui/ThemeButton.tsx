"use client";

import { useTheme } from "@/hooks/ThemeChanger";
import Image from "next/image";

export default function ThemeButton({ className }: { className?: string }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const Moon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4 text-gray-900"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 118.646 3.646a7 7 0 1011.708 11.708z"
        />
      </svg>
    );
  };

  return (
    <button
      onClick={toggleTheme}
      suppressHydrationWarning
      className={`${className} z-50 sticky bottom-10 left-20 w-8 p-2 h-8 bg-slate-400 text-white font-semibold rounded-full shadow-inner  transition-all delay-200 duration-300 outline-none`}
    >
      {isDarkMode ? (
        <Image src={`/images/sun.svg`} alt="sun" width={1000} height={1000} />
      ) : (
        <Moon />
      )}
    </button>
  );
}
