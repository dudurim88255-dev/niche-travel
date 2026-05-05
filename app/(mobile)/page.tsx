// 원본 Index.tsx 1730~1900줄 (NicheTravel main + explore tab) 1:1 이식.
// Phase 2: 라우트 분리에 따라 BottomNav/MobileFrame/탭 분기는 (mobile)/layout.tsx로 이동.
// localStorage 동기화: lib/storage.ts 헬퍼 사용 (nt:saved, nt:liked).
// navigator.share + clipboard fallback + sonner toast.

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  CATEGORIES,
  DESTINATIONS,
  type Destination,
} from "@/data/destinations";
import { CategoryPill } from "@/components/CategoryPill";
import { DestinationCard } from "@/components/DestinationCard";
import {
  LS,
  readNumberSet,
  writeNumberSet,
} from "@/lib/storage";

export default function ExplorePage() {
  const [activeCat, setActiveCat] = useState("all");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLikedIds(readNumberSet(LS.liked));
    setSavedIds(readNumberSet(LS.saved));
    setHydrated(true);
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
    setCurrentIndex(0);
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

  const handleShare = useCallback(async (dest: Destination) => {
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: dest.title,
      text: `${dest.desc}\n📍 ${dest.location}`,
      url: shareUrl,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(
        `${dest.title}\n${dest.desc}\n📍 ${dest.location}\n${shareUrl}`
      );
      toast.success("클립보드에 복사했어요", {
        description: "링크와 설명을 어디든 붙여넣으세요",
      });
    } catch {
      toast.error("공유에 실패했어요");
    }
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
            onShare={handleShare}
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
