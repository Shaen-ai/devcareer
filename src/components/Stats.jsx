import { RevealOnScroll } from '../hooks/useInView';
import { useLanguage } from '../hooks/useLanguage';

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
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white">
              {t('stats.title')}
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
              {t('stats.description')}
            </p>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
