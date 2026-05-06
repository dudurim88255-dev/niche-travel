// (mobile)/layout.tsx에 마운트되어 두 가지 부수 효과 수행:
// 1. device-id 발급 (없으면 1회)
// 2. --app-height CSS 변수를 window.innerHeight 정확한 px로 덮어쓰기 (dvh 첫 렌더 버그 회피)
//    resize / orientationchange / visualViewport.resize에 반응해 재계산.

"use client";

import { useEffect } from "react";
import { getDeviceId } from "@/lib/storage";

export function BootstrapClient() {
  useEffect(() => {
    getDeviceId();

    const setAppHeight = () => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${vh}px`);
    };

    // 마운트 즉시 + 다음 frame (iOS Safari 첫 렌더 viewport가 늦게 안정화되는 경우 대응)
    setAppHeight();
    const raf = requestAnimationFrame(setAppHeight);

    window.addEventListener("resize", setAppHeight);
    window.addEventListener("orientationchange", setAppHeight);
    window.visualViewport?.addEventListener("resize", setAppHeight);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("orientationchange", setAppHeight);
      window.visualViewport?.removeEventListener("resize", setAppHeight);
    };
  }, []);

  return null;
}
