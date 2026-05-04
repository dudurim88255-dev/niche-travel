import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // 홈 디렉토리에 다른 package-lock.json이 있어도 워크스페이스 루트를 이 폴더로 고정
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
