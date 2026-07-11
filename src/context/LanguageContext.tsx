import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import en from '../locales/en';
import zh from '../locales/zh';

type Language = 'en' | 'zh';

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, any> = { en, zh };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('cardmind_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    localStorage.setItem('cardmind_lang', newLang);
  };

  const t = (keyString: string) => {
    const keys = keyString.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to english
        let fallback = translations['en'];
        for (const fKey of keys) {
          if (fallback[fKey] === undefined) return keyString;
          fallback = fallback[fKey];
        }
        return fallback as unknown as string;
      }
      current = current[key];
    }
    return current as unknown as string;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
