// 원본 Index.tsx 1730~1900줄 (NicheTravel main + explore tab) 1:1 이식.
// Phase 2: 라우트 분리에 따라 BottomNav/MobileFrame/탭 분기는 (mobile)/layout.tsx로 이동.
// Phase 4: 공유 로직은 lib/share.ts로 추출, ?dest=N URL 진입 지원.

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CATEGORIES, DESTINATIONS } from "@/data/destinations";
import { CategoryPill } from "@/components/CategoryPill";
import { DestinationCard } from "@/components/DestinationCard";
import { LS, readNumberSet, writeNumberSet } from "@/lib/storage";
import { shareDestination } from "@/lib/share";

export default function ExplorePage() {
  const [activeCat, setActiveCat] = useState("all");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // ?dest=N 진입 시 해당 카드로 자동 이동 (activeCat 변경 → useEffect에서 index 보정)
  const pendingDestRef = useRef<number | null>(null);

  useEffect(() => {
    setLikedIds(readNumberSet(LS.liked));
    setSavedIds(readNumberSet(LS.saved));
    setHydrated(true);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const destParam = params.get("dest");
      if (destParam) {
        const id = Number.parseInt(destParam, 10);
        if (Number.isFinite(id)) {
          const dest = DESTINATIONS.find((d) => d.id === id);
          if (dest) {
            pendingDestRef.current = id;
            setActiveCat(dest.cat);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (hydrated) writeNumberSet(LS.liked, likedIds);
  }, [likedIds, hydrated]);
  useEffect(() => {
    if (hydrated) writeNumberSet(LS.saved, savedIds);
  }, [savedIds, hydrated]);

  const filtered =
    activeCat === "all"
      ? DESTINATIONS
      : DESTINATIONS.filter((d) => d.cat === activeCat);

  useEffect(() => {
    const filteredNow =
      activeCat === "all"
        ? DESTINATIONS
        : DESTINATIONS.filter((d) => d.cat === activeCat);
    if (pendingDestRef.current !== null) {
      const idx = filteredNow.findIndex(
        (d) => d.id === pendingDestRef.current
      );
      setCurrentIndex(idx >= 0 ? idx : 0);
      pendingDestRef.current = null;
    } else {
      setCurrentIndex(0);
    }
  }, [activeCat]);

  const toggleLike = useCallback((id: number) => {
    setLikedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const toggleSave = useCallback((id: number) => {
    setSavedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
        toast("저장 해제", { description: "내 지도에서 제거했어요" });
      } else {
        n.add(id);
        toast.success("저장 완료", { description: "내 지도에 핀이 꽂혔어요" });
      }
      return n;
    });
  }, []);


  const nextCard = () =>
    setCurrentIndex((p) => Math.min(p + 1, filtered.length - 1));
  const prevCard = () => setCurrentIndex((p) => Math.max(p - 1, 0));

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextCard();
      else prevCard();
    }
    setTouchStart(null);
  };

  return (
    <div>
      <div
        className="sticky top-0 z-10 flex gap-2 overflow-x-auto px-4 py-3"
        style={{
          background: "rgba(250,247,242,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c.id}
            cat={c}
            active={activeCat === c.id}
            onClick={setActiveCat}
          />
        ))}
      </div>

      <div
        className="text-center py-2 text-[11px]"
        style={{ color: "#b0a99e" }}
      >
        ↑ 위로 스와이프하여 더 많은 여행지 탐색
      </div>

      <div
        className="flex justify-center px-4 pb-24"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={cardRef}
      >
        {filtered.length > 0 ? (
          <DestinationCard
            dest={filtered[currentIndex]}
            index={currentIndex}
            total={filtered.length}
            liked={likedIds.has(filtered[currentIndex].id)}
            saved={savedIds.has(filtered[currentIndex].id)}
            onLike={toggleLike}
            onSave={toggleSave}
            onShare={shareDestination}
          />
        ) : (
          <div className="p-10 text-center" style={{ color: "#8a8478" }}>
            여행지가 없습니다
          </div>
        )}
      </div>

      <div
        className="fixed flex gap-4 z-20"
        style={{ bottom: 80, left: "50%", transform: "translateX(-50%)" }}
      >
        <button
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full border-none text-lg flex items-center justify-center"
          style={{
            background: currentIndex > 0 ? "#fff" : "rgba(255,255,255,0.4)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            cursor: currentIndex > 0 ? "pointer" : "default",
          }}
        >
          ◀
        </button>
        <button
          onClick={nextCard}
          disabled={currentIndex >= filtered.length - 1}
          className="w-10 h-10 rounded-full border-none text-lg flex items-center justify-center"
          style={{
            background:
              currentIndex < filtered.length - 1
                ? "#fff"
                : "rgba(255,255,255,0.4)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            cursor:
              currentIndex < filtered.length - 1 ? "pointer" : "default",
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
