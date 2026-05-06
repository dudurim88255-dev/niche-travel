// Phase 7: 한 화면 고정 셸.
// height는 .mobile-frame 클래스(globals.css)가 처리: 100% → var(--app-height) → -webkit-fill-available.
// BootstrapClient의 JS 보정이 마운트 후 정확한 px로 --app-height를 덮어씀.

import type { ReactNode } from "react";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="mobile-frame mx-auto relative overflow-hidden flex flex-col"
      style={{
        maxWidth: 420,
        background: "#faf7f2",
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      {children}
    </div>
  );
}
