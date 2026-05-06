# 니치 트래블 (niche-travel)

남들이 안 가는 곳, 진짜 일상에 닿는 여행을 큐레이션하는 모바일 우선 웹앱.
9가지 테마 카테고리(마트 어택 / 책 스케이프 / 산악 바이브 / 스킬 시커 / 콰이어트케이션 / 로드트립 / 팬덤 스포츠 / 뷰티 트래블)로 분류된 30개 여행지를 카드 스와이프 방식으로 탐색하고, 좋아요/저장으로 내 지도에 핀을 꽂고, 주간 일정/얼리버드 추천/관심사 동행 찾기까지 한 화면에서 정리한다.
모든 사용자 데이터는 `localStorage`에 저장되며 (`nt:` prefix), 서버 인증은 사용하지 않는다.

## 배포

- **운영(예정)**: https://niche-travel.vercel.app — Vercel 무료 플랜 + ICN1 리전
- 도메인 구매 후 별도 마이그레이션 예정

## 스택

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS v4** (CSS 변수 기반 디자인 토큰), **shadcn/ui** (radix 베이스)
- **react-leaflet** (저장 여행지 지도), **lucide-react** (아이콘), **date-fns** (날짜)
- **react-markdown + remark-gfm + rehype-slug** (매거진 본문 렌더)
- **gray-matter** (블로그 frontmatter 파서)
- **Noto Sans KR** (Google Fonts) + **Geist Mono**
- **sharp** (PWA 아이콘 빌드 — devDependency)

## 라우트

| 경로 | 설명 |
|---|---|
| `/` | 카드 스와이프 탐색 (30개 여행지, 9 카테고리 필터) |
| `/map` | 저장 여행지 Leaflet 지도 + 카드 리스트 |
| `/schedule` | 주간 캘린더 + 얼리버드 추천 + 동행 찾기 + 월간 모달 |
| `/blog` | 매거진 목록 (5편) |
| `/blog/{slug}` | 매거진 상세 (5편 SSG, 메타/OG/Twitter) |
| `/manifest.webmanifest` | PWA 매니페스트 |
| `/sitemap.xml`, `/robots.txt` | SEO |

## 디렉토리 구조

```
app/
  (mobile)/                # 모바일 셸 (MobileFrame + BottomNav)
    page.tsx               # 탐색
    map/page.tsx
    schedule/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx   # SSG
  layout.tsx               # 루트 (next/font, Toaster, metadata)
  manifest.ts, sitemap.ts, robots.ts
components/
  schedule/                # MiniCalendar, FullCalendarModal, WeekCalendar,
                           # MorningBlock, CompanionFinder, EveningBlock, ScheduleTab
  map/                     # MapView (Leaflet, dynamic ssr:false), MapTab
  ui/                      # shadcn (button/card/dialog/input/sonner/badge)
  CategoryPill, DestinationCard, BottomNav, MobileFrame, DDayBadge, BootstrapClient
content/blog/              # 매거진 5편 (.md, frontmatter)
data/                      # destinations.ts (30), companions.ts (8)
lib/                       # storage, share, blog, schedule, utils
public/destinations/       # 여행지 이미지 30장
public/assets/             # 매거진 hero 이미지 5장
public/icons/              # PWA 아이콘 (192/512/512-maskable)
scripts/                   # fetch-images.mjs, generate-icons.mjs
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 환경변수 (선택 — .env.example 참고)
cp .env.example .env.local

# 개발 서버
npm run dev          # http://localhost:3000

# 프로덕션 빌드 + 로컬 실행
npm run build
npm run start

# 린트
npm run lint
```

## 환경변수

| 키 | 용도 | 기본값 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | sitemap/robots/OG 이미지의 base URL | `https://niche-travel.app` (lib 폴백) |

## 디자인 시스템

`DESIGN.md` 참조. 모든 토큰은 `app/globals.css`의 CSS 변수로 정의되고, Tailwind v4 `@theme inline`을 통해 클래스로 노출된다.

- 모바일 컨테이너: `class="container-mobile"` (max-width 420px)
- 카테고리 색상: `text-cat-mart`, `bg-cat-book` 등 (9색)

## 사용자 데이터 (localStorage)

| 키 | 형식 | 용도 |
|---|---|---|
| `nt:saved` | `number[]` | 저장한 여행지 id |
| `nt:liked` | `number[]` | 좋아요 id |
| `nt:schedule` | `Record<YYYY-MM-DD, string[]>` | 일정 메모 |
| `nt:companion-profile` | `{nickname, style, intro, interests[]}` | 동행 프로필 |
| `nt:companion-optin` | `boolean` | 동행 찾기 참여 여부 |
| `nt:companion-requested` | `number[]` | 동행 신청한 id |
| `nt:device-id` | `UUID` | 익명 디바이스 식별자 |

`lib/storage.ts`에 `exportAll()`/`importAll()` 헬퍼가 준비되어 있다 (UI는 추후 추가 예정).

## 라이선스

Private (개인 프로젝트). 외부 공개 시 라이선스 별도 결정.

## 참고

- Atoms 원본 → Next 16으로 1:1 이식 (디자인 변경 0)
- 단일 진실 원천: `data/destinations.ts` (30개), `data/companions.ts` (8명)
- Next 16 변경사항은 `node_modules/next/dist/docs/` 참조
