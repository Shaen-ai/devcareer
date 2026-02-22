import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { RevealOnScroll } from '../hooks/useInView';
import { useLanguage } from '../hooks/useLanguage';
import { generateUUID } from '../utils/uuid';
import {
  LEVELS, CURRENCIES, PERIODS, NET_GROSS, CONTRACT_TYPES, LOCATIONS,
  DEFAULT_ROLES, DEFAULT_COMPANIES,
  getTagsForRole, validateForm,
} from '../utils/validation';
import {
  submitSalary, getCooldownRemaining, setCooldownTimestamp,
  getQueue, retryQueue, exportQueueAsJSON, clearQueue,
  fetchCompanies, fetchRoles, createOrUpdateCompany, createOrUpdateRole,
} from '../utils/submission';

const INITIAL = {
  role: '', customRole: '', level: '', experienceYears: '', salaryAmount: '',
  currency: 'AMD', period: 'Monthly', netOrGross: 'Net', location: '', customLocation: '',
  contractType: '', companyName: '', customCompany: '', techTags: [],
};

function Select({ label, id, value, onChange, options, error, required, selectText }) {
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
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
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

function SuccessPanel({ token, onReset, wasOffline }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = token;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="text-center py-12 px-6 animate-scale-in">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
        <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="text-3xl font-black text-gray-900 dark:text-white">{t('success.thankYou')}</h3>
      <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg">
        {wasOffline ? t('success.savedLocally') : t('success.submitted')}
      </p>

      <div className="mt-8 glass rounded-2xl p-6 max-w-md mx-auto">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('success.claimToken')}</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm bg-gray-100 dark:bg-brand-900/50 border border-gray-300 dark:border-brand-700/50 rounded-xl px-4 py-3 font-mono break-all text-brand-700 dark:text-brand-300">
            {token}
          </code>
          <button
            onClick={copy}
            className="flex-shrink-0 px-4 py-3 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 hover:shadow-lg hover:shadow-brand-500/25"
          >
            {copied ? t('success.copied') : t('success.copy')}
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          {t('success.saveToken')}
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-10 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-medium transition-colors duration-200 flex items-center gap-1 mx-auto"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {t('success.submitAnother')}
      </button>
    </div>
  );
}

function QueuePanel() {
  const { t } = useLanguage();
  const [queue, setQueue] = useState(getQueue);
  const [retrying, setRetrying] = useState(false);
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);

  const refresh = () => setQueue(getQueue());

  if (queue.length === 0) return null;

  return (
    <div className="mt-8 border border-amber-400/30 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-5">
      <button
        onClick={() => { setOpen((v) => !v); refresh(); }}
        className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300 w-full"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t('queue.queued', { count: queue.length })}
        <svg className={`w-4 h-4 ml-auto transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 flex flex-wrap gap-3 animate-slide-up">
          <button
            disabled={retrying}
            onClick={async () => {
              setRetrying(true);
              const r = await retryQueue();
              setResult(r);
              refresh();
              setRetrying(false);
            }}
            className="px-4 py-2.5 text-sm font-medium bg-amber-500 text-white rounded-xl hover:bg-amber-400 disabled:opacity-50 transition-all duration-200"
          >
            {retrying ? t('queue.retrying') : t('queue.retry')}
          </button>
          <button
            onClick={exportQueueAsJSON}
            className="px-4 py-2.5 text-sm font-medium glass text-amber-700 dark:text-amber-300 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
          >
            {t('queue.exportJSON')}
          </button>
          <button
            onClick={() => { clearQueue(); refresh(); }}
            className="px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            {t('queue.clearQueue')}
          </button>
          {result && (
            <p className="w-full text-xs text-amber-600 dark:text-amber-400 mt-2">
              {t('queue.sent', { sent: result.sent, failed: result.failed })}
            </p>
          )}
        </div>
      )}
    </div>
  );
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
    const resolvedLocation = form.location === 'Other' ? form.customLocation.trim() : form.location;

    const payload = {
      role: resolvedRole,
      level: form.level,
      experienceYears: Number(form.experienceYears),
      salaryAmount: Number(form.salaryAmount),
      currency: form.currency,
      period: form.period,
      netOrGross: form.netOrGross,
      location: resolvedLocation,
      companyName: resolvedCompany,
      claimToken,
      ...(form.contractType && { contractType: form.contractType }),
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

    setSuccess({ token: claimToken, offline: !result.ok });
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
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
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
              <SuccessPanel token={success.token} onReset={reset} wasOffline={success.offline} />
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
                    <Select label={t('form.period')} id="period" value={form.period} onChange={set('period')} options={PERIODS} error={errors.period} required selectText={t('form.select')} />
                    <Select label={t('form.netOrGross')} id="netOrGross" value={form.netOrGross} onChange={set('netOrGross')} options={NET_GROSS} error={errors.netOrGross} required selectText={t('form.select')} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select label={t('form.location')} id="location" value={form.location} onChange={set('location')} options={LOCATIONS} error={errors.location || errors.customLocation} required selectText={t('form.select')} />
                    <Select label={t('form.contractType')} id="contractType" value={form.contractType} onChange={set('contractType')} options={CONTRACT_TYPES} error={errors.contractType} selectText={t('form.select')} />
                  </div>

                  {form.location === 'Other' && (
                    <Input
                      label={t('form.yourLocation')}
                      id="customLocation"
                      value={form.customLocation}
                      onChange={set('customLocation')}
                      error={errors.customLocation}
                      required
                      placeholder={t('form.placeholderLocation')}
                    />
                  )}

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

        <QueuePanel />
      </div>
    </section>
  );
}
