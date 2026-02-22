import { RevealOnScroll } from '../hooks/useInView';
import { useLanguage } from '../hooks/useLanguage';

export default function HowItWorks() {
  const { t } = useLanguage();

  const STEPS = [
    {
      num: '01',
      title: t('howItWorks.step1Title'),
      desc: t('howItWorks.step1Desc'),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-blue-500 to-brand-600',
    },
    {
      num: '02',
      title: t('howItWorks.step2Title'),
      desc: t('howItWorks.step2Desc'),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: 'from-brand-500 to-purple-600',
    },
    {
      num: '03',
      title: t('howItWorks.step3Title'),
      desc: t('howItWorks.step3Desc'),
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-gray-50 dark:bg-brand-900 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-gray-50 to-white dark:from-brand-900/50 dark:via-brand-900 dark:to-brand-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-brand-500/50 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300 bg-brand-100 dark:bg-brand-800/50 rounded-full mb-4 tracking-wider uppercase">
              {t('howItWorks.badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white">
              {t('howItWorks.title')}
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
              {t('howItWorks.description')}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <RevealOnScroll key={step.num} delay={i + 1} className="h-full">
              <div className="line-connector group relative h-full">
                <div className="glass rounded-2xl p-8 card-hover h-full flex flex-col">
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    {step.icon}
                  </div>

                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-widest">
                    {t('howItWorks.step')} {step.num}
                  </span>

                  <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors duration-300">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow">
                    {step.desc}
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/0 to-transparent rounded-b-2xl group-hover:via-brand-500/50 transition-all duration-500" />
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
