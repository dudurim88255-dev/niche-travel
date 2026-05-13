// 원본 Index.tsx 1730~1900줄 (NicheTravel main + explore tab) 1:1 이식.
// Phase 2: 라우트 분리에 따라 BottomNav/MobileFrame/탭 분기는 (mobile)/layout.tsx로 이동.
// Phase 4: 공유 로직은 lib/share.ts로 추출, ?dest=N URL 진입 지원.
// Phase 10-fix: ActionRail 외부 분리 제거. 카드 좌우 padding 16/16 대칭.
//   첫 카드 priority + 점진 렌더(3개 → 전체)로 LCP 단축.

"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CATEGORIES, DESTINATIONS, type Destination } from "@/data/destinations";
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

  // 점진 렌더: 첫 페인트 후 100ms 지나면 전체 렌더. dest deep-link면 즉시 전체.
  const [progressiveReady, setProgressiveReady] = useState(false);

  useEffect(() => {
    setLikedIds(readNumberSet(LS.liked));
    setSavedIds(readNumberSet(LS.saved));
    setHydrated(true);

    let hasDestParam = false;
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
            hasDestParam = true;
          }
        }
      }
    }

    if (hasDestParam) {
      setProgressiveReady(true);
    } else {
      const timer = setTimeout(() => setProgressiveReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (hydrated) writeNumberSet(LS.liked, likedIds);
  }, [likedIds, hydrated]);
  useEffect(() => {
    if (hydrated) writeNumberSet(LS.saved, savedIds);
  }, [savedIds, hydrated]);

  const filtered = useMemo(
    () =>
      activeCat === "all"
        ? DESTINATIONS
        : DESTINATIONS.filter((d) => d.cat === activeCat),
    [activeCat]
  );

  // 인접 카드 이미지 prefetch — currentIndex 변경 시 ±1 미리 로드.
  // new Image()는 브라우저 캐시에만 적재, 화면 렌더 X.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const neighbors = [
      filtered[currentIndex - 1],
      filtered[currentIndex + 1],
    ].filter((d): d is Destination => Boolean(d));
    for (const d of neighbors) {
      const avif = new Image();
      avif.src = d.img.replace(/\.jpe?g$/i, ".avif");
      const jpg = new Image();
      jpg.src = d.img;
    }
  }, [currentIndex, filtered]);

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


  // 280ms transform transition 중 추가 입력 차단 (빠른 연속 클릭/스와이프 무시)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nextCard = () => {
    if (isTransitioning) return;
    if (currentIndex >= filtered.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((p) => p + 1);
  };
  const prevCard = () => {
    if (isTransitioning) return;
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((p) => p - 1);
  };
  // transform transition만 캐치 (DestinationCard 안의 opacity transition은 무시)
  const handleStackTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === "transform") setIsTransitioning(false);
  };

  // Phase 8: 카드 탭 → /places/{slug} 상세 페이지로 이동
  const router = useRouter();
  const handleCardClick = useCallback(
    (dest: Destination) => {
      router.push(`/places/${dest.slug}`);
    },
    [router]
  );

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextCard();
      else prevCard();
    } else if (Math.abs(diff) < 5 && filtered[currentIndex]) {
      // 5px 이하 = 명확한 탭. 중간 영역(5~50px)은 우발적 드래그로 보고 무시.
      handleCardClick(filtered[currentIndex]);
    }
    setTouchStart(null);
  };

  // 점진 렌더: deep-link 진입 시 currentIndex가 0이 아닐 수 있으므로 최소한 그만큼은 렌더.
  const renderCount = progressiveReady
    ? filtered.length
    : Math.max(3, currentIndex + 2);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex gap-2 overflow-x-auto px-4 py-3 shrink-0"
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
        className="text-center py-2 text-[11px] shrink-0"
        style={{ color: "#b0a99e" }}
      >
        ↑ 위로 스와이프하여 더 많은 여행지 탐색
      </div>

      <div
        className="flex-1 overflow-hidden relative"
        style={{
          touchAction: "pan-y",
          maxHeight: "var(--app-height)",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={cardRef}
      >
        {filtered.length > 0 ? (
          // 카테고리가 바뀌면 stack 자체를 새로 마운트 (transition 발동 안 함)
          <div
            key={activeCat}
            onTransitionEnd={handleStackTransitionEnd}
            style={{
              height: "100%",
              transform: `translateY(${-currentIndex * 100}%)`,
              transition: "transform 280ms cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "transform",
            }}
          >
            {filtered.slice(0, renderCount).map((d, i) => (
              <div
                key={d.id}
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 1rem 96px",
                }}
              >
                <DestinationCard
                  dest={d}
                  index={i}
                  total={filtered.length}
                  liked={likedIds.has(d.id)}
                  saved={savedIds.has(d.id)}
                  priority={i === 0}
                  onLike={toggleLike}
                  onSave={toggleSave}
                  onShare={shareDestination}
                  onCardClick={handleCardClick}
                />
              </div>
            ))}
          </div>
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
