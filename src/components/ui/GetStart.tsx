"use client";
import React from "react";
import { useTheme } from "@/hooks/ThemeChanger";

const GetStart = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="relative">
      <button className="relative h-[76px] px-[30px] bg-transparent border-none outline-none cursor-pointer group">
        {/* Outer border - before */}
        <span
          className={`pointer-events-none absolute inset-[7px] rounded-full border-[3px] ${
            !isDarkMode ? `border-black` : `border-white`
          } transition-all duration-500 group-hover:opacity-0 group-hover:scale-75`}
        />

        {/* Green hover border - after */}
        <span className="pointer-events-none absolute inset-[7px] rounded-full border-[4px] border-[#00ffea] scale-[1.3] opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100" />

        <div className="relative flex items-center gap-2 transition-transform duration-300">
          <span
            className={`text-[16px] font-semibold ${
              isDarkMode ? `text-white` : `text-black`
            }  z-10`}
          >
            Browse Courses
          </span>

          <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-6 h-6 flex items-center justify-center rotate-180">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full group-hover:translate-x-[2px] transition-transform duration-300"
            >
              <path
                fill={isDarkMode ? `white` : `black`}
                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              />
            </svg>
          </span>
        </div>
      </button>
    </div>
  );
};

export default GetStart;
