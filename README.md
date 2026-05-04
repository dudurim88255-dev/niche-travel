# 니치 트래블 (niche-travel)

남들이 안 가는 곳, 진짜 일상에 닿는 여행을 큐레이션하는 모바일 우선 웹앱.

## 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS 변수 기반 토큰)
- **shadcn/ui** (radix 베이스, slate 베이스 컬러)
- **react-leaflet** (지도)
- **lucide-react** (아이콘)
- **date-fns** (날짜)
- **Noto Sans KR** (Google Fonts)

## 디렉토리 구조

```
app/                # App Router (layout, page, globals.css)
components/ui/      # shadcn/ui 컴포넌트 (button, card, dialog, input, sonner, badge)
lib/utils.ts        # cn() 등 공용 유틸
public/             # 정적 파일
```

## 실행 방법

```bash
# 의존성 설치 (이미 되어 있음)
npm install

# 개발 서버
npm run dev          # http://localhost:3000

# 프로덕션 빌드
npm run build
npm run start

# 린트
npm run lint
```

## 디자인 시스템

`DESIGN.md` 참조. 모든 토큰은 `app/globals.css`의 CSS 변수로 정의되어 있고, Tailwind v4 `@theme inline`을 통해 클래스로 노출된다.

- 모바일 컨테이너: `class="container-mobile"` (max-width 420px)
- 카테고리 색상: `text-cat-mart`, `bg-cat-book` 등 (마트/책/산/스킬/콰이어트/로드/스포츠/뷰티 + default)

## 개발 메모

- `toast` 컴포넌트는 shadcn 최신에서 `sonner`로 통합됨 — `import { toast } from "sonner"`로 사용
- 루트 레이아웃에 `<Toaster />`가 이미 mount되어 있음
- 다크 모드는 `<html>`에 `class="dark"` 추가로 활성화
- Next.js 16 변경사항은 `node_modules/next/dist/docs/`에서 확인
