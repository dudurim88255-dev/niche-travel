// (mobile)/layout.tsx에 마운트되어 첫 진입 시 device-id를 발급한다.
// 시각 출력은 없음 — 부수 효과만 담당.

"use client";

import { useEffect } from "react";
import { getDeviceId } from "@/lib/storage";

export function BootstrapClient() {
  useEffect(() => {
    getDeviceId();
  }, []);
  return null;
}
