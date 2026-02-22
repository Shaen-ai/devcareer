import { useState } from 'react';
import { RevealOnScroll } from '../hooks/useInView';
import { useLanguage } from '../hooks/useLanguage';

function Item({ q, a, linkText, index }) {
  const [open, setOpen] = useState(false);

  const renderAnswer = () => {
    if (linkText) {
      const idx = a.indexOf(linkText);
      if (idx !== -1) {
        return (
          <>
            {a.substring(0, idx)}
            <a href="mailto:devcareeram@gmail.com" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-medium transition-colors">
              {linkText}
            </a>
            {a.substring(idx + linkText.length)}
          </>
        );
      }
    }
    return a;
  };

  return (
    <RevealOnScroll delay={Math.min(index + 1, 4)}>
      <div className="glass rounded-2xl mb-4 overflow-hidden card-hover">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between p-6 text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl"
          aria-expanded={open}
        >
          <span className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{q}</span>
          <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${open ? 'bg-brand-500 rotate-180' : 'bg-brand-100 dark:bg-brand-800/50'}`}>
            <svg
              className={`w-4 h-4 ${open ? 'text-white' : 'text-brand-600 dark:text-white'}`}
              fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${open ? 'max-h-96' : 'max-h-0'}`}
          role="region"
        >
          <p className="px-6 pb-6 text-gray-500 dark:text-gray-400 leading-relaxed">{renderAnswer()}</p>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export default function FAQ() {
  const { t } = useLanguage();

  const ITEMS = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6'), linkText: t('faq.a6Link') },
  ];

  return (
    <section id="faq" className="relative py-24 bg-gray-50 dark:bg-brand-900 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-brand-950 via-gray-50 dark:via-brand-900 to-gray-50 dark:to-brand-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-brand-500/50 to-transparent" />

      <div className="relative max-w-2xl mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300 bg-brand-100 dark:bg-brand-800/50 rounded-full mb-4 tracking-wider uppercase">
              {t('faq.badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white">
              {t('faq.title')}
            </h2>
          </div>
        </RevealOnScroll>

        <div>
          {ITEMS.map((item, i) => (
            <Item key={i} index={i} {...item} />
          ))}
        </div>

        <RevealOnScroll>
          <div className="mt-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t('faq.moreQuestions')}{' '}
              <a href="mailto:devcareeram@gmail.com" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-medium transition-colors">
                {t('faq.getInTouch')}
              </a>
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
