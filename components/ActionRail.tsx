// Phase 10: 카드 외부 우측 액션 바. 카드 이미지 콘텐츠를 가리지 않도록 분리.
// 부모(page.tsx)의 onTouchStart/End가 swipe로 인식하지 않도록 모든 핸들러는 stopPropagation.

"use client";

import type { Destination } from "@/data/destinations";

export function ActionRail({
  dest,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
}: {
  dest: Destination;
  liked: boolean;
  saved: boolean;
  onLike: (id: number) => void;
  onSave: (id: number) => void;
  onShare: (dest: Destination) => void;
}) {
  // swipe 제스처가 액션 바 위에서 시작/종료되어도 부모로 전파되지 않도록 차단
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <aside
      className="flex flex-col items-center justify-center gap-3 shrink-0"
      style={{
        width: 56,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      onClick={stop}
      onTouchStart={stop}
      onTouchEnd={stop}
      onTouchMove={stop}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLike(dest.id);
        }}
        aria-pressed={liked}
        aria-label="좋아요"
        className="flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95"
        style={{
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          className="text-[22px] leading-none"
          style={{ filter: liked ? "none" : "grayscale(1) opacity(0.55)" }}
        >
          {liked ? "❤️" : "🤍"}
        </span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSave(dest.id);
        }}
        aria-pressed={saved}
        aria-label="저장"
        className="flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95"
        style={{
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="text-[22px] leading-none">{saved ? "📌" : "📍"}</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onShare(dest);
        }}
        aria-label="공유"
        className="flex h-11 w-11 items-center justify-center rounded-full transition active:scale-95"
        style={{
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="text-[22px] leading-none">🔗</span>
      </button>
    </aside>
  );
}
