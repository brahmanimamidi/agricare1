import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import translations from '@/i18n/translations';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('agricare-lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    localStorage.setItem('agricare-lang', lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
