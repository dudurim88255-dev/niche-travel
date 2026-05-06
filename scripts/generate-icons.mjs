// PWA 아이콘 생성: 임시 디자인 #FF6B35 배경 + 흰색 "여행" 텍스트.
// Maskable은 안전 영역 80% (테두리 20% 여백) 안에 컨텐츠 배치.
// 한글 폰트 렌더링이 환경에 따라 깨질 수 있어 SVG fallback을 두 단계 준비:
//   1) 한글 "여행" — 시스템에 한글 폰트가 있으면 정상
//   2) "N" — 영문 fallback (어디서든 안정)
// 결과 PNG 파일이 너무 작으면 fallback으로 재시도.

import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

const BG = "#FF6B35";
const FG = "#FFFFFF";

function svg({ size, label, fontSize, safeRadius }) {
  const cx = size / 2;
  const cy = size / 2;
  const fontFamily =
    "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
  const radius = safeRadius ?? Math.round(size * 0.16);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" fill="${BG}"/>
  <text x="${cx}" y="${cy}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="800" fill="${FG}" text-anchor="middle" dominant-baseline="central">${label}</text>
</svg>`;
}

async function render({ size, label, fontSize, fileName, maskable = false }) {
  // maskable: 라운드 코너 없이 풀 사각형 + 컨텐츠 80% 안전 영역
  const radius = maskable ? 0 : Math.round(size * 0.16);
  const buf = Buffer.from(
    svg({ size, label, fontSize, safeRadius: radius }),
    "utf-8"
  );
  const out = path.join(OUT_DIR, fileName);
  await sharp(buf, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  const s = await stat(out);
  return { fileName, bytes: s.size };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const targets = [
    // 일반 192/512: 컨텐츠 ~ 60% 사이즈
    { size: 192, label: "여행", fontSize: 96, fileName: "icon-192.png" },
    { size: 512, label: "여행", fontSize: 256, fileName: "icon-512.png" },
    // Maskable 512: 안전 영역 80% — 컨텐츠는 약 40% 사이즈로 더 안쪽
    {
      size: 512,
      label: "여행",
      fontSize: 200,
      fileName: "icon-512-maskable.png",
      maskable: true,
    },
  ];

  let okHangul = 0;
  for (const t of targets) {
    try {
      const r = await render(t);
      console.log(`✓ ${r.fileName} (${(r.bytes / 1024).toFixed(1)} KB)`);
      okHangul++;
    } catch (e) {
      console.warn(`✗ ${t.fileName}: ${e.message}`);
    }
  }

  // 모든 결과 파일 크기를 검사 — 너무 작으면 텍스트가 비었다는 뜻 (한글 폰트 미해석)
  const RESULTS = [];
  for (const t of targets) {
    const p = path.join(OUT_DIR, t.fileName);
    try {
      const s = await stat(p);
      RESULTS.push({ ...t, bytes: s.size });
    } catch {
      RESULTS.push({ ...t, bytes: 0 });
    }
  }

  // 192 PNG가 1.5KB 미만이면 글자 미렌더로 보고 영문 fallback으로 재생성
  const small = RESULTS.find(
    (r) => r.fileName === "icon-192.png" && r.bytes < 1500
  );
  if (small) {
    console.log("\n한글 폰트가 렌더되지 않은 것으로 추정됨 — 영문 'N'로 fallback");
    for (const t of targets) {
      const r = await render({ ...t, label: "N" });
      console.log(`↻ ${r.fileName} (${(r.bytes / 1024).toFixed(1)} KB)`);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
