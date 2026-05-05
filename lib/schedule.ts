// 스케줄 메모는 nt:schedule 키에 { [YYYY-MM-DD]: string[] } 형태로 저장.
// dateKey는 원본 Index.tsx 492~495줄과 동일.

export type ScheduleMap = Record<string, string[]>;

export interface CompanionProfile {
  nickname: string;
  style: string;
  intro: string;
  interests: string[];
}

export const EMPTY_PROFILE: CompanionProfile = {
  nickname: "",
  style: "",
  intro: "",
  interests: [],
};

export function dateKey(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
