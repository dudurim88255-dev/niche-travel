# SESSION_STATE — niche-travel

> 세션 시작 시 반드시 읽기. "미검증 가정" 항목이 있으면 코드 작업 전에 먼저 검증.

## 현재 상태

- **HEAD**: `b4df227` (feat: phase 5 magazine + seo)
- **마지막 작업일**: 2026-05-06
- **상태**: Phase 6 배포 준비 단계 — Vercel 배포는 사용자가 직접 트리거 예정

## 완료된 Phase

| Phase | 커밋 | 핵심 |
|---|---|---|
| 0 | `6336453` | Next 16 + shadcn 스캐폴딩, 디자인 토큰 |
| 1 | `c6ee602` | 30 여행지 + 9 카테고리 + 단일 카드 스와이프 탐색 |
| 2 | `67ff66a` | 라우트 분리, /map (Leaflet), /schedule (7컴포넌트), 동행 찾기 |
| 3-A + 4 | `c37495e` | device-id, exportAll/importAll, D-Day 배지, share.ts, PWA(manifest+아이콘+meta) |
| 5 | `b4df227` | 매거진 5편 SSG, sitemap/robots, BottomNav 매거진 통합 |
| 6 | (이 커밋) | 배포 설정 (vercel.json, .env.example, README, SESSION_STATE) |

## 보류된 Phase

### Phase 3-B (서버 인증 + 데이터 동기화) — 사용자 데이터 보존 필요 시점에 재개
- NextAuth + Upstash Redis (또는 다른 KV)
- localStorage → 서버 마이그레이션 시 `lib/storage.ts`의 `exportAll()` / `importAll()` 헬퍼를 활용
- device-id (`nt:device-id`)는 이미 Phase 3-A에서 발급되어 있어 익명→로그인 연결 키로 사용 가능

## 다음 작업 후보

1. **이미지 최적화** (성능 효과 큼)
   - `public/destinations/*.jpg` 30장 (~60MB) → sharp + AVIF/WebP로 ~5MB
   - `public/assets/*-hero.jpg` 5장 (~9.5MB) → 동일 처리, LCP 개선
   - 매거진 hero에 `next/image` 적용 검토 (지금은 native `<img>` + CSS background)

2. **Google Search Console 등록**
   - 배포 URL 확정 후 sitemap.xml 제출
   - `<meta name="google-site-verification">` 추가 필요 시 layout.tsx에

3. **Phase 3-B 시점 결정**
   - 트리거: 사용자 디바이스 변경/브라우저 데이터 삭제 시 데이터 손실 보고 들어올 때
   - 그 전까지는 localStorage 단독으로 충분

4. **도메인 구매 + Stage 2 마이그레이션**
   - Vercel 무료 서브도메인(.vercel.app) → 자체 도메인
   - DNS 설정 후 `NEXT_PUBLIC_SITE_URL` 갱신 → sitemap/OG 자동 반영

5. **매거진 보강** (선택)
   - 신규 글 추가는 `content/blog/*.md` 파일 추가만으로 SSG 자동 등록
   - frontmatter에 `date` 필드 추가하면 정렬 키 변경 가능

## 알려진 한계 / 미검증 가정

### 한계 (의도된 설계)
- **localStorage 단독 운영**: 시크릿 모드, 다른 브라우저, OS 재설치 시 데이터 분리. Phase 3-B에서 해결.
- **동행 매칭은 더미 8명 기반**: `data/companions.ts`. 실제 유저 매칭 X (데모 UI).
- **이미지 사이즈**: 여행지 30장 평균 2MB, 매거진 hero 평균 1.9MB. 모바일 LCP에 영향 가능.
- **PWA 아이콘 임시 디자인**: 흰 "여행" 텍스트 + #FF6B35 배경. 정식 로고 확정 후 교체.
- **다크 모드 토글 UI 없음**: 토큰은 정의되어 있지만 토글 스위치는 미구현.

### 미검증 가정 (브라우저/디바이스 검증 필요)
- iOS Safari "홈 화면에 추가" → 풀스크린, 상태바 #FF6B35 — 코드 상으론 정상이나 실기 미확인
- Android Chrome "앱 설치" 프롬프트 — 미확인
- Lighthouse 점수 (Performance/SEO/PWA/Accessibility) — 로컬 미실행
- 실제 모바일 디바이스에서 카드 세로 스와이프 동작 — 데스크탑 마우스 안 됨
- D-Day 배지 시각적 균형 (오늘 날짜에 메모 추가 후 "D-DAY" 노출) — SSR HTML로는 메모 0개라 미확인
- `/?dest=5` 진입 후 5번 카드 자동 정렬 — hydrate 후 동작이라 SSR 검증 불가
- iOS 16+ Safari `navigator.share` 동작 vs clipboard fallback 분기 — 실기 필요

### 검증 통과 사항 (증거 있음)
- 빌드 성공: 10 라우트 + manifest/sitemap/robots prerender, 5편 SSG (`.next/server/app/blog/*.html`)
- TypeScript 통과
- 모든 라우트 dev 서버 200 OK
- /sitemap.xml 9 url 노드, /robots.txt User-Agent + Sitemap
- /manifest.webmanifest application/manifest+json (한글 name 포함)
- 메타 태그 SSR 노출: theme-color/manifest/apple-touch-icon/apple-mobile-web-app-capable

## 다음 세션 시작 시 먼저 확인할 것

1. **`git log --oneline -5`** — HEAD가 `b4df227` 이후인지, 푸시되었는지
2. **`git remote -v`** — origin 추가됐는지
3. **Vercel 배포 URL** — 사용자가 알려주면 README/.env.example/SESSION_STATE 일괄 갱신
4. **`npm run build`** — 새 의존성 추가 후라면 재빌드해서 회귀 없는지 확인
5. **사용자가 보고한 시각 차이** — 모바일/데스크탑 실측 결과 있다면 우선 처리 (디자인 변경 금지 원칙)

## 운영 절차 메모

- 매거진 신규 글: `content/blog/{slug}.md` 추가 + `public/assets/{slug}-hero.jpg` 추가 → 자동 SSG
- 여행지 추가: `data/destinations.ts` + `public/destinations/{id}.jpg`
- 동행 추가: `data/companions.ts`
- 카테고리 추가: `data/destinations.ts` CATEGORIES + `app/globals.css`의 `--cat-*` 토큰 + Phase 0 DESIGN.md 갱신
