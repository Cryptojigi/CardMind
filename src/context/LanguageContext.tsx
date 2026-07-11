import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import en from '../locales/en';
import zh from '../locales/zh';
import ja from '../locales/ja';

export type Language = 'en' | 'ja' | 'zh-CN';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<string, any> = { 
  en, 
  zh, // Keep this mapping for backwards compatibility if needed
  'zh-CN': zh,
  ja
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('cardmind_lang') as Language;
    if (savedLang && ['en', 'ja', 'zh-CN'].includes(savedLang)) {
      setLanguageState(savedLang);
    } else if (savedLang === 'zh' as any) {
      setLanguageState('zh-CN');
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('cardmind_lang', newLang);
  };

  const t = (keyString: string) => {
    const keys = keyString.split('.');
    let current = translations[language] || translations['en'];
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
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
