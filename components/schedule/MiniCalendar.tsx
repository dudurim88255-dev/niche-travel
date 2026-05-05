// 원본 Index.tsx 497~567줄 1:1.

"use client";

import { dateKey, type ScheduleMap } from "@/lib/schedule";

const FONT = "'Noto Sans KR', sans-serif";

export function MiniCalendar({
  today,
  scheduleMap,
  onOpenFull,
}: {
  today: Date;
  scheduleMap: ScheduleMap;
  onOpenFull: () => void;
}) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstDow = new Date(y, m, 1).getDay();
  const todayDate = today.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <button
      onClick={onOpenFull}
      className="border-none cursor-pointer"
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "8px 10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        minWidth: 140,
        flexShrink: 0,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-[10px] font-bold"
          style={{ color: "#FF6B35", fontFamily: FONT }}
        >
          {m + 1}월
        </span>
        <span className="text-[9px]" style={{ color: "#8a8478" }}>
          🔍 크게보기
        </span>
      </div>
      <div className="grid grid-cols-7 gap-px">
        {["일", "월", "화", "수", "목", "금", "토"].map((dl) => (
          <span
            key={dl}
            className="text-[7px] text-center"
            style={{ color: "#b0a99e", fontFamily: FONT }}
          >
            {dl}
          </span>
        ))}
        {cells.map((day, i) => {
          const key = day ? dateKey(y, m + 1, day) : "";
          const hasSchedule =
            key && scheduleMap[key] && scheduleMap[key].length > 0;
          const isToday = day === todayDate;
          return (
            <span
              key={i}
              className="text-[8px] text-center leading-[14px]"
              style={{
                color: day ? (isToday ? "#fff" : "#5a5346") : "transparent",
                background: isToday ? "#FF6B35" : "transparent",
                borderRadius: isToday ? 4 : 0,
                fontWeight: isToday ? 700 : 400,
                position: "relative",
              }}
            >
              {day || "."}
              {hasSchedule && !isToday && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "#E91E63",
                    display: "block",
                  }}
                />
              )}
            </span>
          );
        })}
      </div>
    </button>
  );
}
