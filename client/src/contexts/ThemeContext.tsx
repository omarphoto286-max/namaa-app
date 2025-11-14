import { createContext, useContext, useEffect, useState } from "react";

type Theme = "gold" | "green" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "gold";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-gold", "theme-green", "theme-dark", "dark");
    
    if (theme === "dark") {
      root.classList.add("dark", "theme-dark");
    } else {
      root.classList.add(`theme-${theme}`);
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === "gold") return "green";
      if (prev === "green") return "dark";
      return "gold";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
