// 원본 Index.tsx 149~321줄 (Card 컴포넌트) 1:1 이식.
// Phase 10: 카드 우측 액션 버튼이 이미지 콘텐츠(가격표 등)를 가리는 문제 해결 위해
// 액션 바를 ActionRail로 분리하고 카드는 콘텐츠 전용. priority prop으로 첫 카드 LCP 최적화.

"use client";

import { useState } from "react";
import { CATEGORIES, type Destination } from "@/data/destinations";

export function DestinationCard({
  dest,
  index,
  total,
  priority = false,
  onCardClick,
}: {
  dest: Destination;
  index: number;
  total: number;
  priority?: boolean;
  onCardClick?: (dest: Destination) => void;
}) {
  const catObj = CATEGORIES.find((c) => c.id === dest.cat)!;
  const [imgLoaded, setImgLoaded] = useState(false);

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
        className="absolute inset-0"
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
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
        <h2
          className="text-white text-[22px] font-extrabold mb-2 leading-tight"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          {dest.title}
        </h2>
        <p
          className="text-white/85 text-[13px] leading-relaxed mb-3"
          style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            maxWidth: "85%",
          }}
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
