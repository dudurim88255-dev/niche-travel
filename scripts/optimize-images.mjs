// Phase 7-3: 이미지 최적화.
// destinations 30장(.jpg 확장자지만 실제 PNG 데이터) → 진짜 JPEG q=82 + AVIF q=60, max 1200px
// blog hero 5장(.jpg) → max 1600px (매거진은 데스크탑에서도 크게 노출 가능)
// 원본 덮어쓰기 + .avif 추가 생성.

import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const TARGETS = [
  { dir: path.join(ROOT, "public", "destinations"), maxWidth: 1200 },
  { dir: path.join(ROOT, "public", "assets"), maxWidth: 1600 },
];

const JPEG_QUALITY = 82;
const AVIF_QUALITY = 60;

async function processOne(filePath, maxWidth) {
  const baseName = path.basename(filePath, path.extname(filePath));
  const dirName = path.dirname(filePath);
  const avifPath = path.join(dirName, `${baseName}.avif`);

  const orig = await readFile(filePath);
  const origMeta = await sharp(orig).metadata();

  // 원본 데이터로 JPEG / AVIF 두 번 인코드
  const jpegBuf = await sharp(orig)
    .rotate() // EXIF orientation 적용
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
  await writeFile(filePath, jpegBuf);

  const avifBuf = await sharp(orig)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .avif({ quality: AVIF_QUALITY, effort: 5 })
    .toBuffer();
  await writeFile(avifPath, avifBuf);

  return {
    name: path.basename(filePath),
    origBytes: orig.length,
    jpegBytes: jpegBuf.length,
    avifBytes: avifBuf.length,
    origDim: `${origMeta.width}x${origMeta.height}`,
  };
}

async function processDir(dir, maxWidth) {
  const entries = await readdir(dir, { withFileTypes: true });
  // 원본 처리만 — .avif는 이번 회차에서 새로 생성하니 input에 포함하지 않음
  const targets = entries
    .filter((e) => e.isFile() && /\.jpe?g$/i.test(e.name))
    .map((e) => path.join(dir, e.name))
    .sort();

  const results = [];
  // 직렬 처리 — sharp 자체 멀티 코어 사용. 동시 처리는 메모리 부담.
  for (const file of targets) {
    try {
      const r = await processOne(file, maxWidth);
      console.log(
        `✓ ${r.name.padEnd(42)} ${r.origDim.padStart(11)} ` +
          `${(r.origBytes / 1024).toFixed(0).padStart(5)} KB → ` +
          `JPEG ${(r.jpegBytes / 1024).toFixed(0).padStart(4)} KB / ` +
          `AVIF ${(r.avifBytes / 1024).toFixed(0).padStart(4)} KB`
      );
      results.push(r);
    } catch (e) {
      console.warn(`✗ ${path.basename(file)}: ${e.message}`);
    }
  }
  return results;
}

async function dirSize(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let total = 0;
  for (const e of entries) {
    if (e.isFile()) {
      const s = await stat(path.join(dir, e.name));
      total += s.size;
    }
  }
  return total;
}

async function main() {
  for (const { dir, maxWidth } of TARGETS) {
    const before = await dirSize(dir);
    console.log(`\n━━━ ${path.relative(ROOT, dir)} (max ${maxWidth}px) ━━━`);
    console.log(`Before: ${(before / 1024 / 1024).toFixed(1)} MB`);
    const results = await processDir(dir, maxWidth);
    const after = await dirSize(dir);
    console.log(
      `After:  ${(after / 1024 / 1024).toFixed(1)} MB (${results.length} 파일 × 2포맷)`
    );
    const reduction = ((1 - after / before) * 100).toFixed(0);
    console.log(`Reduction: ${reduction}%`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
