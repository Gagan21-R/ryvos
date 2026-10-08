// Thin wrapper around the RYVO FastAPI backend.

async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }
  if (!res.ok) throw new Error(data?.detail || data?.error || `${res.status} ${res.statusText}`);
  return data;
}

export const api = {
  meta: () => request("/api/meta"),
  geography: (domain) => request(`/api/geography?domain=${domain}`),
  scenarios: () => request("/api/scenarios"),
  incidents: (domain) => request(`/api/incidents${domain ? `?domain=${domain}` : ""}`),
  metrics: () => request("/api/metrics"),
  proof: () => request("/api/proof"),
  safety: () => request("/api/safety"),
  startRound: (body) => request("/api/round/start", { method: "POST", body }),
  safetyTest: (domain) => request("/api/safety/test", { method: "POST", body: { domain } }),
  control: (body) => request("/api/control", { method: "POST", body }),
  chat: (message, context) => request("/api/chat", { method: "POST", body: { message, context } }),
};
