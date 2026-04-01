import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Theme, UserRole, User } from './types';
import { MOCK_USER } from './constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  selectedDatasetId: string | null;
  setSelectedDatasetId: (id: string | null) => void;
  user: User;
  setUserRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('citipedia_lang');
    return (saved as Language) || 'en';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('citipedia_theme');
    return (saved as Theme) || 'dark';
  });

  const [activePage, setActivePage] = useState('home');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);
  const [user, setUser] = useState<User>(MOCK_USER);

  const setUserRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, userRole: role }));
  };

  useEffect(() => {
    localStorage.setItem('citipedia_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('citipedia_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        activePage,
        setActivePage,
        selectedDatasetId,
        setSelectedDatasetId,
        user,
        setUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
