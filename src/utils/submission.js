const QUEUE_KEY = 'devcareer_submissions_queue';
const COOLDOWN_KEY = 'devcareer_last_submit';
const COOLDOWN_MS = 30_000; // 30 seconds between submissions

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.devcareers.com/v1';

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

export function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveToQueue(payload) {
  const queue = getQueue();
  queue.push({ ...payload, queuedAt: new Date().toISOString() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function exportQueueAsJSON() {
  const queue = getQueue();
  const blob = new Blob([JSON.stringify(queue, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `devcareer_submissions_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

export async function submitSalary(payload) {
  const url = getSubmitUrl();

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { ok: true };
  } catch {
    saveToQueue(payload);
    return { ok: false, offline: true };
  }
}

export async function retryQueue() {
  const url = getSubmitUrl();

  const queue = getQueue();
  const failed = [];
  let sent = 0;

  for (const item of queue) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error();
      sent++;
    } catch {
      failed.push(item);
    }
  }

  localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
  return { sent, failed: failed.length };
}
