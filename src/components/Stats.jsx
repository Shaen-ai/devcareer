import { useCountUp, RevealOnScroll } from '../hooks/useInView';
import { useLanguage } from '../hooks/useLanguage';

function StatCard({ value, label, suffix = '', icon }) {
  const [ref, count] = useCountUp(value, 2000);

  return (
    <div ref={ref} className="text-center group">
      <div className="glass rounded-2xl p-8 card-hover">
        <div className="w-12 h-12 mx-auto mb-4 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
          {count.toLocaleString()}{suffix}
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 bg-white dark:bg-brand-950 transition-colors duration-300">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300 bg-brand-100 dark:bg-brand-800/50 rounded-full mb-4 tracking-wider uppercase">
              {t('stats.badge')}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
              {t('stats.title')}
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
              {t('stats.description')}
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="glass rounded-2xl p-8 mb-12">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-brand-600 dark:text-brand-300 font-medium">{t('stats.dataCollection')}</span>
              <span className="text-gray-900 dark:text-white font-bold">{t('stats.stageOf')}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-brand-900 rounded-full overflow-hidden">
              <div className="progress-bar h-full rounded-full" style={{ width: '15%' }} />
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-400 dark:text-gray-500">
              <span>{t('stats.collecting')}</span>
              <span>{t('stats.analyzing')}</span>
              <span>{t('stats.publishing')}</span>
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid sm:grid-cols-2 gap-6">
          <RevealOnScroll delay={1}>
            <StatCard
              value={0}
              label={t('stats.submissions')}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </RevealOnScroll>
          <RevealOnScroll delay={2}>
            <StatCard
              value={0}
              suffix="+"
              label={t('stats.roles')}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
