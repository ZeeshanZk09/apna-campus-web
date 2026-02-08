"use client";
import type React from "react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Define types for the theme context
interface ThemeContextType {
  isDarkMode: boolean;
  theme: "light" | "dark" | "system";
  toggleTheme: (newTheme: "light" | "dark" | "system") => void;
  systemPreference: "light" | "dark";
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">(
    "light",
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  // Get system preference
  const getSystemPreference = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((appliedTheme: "light" | "dark") => {
    const root = document.documentElement;

    if (appliedTheme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      setIsDarkMode(true);
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      setIsDarkMode(false);
    }
  }, []);

  // Calculate effective theme
  const getEffectiveTheme = useCallback(
    (themeValue: "light" | "dark" | "system"): "light" | "dark" => {
      if (themeValue === "system") {
        return getSystemPreference();
      }
      return themeValue;
    },
    [getSystemPreference],
  );

  // Initialize theme on mount
  useEffect(() => {
    setIsMounted(true);

    // Get saved theme from localStorage or default to 'system'
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark" | "system") ||
      "system";
    const currentSystemPref = getSystemPreference();

    setTheme(savedTheme);
    setSystemPreference(currentSystemPref);

    const effectiveTheme = getEffectiveTheme(savedTheme);
    applyTheme(effectiveTheme);
  }, [getSystemPreference, getEffectiveTheme, applyTheme]);

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemPref = e.matches ? "dark" : "light";
      setSystemPreference(newSystemPref);

      // Only apply if theme is set to 'system'
      if (theme === "system") {
        applyTheme(newSystemPref);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme, applyTheme]);

  // Toggle theme function
  const toggleTheme = useCallback(
    (newTheme: "light" | "dark" | "system") => {
      // Validate theme value
      if (!["light", "dark", "system"].includes(newTheme)) {
        console.error(
          `Invalid theme value: ${newTheme}. Using 'system' instead.`,
        );
        newTheme = "system";
      }

      // Save to localStorage
      try {
        localStorage.setItem("theme", newTheme);
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
      }

      // Update state
      setTheme(newTheme);

      // Apply effective theme
      const effectiveTheme = getEffectiveTheme(newTheme);
      applyTheme(effectiveTheme);
    },
    [getEffectiveTheme, applyTheme],
  );

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        theme,
        toggleTheme,
        systemPreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
