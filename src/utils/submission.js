const COOLDOWN_KEY = 'devcareer_last_submit';
const COOLDOWN_MS = 30_000; // 30 seconds between submissions

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.devcareer.am/v1';

function getSubmitUrl() {
  return import.meta.env.VITE_SUBMIT_URL || `${API_BASE}/submit`;
}

let companiesPromise = null;
export function fetchCompanies() {
  if (companiesPromise) return companiesPromise;
  companiesPromise = fetch(`${API_BASE}/companies`)
    .then(res => (res.ok ? res.json() : []))
    .catch(() => [])
    .finally(() => { companiesPromise = null; });
  return companiesPromise;
}

let rolesPromise = null;
export function fetchRoles() {
  if (rolesPromise) return rolesPromise;
  rolesPromise = fetch(`${API_BASE}/roles`)
    .then(res => (res.ok ? res.json() : []))
    .catch(() => [])
    .finally(() => { rolesPromise = null; });
  return rolesPromise;
}

export async function createOrUpdateCompany(name) {
  try {
    await fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  } catch { /* fire and forget */ }
}

export async function createOrUpdateRole(name) {
  try {
    await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  } catch { /* fire and forget */ }
}

export function getCooldownRemaining() {
  const last = localStorage.getItem(COOLDOWN_KEY);
  if (!last) return 0;
  const elapsed = Date.now() - Number(last);
  return Math.max(0, COOLDOWN_MS - elapsed);
}

export function setCooldownTimestamp() {
  localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
}

export async function submitSalary(payload) {
  const url = getSubmitUrl();

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return { ok: true, id: data.id };
}
