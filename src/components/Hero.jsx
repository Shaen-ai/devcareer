import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

function Particle({ size, x, y, delay, duration }) {
  return (
    <div
      className="particle bg-brand-400/20 dark:bg-brand-400/20"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

const PARTICLES = [
  { size: 6, x: 10, y: 20, delay: 0, duration: 6 },
  { size: 4, x: 20, y: 60, delay: 1, duration: 8 },
  { size: 8, x: 80, y: 15, delay: 0.5, duration: 7 },
  { size: 5, x: 70, y: 70, delay: 2, duration: 9 },
  { size: 3, x: 40, y: 30, delay: 1.5, duration: 6 },
  { size: 6, x: 90, y: 50, delay: 0.8, duration: 8 },
  { size: 4, x: 50, y: 80, delay: 2.5, duration: 7 },
  { size: 7, x: 30, y: 10, delay: 0.3, duration: 10 },
  { size: 3, x: 60, y: 45, delay: 1.8, duration: 6 },
  { size: 5, x: 15, y: 85, delay: 3, duration: 9 },
];

function AnimatedCounter({ end, suffix = '' }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.max(1, Math.round(eased * end)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl animate-glow" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/80 dark:to-brand-950/80" />

      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-brand-700 dark:text-brand-200">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse-soft" />
            {t('hero.badge')}
          </div>
        </div>

        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-gray-900 dark:text-white transition-all duration-1000 delay-150 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {t('hero.title1')}
          <br />
          <span className="gradient-text">{t('hero.title2')}</span>
        </h1>

        <p className={`mt-8 text-lg sm:text-xl text-gray-600 dark:text-brand-200/80 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {t('hero.description')}
        </p>

        <div className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a
            href="#submit"
            className="group relative inline-flex items-center gap-3 bg-brand-600 dark:bg-white text-white dark:text-brand-900 font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-500/30 dark:focus:ring-white/30"
          >
            {t('hero.cta')}
            <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-gray-700 dark:text-brand-200 hover:text-gray-900 dark:hover:text-white font-medium px-6 py-4 rounded-2xl glass hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300"
          >
            {t('hero.learnMore')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className={`mt-16 flex items-center justify-center gap-8 sm:gap-12 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              <AnimatedCounter end={30} />
              <span className="text-brand-500 dark:text-brand-400"> {t('hero.sec')}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-brand-300 mt-1">{t('hero.toSubmit')}</p>
          </div>
          <div className="w-px h-10 bg-gray-300 dark:bg-brand-700" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              <AnimatedCounter end={100} /><span className="text-brand-500 dark:text-brand-400">%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-brand-300 mt-1">{t('hero.anonymous')}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <svg className="w-6 h-6 text-brand-500 dark:text-brand-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
