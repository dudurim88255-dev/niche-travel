// Phase 10-fix: 30장 카드 이미지 추가 압축 (Phase 7 q=82/60 → q=78/55).
//   백업본을 만들고, 백업본을 입력으로 사용해 누적 손실 방지(재실행 안전).
//   840x1120 (모바일 max-w 420의 2x retina, fit:cover). Phase 7 max 1200px에서 더 축소.

import { readFile, writeFile, copyFile, readdir, stat, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "..", "public", "destinations");
const TARGET_WIDTH = 840;
const TARGET_HEIGHT = 1120;
const JPEG_QUALITY = 78;
const AVIF_QUALITY = 55;

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const entries = await readdir(SRC_DIR);
  const ids = entries
    .filter((f) => /^\d+\.jpg$/.test(f))
    .map((f) => Number.parseInt(f, 10))
    .sort((a, b) => a - b);

  let totalBefore = 0;
  let totalAfter = 0;
  let totalAvifBefore = 0;
  let totalAvifAfter = 0;

  for (const id of ids) {
    const jpgPath = path.join(SRC_DIR, `${id}.jpg`);
    const avifPath = path.join(SRC_DIR, `${id}.avif`);
    const backupJpg = path.join(SRC_DIR, `${id}.backup.jpg`);

    // 백업 한 번만 생성 (재실행 시 덮어쓰지 않음 → 원본 보존)
    if (!(await exists(backupJpg))) {
      await copyFile(jpgPath, backupJpg);
    }

    const beforeJpg = (await stat(jpgPath)).size;
    const beforeAvif = (await exists(avifPath)) ? (await stat(avifPath)).size : 0;
    totalBefore += beforeJpg;
    totalAvifBefore += beforeAvif;

    // 백업본을 소스로 사용
    const buf = await readFile(backupJpg);

    const jpegBuf = await sharp(buf)
      .rotate()
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover", position: "center" })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();
    await writeFile(jpgPath, jpegBuf);

    const avifBuf = await sharp(buf)
      .rotate()
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover", position: "center" })
      .avif({ quality: AVIF_QUALITY, effort: 5 })
      .toBuffer();
    await writeFile(avifPath, avifBuf);

    const afterJpg = jpegBuf.length;
    const afterAvif = avifBuf.length;
    totalAfter += afterJpg;
    totalAvifAfter += afterAvif;

    console.log(
      `${String(id).padStart(2)}: ` +
        `JPEG ${(beforeJpg / 1024).toFixed(0).padStart(4)} → ${(afterJpg / 1024).toFixed(0).padStart(4)} KB  ` +
        `AVIF ${(beforeAvif / 1024).toFixed(0).padStart(4)} → ${(afterAvif / 1024).toFixed(0).padStart(4)} KB`
    );
  }

  console.log(
    `\n총 JPEG: ${(totalBefore / 1024 / 1024).toFixed(2)} → ${(totalAfter / 1024 / 1024).toFixed(2)} MB  (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}% 감소)`
  );
  console.log(
    `총 AVIF: ${(totalAvifBefore / 1024 / 1024).toFixed(2)} → ${(totalAvifAfter / 1024 / 1024).toFixed(2)} MB  (${(((totalAvifBefore - totalAvifAfter) / totalAvifBefore) * 100).toFixed(1)}% 감소)`
  );
  console.log(`백업본: public/destinations/*.backup.jpg (${ids.length}개, .gitignore 권장)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
