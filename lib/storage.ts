// 모든 localStorage 키는 nt: prefix로 통일.
// 라우트 분리에 따라 각 페이지가 마운트 시 직접 읽음 (Zustand 미사용 — 옵션 B).

export const LS = {
  saved: "nt:saved",
  liked: "nt:liked",
  schedule: "nt:schedule",
  companionProfile: "nt:companion-profile",
  companionOptin: "nt:companion-optin",
  companionRequested: "nt:companion-requested",
} as const;

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota / private mode — silently ignore
  }
}

export function readNumberSet(key: string): Set<number> {
  const arr = readJson<unknown>(key, []);
  if (!Array.isArray(arr)) return new Set();
  return new Set(arr.filter((v): v is number => typeof v === "number"));
}

export function writeNumberSet(key: string, set: Set<number>) {
  writeJson(key, [...set]);
}
