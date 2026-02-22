import { useLanguage } from '../hooks/useLanguage';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer id="privacy" className="relative bg-white dark:bg-brand-950 border-t border-gray-200 dark:border-brand-800/30 transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-sm">
                DC
              </div>
              <span className="text-gray-900 dark:text-white font-bold text-xl">
                DevCareer<span className="text-brand-500 dark:text-brand-400">.am</span>
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href="#submit"
                className="px-5 py-2.5 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-400 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25"
              >
                {t('footer.submitSalary')}
              </a>
              <a
                href="#how-it-works"
                className="px-5 py-2.5 text-sm font-medium glass text-gray-600 dark:text-gray-300 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
              >
                {t('footer.learnMore')}
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-5">
              <h3 className="text-gray-900 dark:text-white font-bold mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t('footer.privacy')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {t('footer.privacyText')}
              </p>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="text-gray-900 dark:text-white font-bold mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('footer.terms')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                {t('footer.termsText')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-brand-800/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-gray-400 dark:text-gray-500">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            <div className="flex gap-8">
              <a href="#privacy" className="text-gray-400 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200">{t('footer.privacy')}</a>
              <a href="#faq" className="text-gray-400 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200">{t('footer.faq')}</a>
              <a href="#submit" className="text-gray-400 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200">{t('footer.submit')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
