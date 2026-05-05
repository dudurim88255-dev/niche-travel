// 원본 Index.tsx 1906~1957줄 디자인 그대로.
// Phase 2: setTab 대신 Next Link + usePathname 사용 (라우트 분리).
// 매거진 탭은 외부 정적 경로(/blog/)이므로 native <a>.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", icon: "🧭", label: "탐색" },
  { href: "/map", icon: "🗺️", label: "내 지도" },
  { href: "/schedule", icon: "📅", label: "내 일정" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <div
      className="fixed flex justify-around z-30"
      style={{
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 420,
        background: "rgba(250,247,242,0.98)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid #e8e3db",
        padding: "10px 0 20px",
      }}
    >
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="bg-transparent border-none cursor-pointer flex flex-col items-center gap-1 no-underline"
            style={{
              color: active ? "#FF6B35" : "#8a8478",
              fontFamily: "'Noto Sans KR', sans-serif",
            }}
          >
            <span className="text-[22px]">{t.icon}</span>
            <span
              className="text-[11px]"
              style={{ fontWeight: active ? 700 : 500 }}
            >
              {t.label}
            </span>
          </Link>
        );
      })}
      <a
        href="/blog/"
        className="flex flex-col items-center gap-1 no-underline"
        style={{
          color: "#8a8478",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        <span className="text-[22px]">📖</span>
        <span className="text-[11px]" style={{ fontWeight: 500 }}>
          매거진
        </span>
      </a>
    </div>
  );
}
