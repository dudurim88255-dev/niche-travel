// 원본 Index.tsx 1041~1096줄 1:1.
// weekData(7일) + 선택일 메모 리스트.

"use client";

import type { ScheduleMap } from "@/lib/schedule";
import { DDayBadge } from "@/components/DDayBadge";

const FONT = "'Noto Sans KR', sans-serif";

export interface WeekDay {
  dayLabel: string;
  date: number;
  month: number;
  fullDate: string;
}

export function WeekCalendar({
  weekData,
  selectedDay,
  scheduleMap,
  onSelectDay,
  onRemoveNote,
}: {
  weekData: WeekDay[];
  selectedDay: number;
  scheduleMap: ScheduleMap;
  onSelectDay: (i: number) => void;
  onRemoveNote: (key: string, idx: number) => void;
}) {
  const sel = weekData[selectedDay];
  const selNotes = sel ? scheduleMap[sel.fullDate] || [] : [];

  return (
    <>
      <div
        className="flex gap-1 mb-3"
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {weekData.map((wd, i) => {
          const dayNotes = scheduleMap[wd.fullDate] || [];
          const isSel = i === selectedDay;
          return (
            <button
              key={i}
              onClick={() => onSelectDay(i)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 border-none cursor-pointer relative"
              style={{
                borderRadius: 12,
                background: isSel ? "#FF6B35" : "transparent",
                color: isSel ? "#fff" : "#5a5346",
                fontFamily: FONT,
              }}
            >
              <span className="text-[11px] font-medium">{wd.dayLabel}</span>
              <span className="text-base font-bold">{wd.date}</span>
              {dayNotes.length > 0 && (
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: isSel ? "#fff" : "#E91E63",
                    position: "absolute",
                    bottom: 4,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {sel && selNotes.length > 0 && (
        <div
          className="mb-4"
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "10px 14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[11px] font-bold"
              style={{ color: "#FF6B35", fontFamily: FONT }}
            >
              📋 {sel.month}/{sel.date} 일정
            </span>
            <DDayBadge targetDate={sel.fullDate} />
          </div>
          <div className="flex flex-col gap-1">
            {selNotes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between"
                style={{
                  background: "#f5f0e8",
                  borderRadius: 8,
                  padding: "6px 10px",
                }}
              >
                <span
                  className="text-[11px]"
                  style={{ color: "#2d2a26", fontFamily: FONT }}
                >
                  ✅ {note}
                </span>
                <button
                  onClick={() => onRemoveNote(sel.fullDate, idx)}
                  className="border-none cursor-pointer bg-transparent text-[10px]"
                  style={{ color: "#E91E63" }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
