export const LEVELS = ['Junior', 'Mid', 'Senior', 'Lead', 'Manager'];
export const CURRENCIES = ['AMD', 'USD', 'EUR'];
export const PERIODS = ['Monthly', 'Yearly'];
export const NET_GROSS = ['Net', 'Gross'];
export const CONTRACT_TYPES = ['Employee', 'Contractor'];
export const LOCATIONS = ['Yerevan', 'Gyumri', 'Vanadzor', 'Remote', 'Other'];

const COMMON_TAGS = ['Linux', 'Git', 'Docker', 'Jira', 'CI/CD'];

export const ROLE_TECH_TAGS = {
  'DevOps': [
    ...COMMON_TAGS,
    'K8s', 'AWS', 'GCP', 'Azure',
    'Terraform', 'Ansible', 'Pulumi', 'CloudFormation',
    'Helm', 'ArgoCD', 'Jenkins', 'GitLab CI', 'GitHub Actions',
    'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'ELK',
    'Nginx', 'HAProxy', 'Vault', 'Consul', 'Packer',
    'Python', 'Go', 'Bash',
  ],
  'Backend': [
    ...COMMON_TAGS,
    'Node.js', 'Python', 'Java', 'Go', 'PHP', 'Ruby', 'C#', '.NET', 'Rust',
    'Spring', 'Django', 'FastAPI', 'Flask', 'Express', 'NestJS', 'Laravel',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',
    'RabbitMQ', 'Kafka', 'GraphQL', 'REST', 'gRPC',
    'Elasticsearch', 'AWS', 'GCP', 'Azure',
    'K8s', 'Terraform',
  ],
  'Frontend': [
    ...COMMON_TAGS,
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Svelte',
    'Next.js', 'Nuxt.js', 'Remix', 'Astro',
    'HTML/CSS', 'Tailwind', 'SASS', 'Styled Components',
    'Webpack', 'Vite', 'esbuild',
    'Redux', 'Zustand', 'MobX',
    'GraphQL', 'REST', 'Figma', 'Storybook',
    'Jest', 'Cypress', 'Playwright',
  ],
  'Fullstack': [
    ...COMMON_TAGS,
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular',
    'Node.js', 'Python', 'Java', 'Go', 'PHP',
    'Next.js', 'Nuxt.js', 'Remix',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'GraphQL', 'REST',
    'AWS', 'GCP', 'Azure', 'K8s',
    'Tailwind', 'Prisma', 'Drizzle',
  ],
  'QA': [
    ...COMMON_TAGS,
    'Selenium', 'Cypress', 'Playwright', 'Appium',
    'Jest', 'Pytest', 'JUnit', 'TestNG',
    'Postman', 'REST', 'GraphQL', 'SQL',
    'JMeter', 'K6', 'Gatling', 'Locust',
    'TestRail', 'Allure', 'Charles Proxy',
    'JavaScript', 'TypeScript', 'Python', 'Java',
  ],
  'Mobile': [
    ...COMMON_TAGS,
    'iOS', 'Android',
    'Swift', 'Kotlin', 'Objective-C', 'Java',
    'React Native', 'Flutter', 'Dart',
    'Xcode', 'Android Studio', 'Jetpack Compose', 'SwiftUI',
    'Firebase', 'REST', 'GraphQL',
    'Fastlane', 'CocoaPods', 'Gradle',
    'SQLite', 'Realm',
  ],
  'Data Engineer': [
    ...COMMON_TAGS,
    'Python', 'SQL', 'R', 'Scala', 'Java',
    'Spark', 'Hadoop', 'Flink',
    'Airflow', 'dbt', 'Dagster', 'Prefect',
    'Snowflake', 'BigQuery', 'Redshift', 'Databricks',
    'PostgreSQL', 'MongoDB', 'Clickhouse', 'Kafka',
    'Tableau', 'Power BI', 'Looker', 'Metabase',
    'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-learn',
    'MLflow', 'Kubeflow',
    'AWS', 'GCP', 'Azure',
  ],
  'Security': [
    ...COMMON_TAGS,
    'OWASP', 'Burp Suite', 'Nessus', 'Metasploit',
    'Wireshark', 'Nmap', 'Snort', 'Suricata',
    'SIEM', 'SOC', 'Vault', 'Pentest',
    'AWS', 'GCP', 'Azure',
    'ISO 27001', 'SOC 2', 'GDPR',
    'Python', 'Bash', 'Go',
    'Splunk', 'ELK', 'CrowdStrike', 'SentinelOne',
  ],
  'Engineering Manager': [
    ...COMMON_TAGS,
    'Agile', 'Scrum', 'Kanban', 'SAFe',
    'Confluence', 'Notion', 'Linear',
    'OKRs', 'DORA Metrics', 'System Design',
    'AWS', 'GCP', 'Azure',
    'K8s', 'Terraform',
    'Python', 'Java', 'Go', 'JavaScript', 'TypeScript',
  ],
  'Project Manager': [
    'Jira', 'Confluence', 'Notion', 'Linear', 'Asana', 'Monday.com', 'Trello',
    'Agile', 'Scrum', 'Kanban', 'SAFe', 'Waterfall',
    'MS Project', 'Smartsheet', 'Gantt',
    'OKRs', 'KPIs', 'Risk Management', 'Budgeting',
    'Slack', 'Teams', 'Miro', 'Figma',
  ],
  'Product Manager': [
    'Jira', 'Confluence', 'Notion', 'Linear', 'Asana',
    'Agile', 'Scrum', 'Kanban',
    'Figma', 'Miro', 'Amplitude', 'Mixpanel', 'Google Analytics',
    'A/B Testing', 'User Research', 'Roadmapping',
    'SQL', 'Tableau', 'Looker', 'Power BI',
    'OKRs', 'KPIs', 'PRD', 'Product Strategy',
    'Slack', 'Teams',
  ],
};

const ALL_TAGS = [...new Set(Object.values(ROLE_TECH_TAGS).flat())].sort();

export function getTagsForRole(role) {
  if (!role) return null;
  if (role === 'Other') return ALL_TAGS;
  return ROLE_TECH_TAGS[role] || ALL_TAGS;
}

export function validateForm(data, t) {
  const errors = {};

  if (!data.role) {
    errors.role = t('validation.roleRequired');
  } else if (data.role === 'Other' && !data.customRole?.trim()) {
    errors.customRole = t('validation.specifyRole');
  }

  if (!data.level) errors.level = t('validation.levelRequired');

  if (data.experienceYears === '' || data.experienceYears == null) {
    errors.experienceYears = t('validation.experienceRequired');
  } else {
    const exp = Number(data.experienceYears);
    if (!Number.isFinite(exp) || exp < 0 || exp > 40) {
      errors.experienceYears = t('validation.experienceRange');
    }
  }

  if (!data.salaryAmount) {
    errors.salaryAmount = t('validation.salaryRequired');
  } else {
    const sal = Number(data.salaryAmount);
    if (!Number.isFinite(sal) || sal <= 0) {
      errors.salaryAmount = t('validation.salaryPositive');
    }
    if (sal > 100_000_000) {
      errors.salaryAmount = t('validation.salaryTooHigh');
    }
  }

  if (!data.currency) errors.currency = t('validation.currencyRequired');
  if (!data.period) errors.period = t('validation.periodRequired');
  if (!data.netOrGross) errors.netOrGross = t('validation.netOrGrossRequired');

  if (!data.location) {
    errors.location = t('validation.locationRequired');
  } else if (data.location === 'Other' && !data.customLocation?.trim()) {
    errors.customLocation = t('validation.specifyLocation');
  }

  const company = data.companyName === 'Other' ? data.customCompany?.trim() : data.companyName;
  if (!company) {
    if (data.companyName === 'Other') {
      errors.customCompany = t('validation.specifyCompany');
    } else {
      errors.companyName = t('validation.companyRequired');
    }
  }

  return errors;
}
