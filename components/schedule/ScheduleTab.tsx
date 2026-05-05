// 원본 Index.tsx 743~1728줄 ScheduleTab 1:1 (DB 의존 코드 제거 + localStorage 이전).
// today/scheduleMap 등은 ScheduleTab이 보유, 자식에 props로 내림.

"use client";

import { useEffect, useMemo, useState } from "react";
import { LS, readJson, readNumberSet, writeJson } from "@/lib/storage";
import { dateKey, type ScheduleMap } from "@/lib/schedule";
import { MiniCalendar } from "./MiniCalendar";
import { FullCalendarModal } from "./FullCalendarModal";
import { WeekCalendar, type WeekDay } from "./WeekCalendar";
import { MorningBlock } from "./MorningBlock";
import { CompanionFinder } from "./CompanionFinder";
import { EveningBlock } from "./EveningBlock";

const FONT = "'Noto Sans KR', sans-serif";
const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function ScheduleTab() {
  // SSR/CSR 시간차로 인한 hydration mismatch 방지: 마운트 후 today 설정
  const [today, setToday] = useState<Date | null>(null);
  const [scheduleMap, setScheduleMap] = useState<ScheduleMap>({});
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  useEffect(() => {
    setToday(new Date());
    setScheduleMap(readJson<ScheduleMap>(LS.schedule, {}));
    setSavedIds(readNumberSet(LS.saved));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJson(LS.schedule, scheduleMap);
  }, [scheduleMap, hydrated]);

  const weekData: WeekDay[] = useMemo(() => {
    if (!today) return [];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        dayLabel: DAY_LABELS[d.getDay()],
        date: d.getDate(),
        month: d.getMonth() + 1,
        fullDate: dateKey(d.getFullYear(), d.getMonth() + 1, d.getDate()),
      };
    });
  }, [today]);

  const addScheduleNote = (key: string, note: string) => {
    setScheduleMap((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), note],
    }));
  };

  const removeScheduleNote = (key: string, idx: number) => {
    setScheduleMap((prev) => {
      const notes = [...(prev[key] || [])];
      notes.splice(idx, 1);
      return { ...prev, [key]: notes };
    });
  };

  if (!today) {
    return (
      <div className="px-5 pt-8 pb-24 min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">📅</span>
        <p
          className="text-[14px] font-semibold"
          style={{ color: "#5a5346", fontFamily: FONT }}
        >
          일정을 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8 pb-24 min-h-[70vh]">
      {showFullCalendar && (
        <FullCalendarModal
          today={today}
          scheduleMap={scheduleMap}
          onClose={() => setShowFullCalendar(false)}
          onAddNote={addScheduleNote}
          onRemoveNote={removeScheduleNote}
        />
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h2
            className="text-[22px] font-extrabold mb-1"
            style={{ color: "#2d2a26", fontFamily: FONT }}
          >
            📅 내 일정
          </h2>
          <p
            className="text-[13px] mb-1"
            style={{ color: "#8a8478", fontFamily: FONT }}
          >
            느리게, 깊이 있게 여행하기
          </p>
          <p
            className="text-[15px] font-bold"
            style={{ color: "#FF6B35", fontFamily: FONT }}
          >
            {today.getFullYear()}년 {today.getMonth() + 1}월
          </p>
        </div>
        <MiniCalendar
          today={today}
          scheduleMap={scheduleMap}
          onOpenFull={() => setShowFullCalendar(true)}
        />
      </div>

      <WeekCalendar
        weekData={weekData}
        selectedDay={selectedDay}
        scheduleMap={scheduleMap}
        onSelectDay={setSelectedDay}
        onRemoveNote={removeScheduleNote}
      />

      <MorningBlock savedIds={savedIds} />

      <CompanionFinder savedIds={savedIds} />

      <EveningBlock />
    </div>
  );
}
