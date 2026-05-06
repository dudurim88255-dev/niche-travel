// 메모가 있는 일자 옆에 작게 표시.
// 배경/색상은 기획 명세 그대로:
//   D-DAY: #FF6B35 / 흰글씨, 미래 D-N: #FF6B35 / 흰글씨, 과거: #8a8478 / 흰글씨.
// SSR/CSR mismatch 회피를 위해 마운트 후 첫 렌더에만 계산.

"use client";

import { useEffect, useState } from "react";

const FONT = "'Noto Sans KR', sans-serif";

function diffDays(targetISO: string): number | null {
  // YYYY-MM-DD를 로컬 자정 기준으로 비교 (timezone 영향 최소화)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(targetISO);
  if (!m) return null;
  const target = new Date(
    Number(m[1]),
    Number(m[2]) - 1,
    Number(m[3])
  ).getTime();
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  return Math.ceil((target - today) / 86400000);
}

export function DDayBadge({ targetDate }: { targetDate: string }) {
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    setDiff(diffDays(targetDate));
  }, [targetDate]);

  if (diff === null) return null;

  let label: string;
  let bg: string;
  if (diff === 0) {
    label = "D-DAY";
    bg = "#FF6B35";
  } else if (diff > 0) {
    label = `D-${diff}`;
    bg = "#FF6B35";
  } else {
    label = "완료";
    bg = "#8a8478";
  }

  return (
    <span
      className="text-[11px] font-bold"
      style={{
        background: bg,
        color: "#fff",
        padding: "3px 8px",
        borderRadius: 6,
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}
