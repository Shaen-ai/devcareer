import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hy', label: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-brand-800/50 dark:bg-brand-800/50 bg-gray-200 hover:bg-gray-300 dark:hover:bg-brand-700/50 transition-colors duration-300 text-sm"
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <svg
          className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 dark:border-brand-700/50 bg-white dark:bg-brand-900 shadow-xl shadow-black/10 dark:shadow-black/30 py-1 z-50 animate-scale-in">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { changeLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors duration-100 ${
                l.code === lang
                  ? 'bg-brand-50 dark:bg-brand-800/40 text-brand-600 dark:text-brand-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-brand-800/30'
              }`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              {l.label}
              {l.code === lang && (
                <svg className="w-4 h-4 ml-auto text-brand-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
