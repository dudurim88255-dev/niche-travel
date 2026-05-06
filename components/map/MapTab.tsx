// 원본 Index.tsx 323~490줄 (MapTab) 1:1 이식.
// MapView는 SSR 금지 (dynamic import). saved 카드 리스트는 SSR 가능.
// hydrated 분기 제거 — savedIds는 빈 Set으로 시작하므로 SSR/CSR 모두 빈 상태부터 출력.

"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  CATEGORIES,
  DESTINATIONS,
  type Destination,
} from "@/data/destinations";
import { LS, readNumberSet } from "@/lib/storage";

const MapView = dynamic(
  () => import("./MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 300,
          background: "#f5f0e8",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8a8478",
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: 13,
        }}
      >
        지도 불러오는 중…
      </div>
    ),
  }
);

const FONT = "'Noto Sans KR', sans-serif";

export function MapTab() {
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setSavedIds(readNumberSet(LS.saved));
  }, []);

  const saved = useMemo(
    () => DESTINATIONS.filter((d) => savedIds.has(d.id)),
    [savedIds]
  );

  const mapCenter = useMemo<[number, number]>(() => {
    if (saved.length === 0) return [37.5665, 126.978];
    const avgLat = saved.reduce((s, d) => s + d.lat, 0) / saved.length;
    const avgLng = saved.reduce((s, d) => s + d.lng, 0) / saved.length;
    return [avgLat, avgLng];
  }, [saved]);

  const mapZoom = useMemo(() => {
    if (saved.length === 0) return 3;
    if (saved.length === 1) return 8;
    return 3;
  }, [saved.length]);

  const handleSelectDest = (_dest: Destination) => {
    // 원본도 placeholder — 현재 시각 효과 없음
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-8 pb-24">
      <h2
        className="text-[22px] font-extrabold mb-1.5"
        style={{ color: "#2d2a26", fontFamily: FONT }}
      >
        🗺️ 내 여행 지도
      </h2>
      <p
        className="text-[13px] mb-5"
        style={{ color: "#8a8478", fontFamily: FONT }}
      >
        {saved.length > 0
          ? `${saved.length}개의 장소가 저장되었어요 · 장소를 눌러 지도에서 확인하세요`
          : "아직 저장된 장소가 없어요"}
      </p>

      {saved.length > 0 ? (
        <div
          className="mb-5 overflow-hidden"
          style={{
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <MapView saved={saved} mapCenter={mapCenter} mapZoom={mapZoom} />
        </div>
      ) : (
        <div
          className="flex flex-col items-center gap-3 mb-5"
          style={{
            background: "#f5f0e8",
            borderRadius: 16,
            padding: 24,
            minHeight: 200,
            justifyContent: "center",
          }}
        >
          <span className="text-5xl">🗺️</span>
          <p
            className="font-bold text-base"
            style={{ color: "#5a5346", fontFamily: FONT }}
          >
            저장된 장소가 없어요
          </p>
          <p
            className="text-[13px] text-center"
            style={{ color: "#8a8478", fontFamily: FONT }}
          >
            탐색 탭에서 마음에 드는 장소를
            <br />
            저장하면 지도에 핀이 표시됩니다
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {saved.map((d) => {
          const catObj = CATEGORIES.find((c) => c.id === d.cat)!;
          const isSelected = selectedId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                setSelectedId(isSelected ? null : d.id);
                handleSelectDest(d);
              }}
              className="w-full flex gap-3 p-3 items-center border-none cursor-pointer text-left"
              style={{
                borderRadius: 12,
                background: isSelected ? "#FFF3E0" : "#fff",
                border: isSelected
                  ? "2px solid #FF6B35"
                  : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <picture>
                <source
                  srcSet={d.img.replace(/\.jpe?g$/i, ".avif")}
                  type="image/avif"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.img}
                  alt=""
                  className="object-cover"
                  style={{ width: 56, height: 56, borderRadius: 10 }}
                  loading="lazy"
                />
              </picture>
              <div className="flex-1">
                <div
                  className="text-sm font-bold"
                  style={{ color: "#2d2a26", fontFamily: FONT }}
                >
                  {d.title}
                </div>
                <div
                  className="text-[11px] mt-0.5"
                  style={{ color: "#8a8478", fontFamily: FONT }}
                >
                  📍 {d.location}
                </div>
              </div>
              <span
                className="text-[10px] font-semibold"
                style={{
                  background: catObj.color + "22",
                  color: catObj.color,
                  padding: "3px 8px",
                  borderRadius: 8,
                  fontFamily: FONT,
                }}
              >
                {catObj.emoji} {catObj.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
