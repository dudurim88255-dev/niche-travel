// server component(places/[slug]/page.tsx)에서 ssr:false dynamic을 직접 못 부르므로
// 'use client' wrapper를 한 번 거쳐 호출.

"use client";

import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("./MapPreview"), {
  ssr: false,
  loading: () => (
    <div
      className="h-48 w-full rounded-lg"
      style={{
        background: "#f5f0e8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#8a8478",
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: 13,
      }}
    >
      지도 불러오는 중…
    </div>
  ),
});

export default function MapPreviewClient(props: {
  lat: number;
  lng: number;
  title: string;
}) {
  return <MapPreview {...props} />;
}
