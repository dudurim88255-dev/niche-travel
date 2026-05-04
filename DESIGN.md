# 니치 트래블 디자인 시스템

Atoms에서 export한 원본 토큰을 그대로 옮긴 단일 진실 원천(Single Source of Truth).
모든 값은 `app/globals.css`의 CSS 변수로 정의되어 있다.

## 베이스 컬러

| 토큰 | Light | Dark |
|---|---|---|
| `--background` | `#FAF7F2` (베이지) | `#1A1816` |
| `--foreground` | `#2C2825` | `#FAF7F2` |
| `--primary` | `#FF6B35` (오렌지) | `#FF6B35` |
| `--muted-foreground` | `#8A8478` | `#A8A195` |
| `--border` | `#E8E3DB` | `#3A3530` |
| `--card` | `#FFFFFF` | `#25221F` |

## 카테고리 9색

`text-cat-*`, `bg-cat-*`, `border-cat-*`로 사용. 카테고리 정의:

| 키 | 라벨 | HEX |
|---|---|---|
| `cat-mart` | 마트 | `#FF6B35` |
| `cat-book` | 책 | `#7C4DFF` |
| `cat-mountain` | 산 | `#2E7D32` |
| `cat-skill` | 스킬 | `#00897B` |
| `cat-quiet` | 콰이어트 | `#5C6BC0` |
| `cat-road` | 로드 | `#E65100` |
| `cat-sport` | 스포츠 | `#C62828` |
| `cat-beauty` | 뷰티 | `#AD1457` |
| `cat-default` | 기본 | `#8A8478` |

## 타이포그래피

- **폰트**: Noto Sans KR (Google Fonts, weights: 400/500/700)
- `--font-sans` / `--font-heading`에 동일 폰트 패밀리 적용
- `--font-mono`: Geist Mono (코드/숫자용)

## 레이아웃

- **모바일 우선**: 메인 컨테이너 `max-width: 420px`
  - 사용법: `<div class="container-mobile">...</div>`
- 라디우스: `--radius: 0.625rem` (sm/md/lg/xl/2xl/3xl/4xl 자동 파생)

## 사용 가이드

### CSS 변수 직접 참조

```css
.foo {
  color: var(--foreground);
  background: var(--cat-mart);
}
```

### Tailwind 클래스

```tsx
<div className="bg-background text-foreground border-border">
  <span className="text-primary">FF6B35</span>
  <span className="bg-cat-book/10 text-cat-book">책</span>
</div>
```

### 다크 모드 토글

```tsx
// next-themes 등으로 <html className="dark"> 토글
```

## 변경 시 규칙

- 토큰을 추가하면 `:root`와 `.dark` 양쪽 모두에 정의
- `@theme inline`에 `--color-*` 매핑 추가해야 Tailwind 클래스로 노출됨
- HEX 값은 Atoms 원본을 따른다 — 임의 변경 금지
