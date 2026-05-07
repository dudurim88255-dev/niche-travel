// 상세 페이지의 저장 토글. localStorage(nt:saved) 직접 읽기/쓰기.
// 탐색 페이지/지도 페이지의 savedIds와 동일 키.

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LS, readNumberSet, writeNumberSet } from "@/lib/storage";

export function SaveButton({ destId }: { destId: number }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readNumberSet(LS.saved).has(destId));
  }, [destId]);

  function toggle() {
    const set = readNumberSet(LS.saved);
    if (set.has(destId)) {
      set.delete(destId);
      toast("저장 해제", { description: "내 지도에서 제거했어요" });
    } else {
      set.add(destId);
      toast.success("저장 완료", { description: "내 지도에 핀이 꽂혔어요" });
    }
    writeNumberSet(LS.saved, set);
    setSaved(set.has(destId));
  }

  return (
    <button
      onClick={toggle}
      className="flex flex-col items-center gap-1 text-xs"
      style={{ color: "#5a5346", fontFamily: "'Noto Sans KR', sans-serif" }}
      aria-pressed={saved}
    >
      <span className="text-[22px]">{saved ? "📌" : "📍"}</span>
      <span>저장</span>
    </button>
  );
}
