import { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../context/LanguageContext';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'ja', label: '日本語' }
];

export default function LanguageDropdown() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center font-bold text-[#F8F6F0] px-3 py-1.5 rounded transition-colors"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <span className="text-xs">{language.toUpperCase().substring(0, 2)}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 py-2 w-40 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2"
          style={{
            background: '#1A1A1A',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${isSelected ? 'text-white bg-white/5' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
              >
                <div className="w-6 flex justify-center">
                  {isSelected && <span className="text-[#F8F6F0]">✓</span>}
                </div>
                {lang.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
