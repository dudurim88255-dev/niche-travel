// Atoms 원본 mgx CDN 이미지 30개를 public/destinations/{id}.jpg로 다운로드.
// 실패 시 1x1 placeholder JPEG로 대체.
// 원본 데이터는 PNG지만 사용자 지정 경로가 .jpg이므로 확장자는 .jpg로 저장
// (브라우저는 magic bytes로 디코드하므로 동작에 문제 없음).

import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "destinations");

const PREFIX =
  "https://mgx-backend-cdn.metadl.com/generate/images/992470/2026-03-31/";

const URLS = {
  1: PREFIX + "b68de58c-4aea-461a-8541-80d457427fd3.png",
  2: PREFIX + "7a5e8435-edec-4bdf-9f95-4284c5b07f50.png",
  3: PREFIX + "be920666-8fcb-4762-b033-bf9aa0bd52d4.png",
  4: PREFIX + "a6ae8e8c-e062-446c-969a-c9049fd0d366.png",
  5: PREFIX + "61d7a60e-bedf-4dc0-a7f2-4937ce4b2f02.png",
  6: PREFIX + "c5dea59a-da63-49da-8b4d-5c0b2784aaa6.png",
  7: PREFIX + "44eeba4a-07ce-4eaa-add6-87b5ddd66434.png",
  8: PREFIX + "fc36067a-9015-4c0c-88f7-2eafd60cd298.png",
  9: PREFIX + "445ac15a-dc08-4159-98d1-dc76d610ff3e.png",
  10: PREFIX + "444e7db5-0db0-41dd-b6f6-f5cf0a37e279.png",
  11: PREFIX + "b53c23c3-17a1-40c0-87e7-bac05aa88cac.png",
  12: PREFIX + "1244be31-4a27-4916-8080-aa2e2c35cf16.png",
  13: PREFIX + "76dbfd0b-98a3-4785-97ad-72dbe9d5c38e.png",
  14: PREFIX + "ecaa6868-d035-4a6e-96aa-d288354d8f84.png",
  15: PREFIX + "c49c80f5-b042-4f22-85e5-10f2aac57527.png",
  16: PREFIX + "09034be4-84c8-4aa6-afb9-58aa59838d7a.png",
  17: PREFIX + "32dfc6bf-91e2-4e2b-82c0-dbcd43f29a0d.png",
  18: PREFIX + "b4af8d33-9bb1-4e23-bfc2-8756508d6b1d.png",
  19: PREFIX + "a5813d87-2718-412c-bddc-f035bfd737d1.png",
  20: PREFIX + "07272294-ef1f-41f4-a07e-8a3f48e143ba.png",
  21: PREFIX + "f9cacfb2-d6a0-49c1-b1a2-2f4877dc70ef.png",
  22: PREFIX + "edbbe85d-8860-4a20-8efe-dd76c6c6e926.png",
  23: PREFIX + "e2b0ff4e-58e5-46ee-b94b-05cad45a674d.png",
  24: PREFIX + "03ab80e4-78bf-43ec-8b7e-33bb7d235cd6.png",
  25: PREFIX + "df93bd56-6bb0-4df6-9f1f-2e7b4a2ccc73.png",
  26: PREFIX + "8093e927-3c90-4d91-becf-057d32124af0.png",
  27: PREFIX + "a1264140-2827-4ad4-82e0-9ec4496cafd5.png",
  28: PREFIX + "eae8c5b1-a4e5-46ec-83fe-4993614f1d3a.png",
  29: PREFIX + "1068b90c-ed34-45be-8202-07c0c9778263.png",
  30: PREFIX + "1d015789-0b2f-408f-980d-17fa4a8269f9.png",
};

// 1x1 베이지(#FAF7F2) JPEG placeholder
const PLACEHOLDER = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AFEQEDEQH/xAAUAAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKp4P//Z",
  "base64"
);

async function fileExists(p) {
  try {
    const s = await stat(p);
    return s.size > 0;
  } catch {
    return false;
  }
}

async function fetchOne(id, url) {
  const dest = path.join(OUT_DIR, `${id}.jpg`);
  if (await fileExists(dest)) {
    console.log(`= ${id}.jpg (already exists)`);
    return "skip";
  }
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) throw new Error(`too small (${buf.length} bytes)`);
    await writeFile(dest, buf);
    console.log(`✓ ${id}.jpg (${(buf.length / 1024).toFixed(0)} KB)`);
    return "ok";
  } catch (e) {
    await writeFile(dest, PLACEHOLDER);
    console.warn(`✗ ${id}.jpg → placeholder (${e.message})`);
    return "fail";
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const counts = { ok: 0, skip: 0, fail: 0 };
  // 동시 4개씩 처리 (CDN 부담 줄이기)
  const ids = Object.keys(URLS).map(Number).sort((a, b) => a - b);
  const concurrency = 4;
  for (let i = 0; i < ids.length; i += concurrency) {
    const batch = ids.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map((id) => fetchOne(id, URLS[id]))
    );
    for (const r of results) counts[r]++;
  }
  console.log(
    `\nDone. ok=${counts.ok}, skip=${counts.skip}, fail=${counts.fail}, total=${ids.length}`
  );
  if (counts.fail > 0) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
