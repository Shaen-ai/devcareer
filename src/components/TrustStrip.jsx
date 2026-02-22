import { RevealOnScroll } from '../hooks/useInView';
import { useLanguage } from '../hooks/useLanguage';

export default function TrustStrip() {
  const { t } = useLanguage();

  const TRUST_ITEMS = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: t('trust.noName'),
      desc: t('trust.noNameDesc'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t('trust.noEmail'),
      desc: t('trust.noEmailDesc'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: t('trust.aggregated'),
      desc: t('trust.aggregatedDesc'),
    },
  ];

  return (
    <section className="relative py-20 bg-white dark:bg-brand-950 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-brand-950 dark:via-brand-950 dark:to-brand-900/50" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="grid sm:grid-cols-3 gap-6">
          {TRUST_ITEMS.map((item, i) => (
            <RevealOnScroll key={i} delay={i + 1}>
              <div className="group glass rounded-2xl p-6 card-hover cursor-default">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">{item.title}</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={4}>
          <div className="mt-10 flex flex-wrap gap-6 justify-center text-sm">
            <a
              href="#privacy"
              className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors duration-200 flex items-center gap-1 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t('trust.privacyDetails')}
            </a>
            <a
              href="#how-it-works"
              className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors duration-200 flex items-center gap-1 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('trust.howItWorks')}
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
