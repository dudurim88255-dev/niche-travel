// 상세 페이지의 좋아요 토글. localStorage(nt:liked) 직접 읽기/쓰기.
// 탐색 페이지의 likedIds와 같은 키 — same-tab 동기화는 새로고침 시점에 일어남(현 단계 OK).

"use client";

import { useEffect, useState } from "react";
import { LS, readNumberSet, writeNumberSet } from "@/lib/storage";

export function LikeButton({ destId }: { destId: number }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(readNumberSet(LS.liked).has(destId));
  }, [destId]);

  function toggle() {
    const set = readNumberSet(LS.liked);
    if (set.has(destId)) set.delete(destId);
    else set.add(destId);
    writeNumberSet(LS.liked, set);
    setLiked(set.has(destId));
  }

  return (
    <button
      onClick={toggle}
      className="flex flex-col items-center gap-1 text-xs"
      style={{ color: "#5a5346", fontFamily: "'Noto Sans KR', sans-serif" }}
      aria-pressed={liked}
    >
      <span
        className="text-[22px]"
        style={{ filter: liked ? "none" : "grayscale(1) opacity(0.6)" }}
      >
        {liked ? "❤️" : "🤍"}
      </span>
      <span>좋아요</span>
    </button>
  );
}
