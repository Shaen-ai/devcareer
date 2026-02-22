import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import en from '../i18n/en';
import hy from '../i18n/hy';
import ru from '../i18n/ru';

const TRANSLATIONS = { en, hy, ru };
const SUPPORTED_LANGS = ['en', 'hy', 'ru'];
const DEFAULT_LANG = 'hy';

const LanguageContext = createContext();

function getInitialLang() {
  const stored = localStorage.getItem('lang');
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  return DEFAULT_LANG;
}

function get(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const changeLang = useCallback((code) => {
    if (SUPPORTED_LANGS.includes(code)) {
      setLang(code);
      localStorage.setItem('lang', code);
      document.documentElement.lang = code;
    }
  }, []);

  const t = useCallback(
    (key, params) => {
      let text = get(TRANSLATIONS[lang], key) ?? get(TRANSLATIONS[DEFAULT_LANG], key) ?? key;
      if (params && typeof text === 'string') {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        });
      }
      return text;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, changeLang, t }), [lang, changeLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
