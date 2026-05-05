// 원본 Index.tsx 1098~1222줄 1:1 (Morning 블록 + "🚶 자유롭게 산책" divider).

"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, DESTINATIONS } from "@/data/destinations";

const FONT = "'Noto Sans KR', sans-serif";
const MORNING_TIME_LABELS = ["05:00 - 08:00", "08:00 - 10:00", "07:00 - 09:00"];
const MORNING_EMOJIS = ["🌅", "☀️", "🌤️"];

export function MorningBlock({ savedIds }: { savedIds: Set<number> }) {
  const [open, setOpen] = useState(false);

  const recommendations = useMemo(
    () => DESTINATIONS.filter((d) => savedIds.has(d.id)).slice(0, 3),
    [savedIds]
  );

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B35" }} />
        <span className="text-lg">🌤️</span>
        <span
          className="font-bold text-[15px]"
          style={{ color: "#2d2a26", fontFamily: FONT }}
        >
          오전
        </span>
        <span className="text-[13px]" style={{ color: "#8a8478", fontFamily: FONT }}>
          08:00 - 12:00
        </span>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between cursor-pointer border-none"
        style={{
          background: "#FF6B3511",
          borderRadius: 12,
          padding: "14px 16px",
        }}
      >
        <span
          className="text-[13px] font-semibold"
          style={{ color: "#FF6B35", fontFamily: FONT }}
        >
          🌤️ 얼리버드 추천 스팟{" "}
          {recommendations.length > 0 ? `${recommendations.length}곳` : ""}
        </span>
        <span
          style={{
            color: "#FF6B35",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          {recommendations.length === 0 ? (
            <div
              className="flex flex-col items-center gap-2 py-6"
              style={{
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <span className="text-3xl">📌</span>
              <p
                className="text-[13px] font-semibold"
                style={{ color: "#5a5346", fontFamily: FONT }}
              >
                저장된 여행지가 없어요
              </p>
              <p
                className="text-[11px] text-center"
                style={{ color: "#8a8478", fontFamily: FONT }}
              >
                탐색 탭에서 여행지를 저장하면
                <br />
                오전 추천 스팟이 표시됩니다
              </p>
            </div>
          ) : (
            recommendations.map((dest, idx) => {
              const catObj = CATEGORIES.find((c) => c.id === dest.cat)!;
              return (
                <div
                  key={dest.id}
                  className="bg-white flex gap-3 items-start"
                  style={{
                    borderRadius: 14,
                    padding: "14px 16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dest.img}
                    alt=""
                    className="object-cover"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-bold text-[14px] truncate"
                        style={{ color: "#2d2a26", fontFamily: FONT }}
                      >
                        {MORNING_EMOJIS[idx] || "🌤️"} {dest.title}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 flex-shrink-0"
                        style={{
                          background: catObj.color + "18",
                          color: catObj.color,
                          borderRadius: 6,
                          fontFamily: FONT,
                        }}
                      >
                        {catObj.emoji} {catObj.label}
                      </span>
                    </div>
                    <p
                      className="text-[12px] leading-relaxed mb-1.5 line-clamp-2"
                      style={{ color: "#5a5346", fontFamily: FONT }}
                    >
                      {dest.desc}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[11px]"
                        style={{ color: "#8a8478", fontFamily: FONT }}
                      >
                        🕐 {MORNING_TIME_LABELS[idx] || "08:00 - 12:00"}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: "#8a8478", fontFamily: FONT }}
                      >
                        📍 {dest.location}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="flex justify-center my-4">
        <span
          className="text-xs"
          style={{
            background: "#f5f0e8",
            padding: "6px 14px",
            borderRadius: 12,
            color: "#8a8478",
            fontFamily: FONT,
          }}
        >
          🚶 자유롭게 산책
        </span>
      </div>
    </div>
  );
}
