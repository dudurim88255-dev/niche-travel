// 모든 localStorage 키는 nt: prefix로 통일.
// 라우트 분리에 따라 각 페이지가 마운트 시 직접 읽음 (Zustand 미사용 — 옵션 B).

export const LS = {
  saved: "nt:saved",
  liked: "nt:liked",
  schedule: "nt:schedule",
  companionProfile: "nt:companion-profile",
  companionOptin: "nt:companion-optin",
  companionRequested: "nt:companion-requested",
  deviceId: "nt:device-id",
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

// 디바이스 식별자: 마운트 시 1회 호출되어 없으면 UUID 생성·저장.
// Phase 3-B 마이그레이션 시 서버 동기화 키로 사용 예정.
export function getDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(LS.deviceId);
    if (existing) return existing;
    const fresh =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `nt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(LS.deviceId, fresh);
    return fresh;
  } catch {
    return null;
  }
}

// 사용자 데이터 백업/복원 — UI는 Phase 3-B에서 추가, 여기는 함수만 노출.
export interface ExportPayload {
  version: 1;
  exportedAt: string;
  deviceId: string | null;
  saved: number[];
  liked: number[];
  schedule: Record<string, string[]>;
  companionProfile: unknown;
  companionOptin: boolean;
  companionRequested: number[];
}

export function exportAll(): ExportPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    deviceId:
      typeof window !== "undefined"
        ? window.localStorage.getItem(LS.deviceId)
        : null,
    saved: [...readNumberSet(LS.saved)],
    liked: [...readNumberSet(LS.liked)],
    schedule: readJson<Record<string, string[]>>(LS.schedule, {}),
    companionProfile: readJson<unknown>(LS.companionProfile, null),
    companionOptin: readJson<boolean>(LS.companionOptin, false),
    companionRequested: [...readNumberSet(LS.companionRequested)],
  };
}

export function importAll(payload: unknown): {
  ok: boolean;
  applied: string[];
  errors: string[];
} {
  const applied: string[] = [];
  const errors: string[] = [];
  if (!payload || typeof payload !== "object") {
    return { ok: false, applied, errors: ["payload가 객체가 아님"] };
  }
  const p = payload as Partial<ExportPayload>;

  if (Array.isArray(p.saved) && p.saved.every((v) => typeof v === "number")) {
    writeJson(LS.saved, p.saved);
    applied.push(LS.saved);
  } else if (p.saved !== undefined) errors.push(LS.saved);

  if (Array.isArray(p.liked) && p.liked.every((v) => typeof v === "number")) {
    writeJson(LS.liked, p.liked);
    applied.push(LS.liked);
  } else if (p.liked !== undefined) errors.push(LS.liked);

  if (
    p.schedule &&
    typeof p.schedule === "object" &&
    !Array.isArray(p.schedule)
  ) {
    writeJson(LS.schedule, p.schedule);
    applied.push(LS.schedule);
  } else if (p.schedule !== undefined) errors.push(LS.schedule);

  if (p.companionProfile !== undefined) {
    writeJson(LS.companionProfile, p.companionProfile);
    applied.push(LS.companionProfile);
  }

  if (typeof p.companionOptin === "boolean") {
    writeJson(LS.companionOptin, p.companionOptin);
    applied.push(LS.companionOptin);
  } else if (p.companionOptin !== undefined) errors.push(LS.companionOptin);

  if (
    Array.isArray(p.companionRequested) &&
    p.companionRequested.every((v) => typeof v === "number")
  ) {
    writeJson(LS.companionRequested, p.companionRequested);
    applied.push(LS.companionRequested);
  } else if (p.companionRequested !== undefined)
    errors.push(LS.companionRequested);

  return { ok: errors.length === 0, applied, errors };
}
