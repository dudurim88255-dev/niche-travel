// 원본 Index.tsx 1704~1725줄 1:1.

"use client";

const FONT = "'Noto Sans KR', sans-serif";

export function EveningBlock() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full" style={{ background: "#5C6BC0" }} />
        <span className="text-lg">🌙</span>
        <span
          className="font-bold text-[15px]"
          style={{ color: "#2d2a26", fontFamily: FONT }}
        >
          저녁
        </span>
        <span className="text-[13px]" style={{ color: "#8a8478", fontFamily: FONT }}>
          18:00 - 22:00
        </span>
      </div>
      <div
        className="flex flex-col items-center gap-2"
        style={{ border: "2px dashed #e0dbd3", borderRadius: 12, padding: 24 }}
      >
        <span className="text-[28px]">✨</span>
        <span
          className="text-[13px]"
          style={{ color: "#8a8478", fontFamily: FONT }}
        >
          여유로운 저녁이 기다리고 있어요
        </span>
      </div>
    </div>
  );
}
