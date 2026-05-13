// (mobile) route group: 모든 모바일 라우트가 공유하는 셸.
// MobileFrame(max-w 420 wrapper) + BottomNav(fixed) — 라우트 전환 시 페이지만 갈아끼움.
// Phase 10-fix: explore 첫 카드(id=1) AVIF를 명시 <link rel="preload">로 head에 주입.
//   React 19가 자동으로 hoist. AVIF 미지원 브라우저는 link 무시, picture JPEG fallback.

import type { ReactNode } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { BootstrapClient } from "@/components/BootstrapClient";

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/destinations/1.avif"
        type="image/avif"
        fetchPriority="high"
      />
      <BootstrapClient />
      <MobileFrame>{children}</MobileFrame>
      <BottomNav />
    </>
  );
}
