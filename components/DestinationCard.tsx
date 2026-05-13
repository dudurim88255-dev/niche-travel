// 원본 Index.tsx 149~321줄 (Card 컴포넌트) 1:1 이식.
// Phase 10-fix: 액션 버튼을 카드 내부 우측 중앙으로 (사진 안쪽).
//   카드 좌우 대칭 유지(외부 분리 패턴 폐기). 텍스트 영역은 pr-20으로 버튼 회피.
//   priority=true 첫 카드에 fetchPriority/eager/decoding=sync 적용 → LCP 단축.

"use client";

import { useState } from "react";
import { CATEGORIES, type Destination } from "@/data/destinations";

export function DestinationCard({
  dest,
  index,
  total,
  liked,
  saved,
  priority = false,
  onLike,
  onSave,
  onShare,
  onCardClick,
}: {
  dest: Destination;
  index: number;
  total: number;
  liked: boolean;
  saved: boolean;
  priority?: boolean;
  onLike: (id: number) => void;
  onSave: (id: number) => void;
  onShare: (dest: Destination) => void;
  onCardClick?: (dest: Destination) => void;
}) {
  const catObj = CATEGORIES.find((c) => c.id === dest.cat)!;
  const [imgLoaded, setImgLoaded] = useState(false);

  // 액션 버튼 클릭/터치가 부모(page.tsx)의 swipe/tap 핸들러로 전파되지 않도록 차단
  const stopAll = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      className="relative w-full overflow-hidden"
      onClick={() => onCardClick?.(dest)}
      style={{
        maxWidth: 420,
        maxHeight: "100%",
        aspectRatio: "9/14",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        background: "#1a1a1a",
        cursor: onCardClick ? "pointer" : "default",
      }}
    >
      <picture className="block w-full h-full">
        <source
          srcSet={dest.img.replace(/\.jpe?g$/i, ".avif")}
          type="image/avif"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dest.img}
          alt={dest.title}
          onLoad={() => setImgLoaded(true)}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding={priority ? "sync" : "async"}
          className="w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />
      </picture>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-base">🧭</span>
          <span
            className="text-white font-bold text-[15px]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            나만의 여행
          </span>
          <span className="text-white/60 text-xs">(Niche Travel)</span>
        </div>
        <span
          className="text-white text-xs font-semibold px-3 py-1"
          style={{
            background: catObj.color,
            borderRadius: 14,
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          {catObj.label}
        </span>
      </div>
      <div
        className="absolute text-white text-xs font-medium"
        style={{
          top: "30%",
          right: 16,
          background: "rgba(0,0,0,0.5)",
          padding: "4px 10px",
          borderRadius: 12,
          backdropFilter: "blur(4px)",
        }}
      >
        {index + 1} / {total}
      </div>

      {/* 액션 버튼: 카드 내부 우측 중앙. 44x44 흰 반투명 + 백드롭 블러. */}
      <div
        className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3"
        onClick={stopAll}
        onPointerDown={stopAll}
        onTouchStart={stopAll}
        onTouchEnd={stopAll}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(dest.id);
          }}
          aria-pressed={liked}
          aria-label="좋아요"
          className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition active:scale-90"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="text-xl leading-none"
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
          className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition active:scale-90"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="text-xl leading-none">{saved ? "📌" : "📍"}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare(dest);
          }}
          aria-label="공유"
          className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition active:scale-90"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="text-xl leading-none">🔗</span>
        </button>
      </div>

      {/* 하단 텍스트: 우측 패딩 80px(pr-20)로 액션 버튼 영역 회피 */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pr-20">
        <h2
          className="text-white text-[22px] font-extrabold mb-2 leading-tight"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          {dest.title}
        </h2>
        <p
          className="text-white/85 text-[13px] leading-relaxed mb-3"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          {dest.desc}
        </p>
        <div
          className="flex items-center gap-1 text-white/60 text-xs"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          <span>📍</span>
          <span>{dest.location}</span>
        </div>
        <div
          className="mt-3 flex items-center gap-1.5 w-fit"
          style={{
            background: "rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "8px 12px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span>📌</span>
          <span
            className="text-white/80 text-xs"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            저장하면 내 지도에 핀!
          </span>
        </div>
      </div>
    </div>
  );
}
