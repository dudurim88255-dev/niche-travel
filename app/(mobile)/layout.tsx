// (mobile) route group: 모든 모바일 라우트가 공유하는 셸.
// MobileFrame(max-w 420 wrapper) + BottomNav(fixed) — 라우트 전환 시 페이지만 갈아끼움.
// Phase 10: explore 첫 카드(id=1) AVIF를 server SSR 시 preload — LCP 단축.

import type { ReactNode } from "react";
import ReactDOM from "react-dom";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { BootstrapClient } from "@/components/BootstrapClient";

export default function MobileLayout({ children }: { children: ReactNode }) {
  // 모바일 그룹 모든 진입에서 첫 카드 AVIF 사전 로드. 브라우저가 AVIF 미지원이면
  // <picture>의 JPEG fallback이 동작하고 preload는 비활성. 비용 ≈ 0.
  ReactDOM.preload("/destinations/1.avif", {
    as: "image",
    type: "image/avif",
    fetchPriority: "high",
  });

  return (
    <>
      <BootstrapClient />
      <MobileFrame>{children}</MobileFrame>
      <BottomNav />
    </>
  );
}
