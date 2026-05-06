// 카드 공유 로직 단일화: navigator.share 우선, 실패 시 clipboard + sonner toast.
// URL은 origin/?dest={id} 형태 — page.tsx 진입 시 자동 카테고리/카드 선택.

"use client";

import { toast } from "sonner";
import type { Destination } from "@/data/destinations";

export async function shareDestination(dest: Destination) {
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const url = origin ? `${origin}/?dest=${dest.id}` : "";
  const shareData = {
    title: dest.title,
    text: `${dest.desc}\n📍 ${dest.location}`,
    url,
  };
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share(shareData);
      return;
    }
  } catch {
    return; // user cancelled — fallback skip
  }
  try {
    await navigator.clipboard.writeText(
      `${dest.title}\n${dest.desc}\n📍 ${dest.location}\n${url}`
    );
    toast.success("클립보드에 복사했어요", {
      description: "링크와 설명을 어디든 붙여넣으세요",
    });
  } catch {
    toast.error("공유에 실패했어요");
  }
}
