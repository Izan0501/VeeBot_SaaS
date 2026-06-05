import React, { use, createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => use(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Read theme from localStorage
  /* eslint-disable react-doctor/no-initialize-state */
    const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return /* eslint-disable-next-line react-doctor/js-cache-storage */ localStorage.getItem('theme') === 'dark' || 
        (!/* eslint-disable-next-line react-doctor/js-cache-storage */ localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider /* eslint-disable-next-line react-doctor/jsx-no-constructed-context-values */ value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};