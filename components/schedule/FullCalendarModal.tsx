// 원본 Index.tsx 569~741줄 1:1.

"use client";

import { useState } from "react";
import { dateKey, type ScheduleMap } from "@/lib/schedule";

const FONT = "'Noto Sans KR', sans-serif";

export function FullCalendarModal({
  today,
  scheduleMap,
  onClose,
  onAddNote,
  onRemoveNote,
}: {
  today: Date;
  scheduleMap: ScheduleMap;
  onClose: () => void;
  onAddNote: (key: string, note: string) => void;
  onRemoveNote: (key: string, idx: number) => void;
}) {
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else setViewMonth(viewMonth + 1);
  };

  const isToday = (d: number) =>
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    d === today.getDate();

  const handleAdd = () => {
    if (selectedDate && noteInput.trim()) {
      onAddNote(selectedDate, noteInput.trim());
      setNoteInput("");
    }
  };

  const selectedNotes = selectedDate ? scheduleMap[selectedDate] || [] : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full mx-4"
        style={{
          maxWidth: 380,
          background: "#faf7f2",
          borderRadius: 20,
          padding: "20px 16px",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="border-none cursor-pointer bg-transparent text-xl"
            style={{ color: "#5a5346" }}
          >
            ◀
          </button>
          <span
            className="text-[18px] font-extrabold"
            style={{ color: "#2d2a26", fontFamily: FONT }}
          >
            {viewYear}년 {viewMonth + 1}월
          </span>
          <button
            onClick={nextMonth}
            className="border-none cursor-pointer bg-transparent text-xl"
            style={{ color: "#5a5346" }}
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((dl, i) => (
            <span
              key={dl}
              className="text-[11px] text-center font-semibold"
              style={{
                color: i === 0 ? "#E91E63" : i === 6 ? "#5C6BC0" : "#8a8478",
                fontFamily: FONT,
              }}
            >
              {dl}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {cells.map((day, i) => {
            if (!day) return <span key={i} />;
            const key = dateKey(viewYear, viewMonth + 1, day);
            const hasNotes = scheduleMap[key] && scheduleMap[key].length > 0;
            const isTd = isToday(day);
            const isSel = selectedDate === key;
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(key)}
                className="border-none cursor-pointer flex flex-col items-center justify-center"
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: 10,
                  background: isSel
                    ? "#FF6B35"
                    : isTd
                      ? "#FF6B3520"
                      : "transparent",
                  color: isSel ? "#fff" : isTd ? "#FF6B35" : "#2d2a26",
                  fontWeight: isTd || isSel ? 700 : 400,
                  fontSize: 14,
                  fontFamily: FONT,
                  position: "relative",
                }}
              >
                {day}
                {hasNotes && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: isSel ? "#fff" : "#E91E63",
                      position: "absolute",
                      bottom: 3,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {selectedDate && (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📝</span>
              <span
                className="text-[14px] font-bold"
                style={{ color: "#2d2a26", fontFamily: FONT }}
              >
                {selectedDate.replace(/-/g, ".")} 일정
              </span>
            </div>

            {selectedNotes.length > 0 ? (
              <div className="flex flex-col gap-1.5 mb-3">
                {selectedNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between"
                    style={{
                      background: "#f5f0e8",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <span
                      className="text-[12px]"
                      style={{ color: "#2d2a26", fontFamily: FONT }}
                    >
                      ✅ {note}
                    </span>
                    <button
                      onClick={() => onRemoveNote(selectedDate, idx)}
                      className="border-none cursor-pointer bg-transparent text-[11px]"
                      style={{ color: "#E91E63" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="text-[12px] mb-3"
                style={{ color: "#8a8478", fontFamily: FONT }}
              >
                아직 일정이 없어요
              </p>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="일정 추가 (예: 항공권 예약)"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="flex-1 border-none outline-none text-[12px]"
                style={{
                  background: "#f5f0e8",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontFamily: FONT,
                  color: "#2d2a26",
                }}
              />
              <button
                onClick={handleAdd}
                className="border-none cursor-pointer text-[12px] font-bold px-3 py-2 rounded-lg"
                style={{
                  background: noteInput.trim() ? "#FF6B35" : "#e0dbd3",
                  color: noteInput.trim() ? "#fff" : "#8a8478",
                  fontFamily: FONT,
                }}
              >
                추가
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full border-none cursor-pointer text-[14px] font-bold py-3 mt-4"
          style={{
            background: "#f0ece6",
            borderRadius: 12,
            color: "#5a5346",
            fontFamily: FONT,
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
