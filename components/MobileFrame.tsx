// 원본 Index.tsx 1797~1805줄: <div maxWidth=420 ...> wrapper

import type { ReactNode } from "react";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto min-h-screen relative overflow-hidden"
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
