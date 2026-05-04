// 원본 Index.tsx 122~147줄 그대로

import type { Category } from "@/data/destinations";

export function CategoryPill({
  cat,
  active,
  onClick,
}: {
  cat: Category;
  active: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(cat.id)}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-none text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-200"
      style={{
        background: active ? cat.color : "#f0ece6",
        color: active ? "#fff" : "#5a5346",
        boxShadow: active ? `0 2px 8px ${cat.color}44` : "none",
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      <span>{cat.emoji}</span>
      {cat.label}
    </button>
  );
}
