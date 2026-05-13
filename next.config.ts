import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // 홈 디렉토리에 다른 package-lock.json이 있어도 워크스페이스 루트를 이 폴더로 고정
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Phase 10-fix: 이미지 캐시 정책 — 30일. Vercel CDN이 변환본을 오래 보존해
  // 첫 방문자마다 재변환되는 LCP 페널티 제거. native <img> + <picture> 환경이라
  // next/image device/imageSizes는 미사용이지만 향후 확장 대비.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 96, 128, 256, 420],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
