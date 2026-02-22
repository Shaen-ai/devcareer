import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function translateText(text, targetLang) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const translated = json[0].map((s) => s[0]).join('');
          resolve(translated);
        } catch (e) {
          reject(new Error(`Failed to parse: ${data.slice(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function unflattenObject(flat) {
  const result = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

const en = {
  nav: {
    howItWorks: 'How it works',
    submit: 'Submit',
    faq: 'FAQ',
    submitSalary: 'Submit salary',
    toggleMenu: 'Toggle menu',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
  },
  hero: {
    badge: 'Stage 1 — Collecting anonymous data',
    title1: 'Real IT salaries',
    title2: 'in Armenia',
    description: "Help build Armenia's first transparent salary database for the tech community. No names, no emails — just honest, anonymous data that helps everyone negotiate better.",
    cta: 'Submit your salary',
    learnMore: 'Learn how it works',
    sec: 'sec',
    toSubmit: 'to submit',
    anonymous: 'anonymous',
    dataSold: 'data sold',
  },
  trust: {
    noName: 'No name required',
    noNameDesc: 'We never ask for personal identifiers',
    noEmail: 'No email needed',
    noEmailDesc: 'Submit without any contact info',
    aggregated: 'Aggregated only',
    aggregatedDesc: 'Data shown as anonymized statistics',
    privacyDetails: 'Privacy details',
    howItWorks: 'How it works',
  },
  howItWorks: {
    badge: 'Process',
    title: 'How it works',
    description: "Three simple steps to contribute to Armenia's salary transparency.",
    step: 'STEP',
    step1Title: 'Submit anonymously',
    step1Desc: 'Fill out the short form below. It takes about 30 seconds. We never ask for your name or email.',
    step2Title: 'Community builds the dataset',
    step2Desc: 'Anyone can submit salary data they know — no accounts, no tracking. Every contribution helps build a more accurate picture of the market.',
    step3Title: 'Salary insights published',
    step3Desc: "We publish transparent salary ranges for Armenia's IT market. Coming soon.",
  },
  stats: {
    badge: 'Progress',
    title: 'Building transparency',
    description: "We are in Stage 1 — collecting data. Help us reach our goal.",
    dataCollection: 'Data collection progress',
    stageOf: 'Stage 1 of 3',
    collecting: 'Collecting',
    analyzing: 'Analyzing',
    publishing: 'Publishing',
    submissions: 'Submissions so far',
    roles: 'Unique roles tracked',
  },
  form: {
    badge: 'Contribute',
    title: 'Submit your salary',
    description: 'All fields marked with * are required. Your data is never linked to your identity.',
    role: 'Role',
    level: 'Level',
    yourRole: 'Your role',
    experience: 'Years of experience',
    salary: 'Net monthly salary (AMD)',
    location: 'Location',
    company: 'Company name',
    optional: 'Optional',
    techTags: 'Tech tags (optional)',
    techTagsHelp: 'Select technologies you work with',
    select: 'Select...',
    searchCompanies: 'Search companies...',
    typeCompany: 'Type company name...',
    noCompanies: 'No companies found',
    otherType: '+ Other (type your own)',
    change: 'Change',
    clearSelection: 'Clear selection',
    submitAnonymously: 'Submit anonymously',
    submitting: 'Submitting...',
    placeholderRole: 'e.g. Product Manager, Designer, CTO...',
    placeholderExp: 'e.g. 5',
    placeholderSalary: 'e.g. 500000',
  },
  success: {
    thankYou: 'Thank you!',
    submitted: 'Your anonymous salary data has been submitted.',
    claimToken: 'Your claim token:',
    copy: 'Copy',
    copied: 'Copied!',
    submitAnother: 'Submit another salary',
  },
  faq: {
    badge: 'Questions',
    title: 'Frequently asked questions',
    moreQuestions: 'Have more questions?',
    getInTouch: 'Get in touch',
    q1: 'Is it really anonymous?',
    a1: 'Yes. We never ask for your name, email, or any personal identifiers. We do not log IP addresses. The only optional field that could be identifying is company name — and that is entirely up to you.',
    q2: 'Can my company know it is me?',
    a2: 'No. Submissions contain no personal data. Even if you provide a company name, the data is aggregated and never displayed individually. We strip identifying patterns before publishing any statistics.',
    q3: 'When will salary statistics be published?',
    a3: "We are collecting data right now (Stage 1). Once we reach a meaningful sample size, we will publish aggregated salary ranges by role, level, and location. Follow us for updates — coming soon.",
    q4: 'Why do you need this data?',
    a4: "Armenia's IT market lacks salary transparency. Developers often do not know if they are fairly compensated. By collecting anonymous data, we can publish benchmarks that help everyone — job seekers, employees, and employers alike — make informed decisions.",
  },
  footer: {
    description: "Building salary transparency for Armenia's tech community. Anonymous, open, community-driven.",
    submitSalary: 'Submit salary',
    learnMore: 'Learn more',
    privacy: 'Privacy',
    privacyText: 'We do not collect personal information. No names, emails, or IP addresses are stored. Salary data is shown only in aggregate form. We will never sell or share individual submissions.',
    terms: 'Terms',
    termsText: 'By submitting data you confirm it is truthful to the best of your knowledge. DevCareer.am provides information for reference purposes and makes no guarantees about its accuracy.',
    faq: 'FAQ',
    submit: 'Submit',
  },
  validation: {
    roleRequired: 'Role is required',
    specifyRole: 'Please specify your role',
    levelRequired: 'Level is required',
    experienceRequired: 'Experience is required',
    experienceRange: 'Must be between 0 and 40',
    salaryRequired: 'Salary amount is required',
    salaryPositive: 'Must be greater than 0',
    salaryTooHigh: 'Value seems too high',
    locationRequired: 'Location is required',
  },
};

async function translateAll(targetLang) {
  const flat = flattenObject(en);
  const translated = {};
  const entries = Object.entries(flat);
  
  console.log(`Translating ${entries.length} strings to ${targetLang}...`);
  
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    
    if (typeof value !== 'string') {
      translated[key] = value;
      continue;
    }

    // Skip placeholders with template vars - translate without them
    try {
      const result = await translateText(value, targetLang);
      translated[key] = result;
      process.stdout.write(`  [${i + 1}/${entries.length}] ${key}\n`);
    } catch (err) {
      console.error(`  FAILED: ${key} - ${err.message}`);
      translated[key] = value; // fallback to English
    }
    
    await sleep(100); // rate limit
  }
  
  return unflattenObject(translated);
}

function toJSFile(obj) {
  return `export default ${JSON.stringify(obj, null, 2)};\n`;
}

async function main() {
  const outDir = path.join(__dirname, '..', 'src', 'i18n');

  console.log('=== Generating Armenian (hy) translations ===');
  const hy = await translateAll('hy');
  fs.writeFileSync(path.join(outDir, 'hy.js'), toJSFile(hy), 'utf-8');
  console.log('Wrote hy.js\n');

  console.log('=== Generating Russian (ru) translations ===');
  const ru = await translateAll('ru');
  fs.writeFileSync(path.join(outDir, 'ru.js'), toJSFile(ru), 'utf-8');
  console.log('Wrote ru.js\n');

  console.log('Done!');
}

main().catch(console.error);
