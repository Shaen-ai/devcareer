import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { RevealOnScroll } from '../hooks/useInView';
import { useLanguage } from '../hooks/useLanguage';
import { generateUUID } from '../utils/uuid';
import {
  LEVELS, CURRENCIES, PERIODS, NET_GROSS,
  DEFAULT_ROLES, DEFAULT_COMPANIES,
  getTagsForRole, validateForm,
} from '../utils/validation';
import {
  submitSalary, getCooldownRemaining, setCooldownTimestamp,
  fetchCompanies, fetchRoles, createOrUpdateCompany, createOrUpdateRole,
} from '../utils/submission';

const INITIAL = {
  role: '', customRole: '', level: '', experienceYears: '', salaryAmount: '',
  currency: 'AMD', period: 'Monthly', netOrGross: 'Net',
  companyName: '', customCompany: '', techTags: [],
};

function Select({ label, id, value, onChange, options, error, required, selectText }) {
  const normalized = options.map((o) => (typeof o === 'object' && o !== null && 'value' in o && 'label' in o ? o : { value: o, label: o }));
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-brand-500 dark:text-brand-400">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-brand-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 ${
          error ? 'border-red-400 ring-1 ring-red-400/30' : 'border-gray-300 dark:border-brand-700/50 hover:border-brand-400 dark:hover:border-brand-500/50'
        }`}
      >
        <option value="">{selectText}</option>
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">{error}</p>}
    </div>
  );
}

function Input({ label, id, type = 'text', value, onChange, error, required, placeholder, min, max }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-brand-500 dark:text-brand-400">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full rounded-xl border px-4 py-3 text-sm bg-white dark:bg-brand-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 ${
          error ? 'border-red-400 ring-1 ring-red-400/30' : 'border-gray-300 dark:border-brand-700/50 hover:border-brand-400 dark:hover:border-brand-500/50'
        }`}
      />
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">{error}</p>}
    </div>
  );
}

function TagSelector({ tags, selected, onToggle }) {
  const { t } = useLanguage();
  if (!tags || tags.length === 0) return null;

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('form.techTags')}</span>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{t('form.techTagsHelp')}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Technology tags">
        {tags.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              aria-pressed={active}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${
                active
                  ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/25'
                  : 'bg-gray-100 dark:bg-brand-900/30 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-brand-700/50 hover:border-brand-400 dark:hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-300'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="mt-2 text-xs text-brand-600 dark:text-brand-400">{t('form.selected', { count: selected.length })}</p>
      )}
    </div>
  );
}

function CompanyCombobox({ value, onChange, customValue, onCustomChange, label, error, required, companies }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const options = useMemo(() => {
    const list = companies || [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? list.filter((c) => c.toLowerCase().includes(q))
      : list;
    return [...filtered, 'Other'];
  }, [query, companies]);

  useEffect(() => {
    setHighlightIdx(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const el = listRef.current.children[highlightIdx];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIdx]);

  const select = (val) => {
    onChange(val);
    setQuery('');
    setOpen(false);
    if (val !== 'Other') onCustomChange('');
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightIdx((i) => (i < options.length - 1 ? i + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightIdx((i) => (i > 0 ? i - 1 : options.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < options.length) {
          select(options[highlightIdx]);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  const clear = () => {
    onChange('');
    onCustomChange('');
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-brand-500 dark:text-brand-400">*</span>}
      </label>
      <div ref={wrapperRef} className="relative">
        {value && value !== 'Other' ? (
          <div className="w-full rounded-xl border border-gray-300 dark:border-brand-700/50 px-4 py-3 text-sm bg-white dark:bg-brand-900/50 text-gray-900 dark:text-white flex items-center justify-between gap-2">
            <span className="truncate">{value}</span>
            <button
              type="button"
              onClick={clear}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label={t('form.clearSelection')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : value !== 'Other' ? (
          <>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={t('form.searchCompanies')}
                className="w-full rounded-xl border border-gray-300 dark:border-brand-700/50 pl-10 pr-4 py-3 text-sm bg-white dark:bg-brand-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 hover:border-brand-400 dark:hover:border-brand-500/50"
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-autocomplete="list"
              />
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {open && (
              <ul
                ref={listRef}
                role="listbox"
                className="absolute z-50 mt-1.5 w-full max-h-56 overflow-y-auto rounded-xl border border-gray-200 dark:border-brand-700/50 bg-white dark:bg-brand-900 shadow-xl shadow-black/10 dark:shadow-black/30 py-1"
              >
                {options.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">{t('form.noCompanies')}</li>
                ) : (
                  options.map((opt, i) => (
                    <li
                      key={opt}
                      role="option"
                      aria-selected={highlightIdx === i}
                      onClick={() => select(opt)}
                      onMouseEnter={() => setHighlightIdx(i)}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100 ${
                        opt === 'Other'
                          ? `border-t border-gray-100 dark:border-brand-700/30 mt-1 pt-3 font-medium text-brand-600 dark:text-brand-400 ${highlightIdx === i ? 'bg-brand-50 dark:bg-brand-800/50' : ''}`
                          : highlightIdx === i
                            ? 'bg-brand-50 dark:bg-brand-800/40 text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-brand-800/30'
                      }`}
                    >
                      {opt === 'Other' ? t('form.otherType') : opt}
                    </li>
                  ))
                )}
              </ul>
            )}
          </>
        ) : null}

        {value === 'Other' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-brand-100 dark:bg-brand-800/50 text-brand-700 dark:text-brand-300">
                Other
              </span>
              <button
                type="button"
                onClick={clear}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {t('form.change')}
              </button>
            </div>
            <input
              type="text"
              value={customValue}
              onChange={(e) => onCustomChange(e.target.value)}
              placeholder={t('form.typeCompany')}
              className="w-full rounded-xl border border-gray-300 dark:border-brand-700/50 px-4 py-3 text-sm bg-white dark:bg-brand-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all duration-200 hover:border-brand-400 dark:hover:border-brand-500/50"
            />
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">{error}</p>}
    </div>
  );
}

function SuccessPanel({ onReset, submissionNumber }) {
  const { t } = useLanguage();
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e) => { if (e.key === 'Escape') onReset(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onReset]);

  const clipboardCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  const siteUrl = 'https://devcareer.am';
  const shareText = t('success.shareText');

  const copyLink = async () => {
    await clipboardCopy(siteUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const confettiPieces = useMemo(() => {
    const colors = ['#3366ff', '#5990ff', '#FF6B6B', '#FFE66D', '#4ECDC4', '#FF8A5C', '#A78BFA', '#34D399', '#F472B6', '#FBBF24'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${6 + Math.random() * 8}px`,
        height: `${6 + Math.random() * 8}px`,
        backgroundColor: colors[i % colors.length],
        borderRadius: Math.random() > 0.5 ? '50%' : '3px',
        animationDelay: `${Math.random() * 2.5}s`,
        animationDuration: `${2.5 + Math.random() * 2.5}s`,
      },
    }));
  }, []);

  const platforms = [
    {
      name: 'Facebook',
      bg: 'bg-[#1877F2] hover:bg-[#1469D8]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
    {
      name: 'Messenger',
      bg: 'bg-gradient-to-br from-[#00B2FF] to-[#006AFF]',
      href: `fb-messenger://share/?link=${encodeURIComponent(siteUrl)}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.434 5.503 3.678 7.2V22l3.378-1.856A10.55 10.55 0 0 0 12 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.06 12.453l-2.545-2.714-4.97 2.714 5.467-5.8 2.609 2.714 4.906-2.714-5.467 5.8z"/>
        </svg>
      ),
    },
    {
      name: 'Telegram',
      bg: 'bg-[#26A5E4] hover:bg-[#1E96D1]',
      href: `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      bg: 'bg-[#25D366] hover:bg-[#1DA851]',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + siteUrl)}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      name: 'Instagram',
      bg: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4]',
      href: '#',
      onClick: (e) => { e.preventDefault(); copyLink(); },
      icon: linkCopied ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      ),
    },
  ];

  const overlay = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:py-8 overflow-y-auto min-h-screen">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onReset} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiPieces.map((p) => (
          <div key={p.id} className="confetti-piece" style={p.style} />
        ))}
      </div>

      <div className="relative w-full max-w-md my-auto bg-white dark:bg-brand-900 rounded-3xl shadow-2xl shadow-black/25 overflow-hidden animate-scale-in flex-shrink-0">
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #4ade80, #3366ff, #4ade80)', backgroundSize: '300% 100%', animation: 'shimmer 2.5s linear infinite' }} />

        <div className="p-6 sm:p-8">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: 'checkDraw 0.5s ease-out 0.3s forwards' }} />
              </svg>
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-center text-gray-900 dark:text-white">
            {t('success.thankYou')}
          </h3>
          <p className="mt-2 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            {t('success.submitted')}
          </p>

          {submissionNumber && (
            <div className="mt-4 flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-800/30 dark:to-blue-900/20 border border-brand-200/60 dark:border-brand-700/40 rounded-2xl">
                <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent dark:from-brand-300 dark:to-brand-400">
                  #{submissionNumber}
                </span>
                <div className="w-px h-6 bg-brand-200 dark:bg-brand-700/50" />
                <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {t('success.contributorNumber', { number: submissionNumber })}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-brand-800/50" />
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {t('success.shareTitle')}
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-brand-800/50" />
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('success.shareCTA')}
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              {platforms.map((p) => (
                <div key={p.name} className="relative group">
                  <a
                    href={p.href}
                    target={p.onClick ? undefined : '_blank'}
                    rel={p.onClick ? undefined : 'noopener noreferrer'}
                    onClick={p.onClick}
                    title={p.name}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-lg ${p.bg}`}
                  >
                    {p.icon}
                  </a>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {p.name === 'Instagram' && linkCopied ? t('success.linkCopied') : p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onReset}
            className="mt-10 w-full py-3 text-sm font-semibold text-brand-600 dark:text-brand-400 border-2 border-brand-200 dark:border-brand-700/50 rounded-2xl hover:bg-brand-50 dark:hover:bg-brand-800/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t('success.submitAnother')}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

export default function SubmitForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [cooldown, setCooldown] = useState(getCooldownRemaining);
  const [honeypot, setHoneypot] = useState('');
  const [companies, setCompanies] = useState(DEFAULT_COMPANIES);
  const [roles, setRoles] = useState(DEFAULT_ROLES);

  useEffect(() => {
    let ignore = false;
    Promise.all([fetchCompanies(), fetchRoles()]).then(([c, r]) => {
      if (ignore) return;
      if (c.length) setCompanies((prev) => [...new Set([...prev, ...c])].sort());
      if (r.length) setRoles((prev) => [...new Set([...prev, ...r])].sort());
    });
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      const remaining = getCooldownRemaining();
      setCooldown(remaining);
      if (remaining <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const set = useCallback((field) => (e) => {
    const val = typeof e === 'string' ? e : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === 'role') {
        next.techTags = prev.techTags.filter((tag) =>
          getTagsForRole(val).includes(tag)
        );
        if (val !== 'Other') next.customRole = '';
      }
      if (field === 'companyName' && val !== 'Other') {
        next.customCompany = '';
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const toggleTag = useCallback((tag) => {
    setForm((prev) => ({
      ...prev,
      techTags: prev.techTags.includes(tag)
        ? prev.techTags.filter((x) => x !== tag)
        : [...prev.techTags, tag],
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeypot) return;

    const errs = validateForm(form, t);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstField = document.getElementById(Object.keys(errs)[0]);
      firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstField?.focus();
      return;
    }

    if (getCooldownRemaining() > 0) return;

    setSubmitting(true);
    const claimToken = generateUUID();

    const resolvedCompany = form.companyName === 'Other' ? form.customCompany.trim() : form.companyName;
    const resolvedRole = form.role === 'Other' ? form.customRole.trim() : form.role;

    const payload = {
      role: resolvedRole,
      level: form.level,
      experienceYears: Number(form.experienceYears),
      salaryAmount: Number(form.salaryAmount),
      currency: form.currency,
      period: form.period,
      netOrGross: form.netOrGross,
      companyName: resolvedCompany,
      claimToken,
      ...(form.techTags.length > 0 && { techTags: form.techTags }),
    };

    if (resolvedCompany) {
      createOrUpdateCompany(resolvedCompany);
      if (!companies.includes(resolvedCompany)) {
        setCompanies((prev) => [...prev, resolvedCompany].sort());
      }
    }
    if (resolvedRole) {
      createOrUpdateRole(resolvedRole);
      if (!roles.includes(resolvedRole)) {
        setRoles((prev) => [...prev, resolvedRole].sort());
      }
    }

    const result = await submitSalary(payload);
    setCooldownTimestamp();
    setCooldown(getCooldownRemaining());
    setSubmitting(false);

    setSuccess({ submissionNumber: result.id || null });
  };

  const reset = () => {
    setForm(INITIAL);
    setErrors({});
    setSuccess(null);
  };

  return (
    <section id="submit" className="relative py-24 bg-white dark:bg-brand-950 transition-colors duration-300">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-brand-500/50 to-transparent" />

      <div className="relative max-w-2xl mx-auto px-6">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-300 bg-brand-100 dark:bg-brand-800/50 rounded-full mb-4 tracking-wider uppercase">
              {t('form.badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white">
              {t('form.title')}
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              {t('form.description', { star: '*' })}
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="glass rounded-3xl p-6 sm:p-10">
            {success ? (
              <SuccessPanel onReset={reset} submissionNumber={success.submissionNumber} />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div aria-hidden="true" className="absolute opacity-0 h-0 overflow-hidden" style={{ position: 'absolute', left: '-9999px' }}>
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="space-y-6">
                  <CompanyCombobox
                    label={t('form.company')}
                    value={form.companyName}
                    onChange={(val) => set('companyName')(val)}
                    customValue={form.customCompany}
                    onCustomChange={(val) => set('customCompany')(val)}
                    error={errors.companyName || errors.customCompany}
                    required
                    companies={companies}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select label={t('form.role')} id="role" value={form.role} onChange={set('role')} options={[...roles, 'Other']} error={errors.role} required selectText={t('form.select')} />
                    <Select label={t('form.level')} id="level" value={form.level} onChange={set('level')} options={LEVELS} error={errors.level} required selectText={t('form.select')} />
                  </div>

                  {form.role === 'Other' && (
                    <Input
                      label={t('form.yourRole')}
                      id="customRole"
                      value={form.customRole}
                      onChange={set('customRole')}
                      error={errors.customRole}
                      required
                      placeholder={t('form.placeholderRole')}
                    />
                  )}

                  <Input
                    label={t('form.experience')}
                    id="experienceYears"
                    type="number"
                    value={form.experienceYears}
                    onChange={set('experienceYears')}
                    error={errors.experienceYears}
                    required
                    placeholder={t('form.placeholderExp')}
                    min={0}
                    max={40}
                  />

                  <Input
                    label={t('form.salary')}
                    id="salaryAmount"
                    type="number"
                    value={form.salaryAmount}
                    onChange={set('salaryAmount')}
                    error={errors.salaryAmount}
                    required
                    placeholder={t('form.placeholderSalary')}
                    min={1}
                  />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <Select label={t('form.currency')} id="currency" value={form.currency} onChange={set('currency')} options={CURRENCIES} error={errors.currency} required selectText={t('form.select')} />
                    <Select
                      label={t('form.period')}
                      id="period"
                      value={form.period}
                      onChange={set('period')}
                      options={PERIODS.map((p) => ({ value: p, label: t(`form.options.${p.toLowerCase()}`) }))}
                      error={errors.period}
                      required
                      selectText={t('form.select')}
                    />
                    <Select
                      label={t('form.netOrGross')}
                      id="netOrGross"
                      value={form.netOrGross}
                      onChange={set('netOrGross')}
                      options={NET_GROSS.map((g) => ({ value: g, label: t(`form.options.${g.toLowerCase()}`) }))}
                      error={errors.netOrGross}
                      required
                      selectText={t('form.select')}
                    />
                  </div>

                  <TagSelector tags={getTagsForRole(form.role)} selected={form.techTags} onToggle={toggleTag} />

                  {cooldown > 0 && (
                    <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-xl px-5 py-3 flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('form.cooldown', { seconds: Math.ceil(cooldown / 1000) })}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || cooldown > 0}
                    className="group w-full py-4 bg-brand-500 text-white font-bold rounded-2xl hover:bg-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base hover:shadow-xl hover:shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('form.submitting')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        {t('form.submitAnonymously')}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
