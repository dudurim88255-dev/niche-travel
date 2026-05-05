// 원본 Index.tsx 11~16 (icon 패치) + 372~401 (MapContainer/Marker/Popup) 1:1 이식.
// 'use client' + dynamic({ssr:false}) 대상 — window 객체에 의존하므로 SSR 절대 금지.

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { CATEGORIES, type Destination } from "@/data/destinations";

// Leaflet 기본 마커 아이콘 경로 패치 (Next 번들에서는 자동 해석 안됨)
const DefaultIcon = L.Icon.Default.prototype as unknown as {
  _getIconUrl?: unknown;
};
delete DefaultIcon._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const FONT = "'Noto Sans KR', sans-serif";

export function MapView({
  saved,
  mapCenter,
  mapZoom,
}: {
  saved: Destination[];
  mapCenter: [number, number];
  mapZoom: number;
}) {
  return (
    <MapContainer
      key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: 300, width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {saved.map((d) => {
        const catObj = CATEGORIES.find((c) => c.id === d.cat)!;
        return (
          <Marker key={d.id} position={[d.lat, d.lng]}>
            <Popup>
              <div style={{ fontFamily: FONT, minWidth: 160 }}>
                <strong style={{ fontSize: 14 }}>
                  {catObj.emoji} {d.title}
                </strong>
                <br />
                <span style={{ fontSize: 12, color: "#5a5346" }}>
                  📍 {d.location}
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
