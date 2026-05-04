// 원본 Index.tsx 1906~1957줄 1:1 이식.
// 4개 탭: 탐색/지도/일정 (내부 setTab) + 매거진 (외부 /blog/ 링크).

const TABS = [
  { id: "explore", icon: "🧭", label: "탐색" },
  { id: "map", icon: "🗺️", label: "내 지도" },
  { id: "schedule", icon: "📅", label: "내 일정" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function BottomNav({
  tab,
  onChange,
}: {
  tab: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <div
      className="fixed flex justify-around z-30"
      style={{
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 420,
        background: "rgba(250,247,242,0.98)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid #e8e3db",
        padding: "10px 0 20px",
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="bg-transparent border-none cursor-pointer flex flex-col items-center gap-1"
          style={{
            color: tab === t.id ? "#FF6B35" : "#8a8478",
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          <span className="text-[22px]">{t.icon}</span>
          <span
            className="text-[11px]"
            style={{ fontWeight: tab === t.id ? 700 : 500 }}
          >
            {t.label}
          </span>
        </button>
      ))}
      <a
        href="/blog/"
        className="flex flex-col items-center gap-1 no-underline"
        style={{
          color: "#8a8478",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        <span className="text-[22px]">📖</span>
        <span className="text-[11px]" style={{ fontWeight: 500 }}>
          매거진
        </span>
      </a>
    </div>
  );
}
