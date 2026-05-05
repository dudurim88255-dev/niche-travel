// (mobile) route group: 모든 모바일 라우트가 공유하는 셸.
// MobileFrame(max-w 420 wrapper) + BottomNav(fixed) — 라우트 전환 시 페이지만 갈아끼움.

import type { ReactNode } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MobileFrame>{children}</MobileFrame>
      <BottomNav />
    </>
  );
}
