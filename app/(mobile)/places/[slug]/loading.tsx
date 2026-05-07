// /places/[slug] 진입 시 hero 이미지 로드 전 잠깐 노출.
// (mobile) layout 안에서 height 정책 일관 (flex-1 + overflow-y-auto).

export default function Loading() {
  return (
    <div className="flex-1 overflow-y-auto pb-24 animate-pulse">
      <div className="aspect-[4/3] w-full" style={{ background: "#e8e3db" }} />
      <div className="space-y-4 p-4">
        <div
          className="h-4 w-2/3 rounded"
          style={{ background: "#e8e3db" }}
        />
        <div
          className="h-32 w-full rounded-xl"
          style={{ background: "#f0ece6" }}
        />
        <div
          className="h-48 w-full rounded-lg"
          style={{ background: "#e8e3db" }}
        />
      </div>
    </div>
  );
}
