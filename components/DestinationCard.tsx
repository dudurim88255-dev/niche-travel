// 원본 Index.tsx 149~321줄 (Card 컴포넌트) 1:1 이식.
// 디자인 변경 금지 — 모든 인라인 스타일/클래스 그대로 유지.

"use client";

import { useState } from "react";
import { CATEGORIES, type Destination } from "@/data/destinations";

export function DestinationCard({
  dest,
  index,
  total,
  liked,
  saved,
  onLike,
  onSave,
  onShare,
}: {
  dest: Destination;
  index: number;
  total: number;
  liked: boolean;
  saved: boolean;
  onLike: (id: number) => void;
  onSave: (id: number) => void;
  onShare: (dest: Destination) => void;
}) {
  const catObj = CATEGORIES.find((c) => c.id === dest.cat)!;
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maxWidth: 420,
        aspectRatio: "9/14",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        background: "#1a1a1a",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dest.img}
        alt={dest.title}
        onLoad={() => setImgLoaded(true)}
        className="w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: imgLoaded ? 1 : 0 }}
      />
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
      <div
        className="absolute flex flex-col gap-4 items-center"
        style={{ right: 12, bottom: 180 }}
      >
        <button
          onClick={() => onLike(dest.id)}
          className="bg-transparent border-none cursor-pointer flex flex-col items-center gap-0.5"
        >
          <span
            className="text-[26px]"
            style={{ filter: liked ? "none" : "grayscale(1) brightness(2)" }}
          >
            {liked ? "❤️" : "🤍"}
          </span>
          <span
            className="text-white text-[11px]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            좋아요
          </span>
        </button>
        <button
          onClick={() => onSave(dest.id)}
          className="bg-transparent border-none cursor-pointer flex flex-col items-center gap-0.5"
        >
          <span className="text-2xl">{saved ? "📌" : "📍"}</span>
          <span
            className="text-white text-[11px]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            저장
          </span>
        </button>
        <button
          onClick={() => onShare(dest)}
          className="bg-transparent border-none cursor-pointer flex flex-col items-center gap-0.5"
        >
          <span className="text-2xl">🔗</span>
          <span
            className="text-white text-[11px]"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            공유
          </span>
        </button>
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
