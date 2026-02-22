import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-xl bg-brand-800/50 dark:bg-brand-800/50 bg-gray-200 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-brand-700/50 transition-colors duration-300"
      aria-label={t(theme === 'dark' ? 'nav.switchToLight' : 'nav.switchToDark')}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-brand-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const NAV_LINKS = [
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.faq'), href: '#faq' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-scrolled py-3' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform duration-300">
            DC
          </div>
          <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight hidden sm:block">
            DevCareer<span className="text-brand-500 dark:text-brand-400">.am</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 dark:bg-brand-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href="#submit"
            className="px-5 py-2.5 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-400 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25"
          >
            {t('nav.submitSalary')}
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-gray-900 dark:text-white p-2"
            aria-label={t('nav.toggleMenu')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden mt-2 mx-6 rounded-2xl glass p-4 animate-scale-in">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-4 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#submit"
            onClick={() => setMobileOpen(false)}
            className="block mt-2 py-3 px-4 text-center font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-400 transition-colors"
          >
            {t('nav.submitSalary')}
          </a>
        </div>
      )}
    </nav>
  );
}
