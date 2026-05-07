// 상세 페이지의 공유. /places/{slug} URL을 navigator.share 또는 clipboard로 전달.
// sonner toast 사용 (alert 회피).

"use client";

import { toast } from "sonner";
import type { Destination } from "@/data/destinations";

export function ShareButton({ dest }: { dest: Destination }) {
  async function share() {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/places/${dest.slug}`;
    const data = {
      title: dest.title,
      text: `${dest.desc}\n📍 ${dest.location}`,
      url,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data);
        return;
      }
    } catch {
      return; // user cancelled
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success("링크가 복사됐어요", {
        description: "어디든 붙여넣어 공유하세요",
      });
    } catch {
      toast.error("공유에 실패했어요");
    }
  }

  return (
    <button
      onClick={share}
      className="flex flex-col items-center gap-1 text-xs"
      style={{ color: "#5a5346", fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <span className="text-[22px]">🔗</span>
      <span>공유</span>
    </button>
  );
}
