# 지은 · 재준 모바일 청첩장

2026년 12월 6일 예식을 위한 모바일 청첩장입니다. 밝고 산뜻한 **항공권·보딩패스** 콘셉트로 예식 정보, 오시는 길, 연락·계좌 안내를 한 페이지에 담습니다.

우선 대응은 모바일 브라우저이며, 태블릿·데스크톱도 같은 레이아웃으로 확장합니다. 방명록·RSVP는 범위에 포함하지 않습니다.

## 시작하기

```bash
npm install
npm run dev
```

| 스크립트                  | 설명                       |
| ------------------------- | -------------------------- |
| `npm run dev`             | 개발 서버                  |
| `npm run build`           | 타입 체크 + 프로덕션 빌드  |
| `npm run lint` / `format` | ESLint / Prettier          |
| `npm run check`           | format 검사 + lint + build |

상세 기획은 [`PLANNING.md`](./PLANNING.md), 코드 규칙은 [`AGENTS.md`](./AGENTS.md)를 참고합니다.

## 기술 스택

- **React 19** + **TypeScript** + **Vite 8**
- 스타일: **CSS Modules**, PostCSS (`postcss-custom-media`)
- 모션: **Motion** (`motion/react`)
- 날짜: **dayjs** (타임존)
- 아이콘: Font Awesome
- 폰트: Cormorant Garamond, Noto Serif KR, Pretendard
- 품질: ESLint, Prettier

### 구조

- `src/sections/*` — 화면 섹션 (`Banner` → `Greeting` → `Ticket` → `Contact`, 이후 `Footer`)
- `src/components/*` — 공통 UI (SectionTitle, Modal, Toast, MapLink, icons…)
- `src/constants` — 예식·인물·계좌 등 `WEDDING_INFO` (하드코딩 금지)
- `src/hooks`, `src/lib` — 카카오 인앱 처리, 클립보드, dayjs 등

## 보안 · 개인정보

청첩장은 공개 URL이면 연락처·계좌가 **사실상 공개 정보**입니다. 아래는 노출을 줄이고 안전하게 쓰기 위한 처리입니다.

- **검색·크롤러 차단**: `index.html`에서 `noindex`/`nofollow`/`noarchive` 및 주요 검색·AI 봇 meta. URL을 아는 접근까지 막지는 않습니다.
- **Referrer**: `referrer=no-referrer`로 외부 이동 시 레퍼러 유출을 줄입니다.
- **외부 링크**: 지도 등은 `rel="noreferrer"` / `noopener`로 엽니다.
- **클립보드**: `window.isSecureContext` + Clipboard API가 있을 때만 복사 UI를 제공합니다.
- **카카오톡 인앱**: 인앱 브라우저에서는 외부 브라우저로 유도해 클립보드·지도·전화 동작을 안정화합니다.
- **데이터 원칙**: 전화번호·계좌는 당사자 동의 범위만 `WEDDING_INFO`에 둡니다. 공개 저장소·배포 결과·Git 기록에 남을 수 있음을 전제로 합니다. 운영용 키·관리자 정보는 프런트에 넣지 않습니다.
- **계좌 UI**: 계좌는 모달/접기 형태로 제공하고, 복사 성공·실패를 토스트로 안내합니다.

## 디자인 규칙

방향: **ivory 배경 × sky 액센트** 항공권 티켓. 보라 그라데이션·과도한 글로우·카드 나열은 사용하지 않습니다.

### 토큰 (`src/index.css`)

| 용도     | 변수                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| 면       | `--color-canvas`, `--color-paper`, `--color-paper-raised`, `--color-sky-wash`       |
| 텍스트   | `--color-ink`, `--color-ink-muted`, `--color-ink-subtle`                            |
| 포인트   | `--color-sky`, `--color-sky-deep`, `--color-sky-soft`                               |
| 구분선   | `--color-line`, `--color-line-soft`                                                 |
| 레이아웃 | `--layout-frame-width`, `--layout-inline-padding`, `--layout-section-padding-block` |

섹션 본문 폭은 `--layout-frame-width`를 공통으로 쓰고, 섹션 CSS에 별도 max-width를 두지 않습니다.

### 타이포 위계

1. 섹션 제목 (`SectionTitle` h2) — display, `--color-sky-deep`
2. 선택 라벨 — body, `--color-sky`
3. 구역 소제목 (h3) — body, `--color-sky` (섹션 제목과 경쟁하지 않음)
4. 역할 접두 (신랑/신부 등) — body, `--color-ink-muted`
5. 인명 — display, `--color-sky-deep`
6. 본문·메타 — body, ink 계열

역할/이름 폰트를 뒤집지 않습니다 (serif 역할 + bold sans 이름 금지).

### UI · 접근성

- 스타일은 컴포넌트 옆 `*.module.css`. 전역은 `index.css`의 토큰·리셋만.
- 시맨틱 HTML 우선 (`section`, `dl`/`dt`/`dd`, `address` 등). 아이콘 전용 버튼은 `aria-label` 필수.
- 연락 아이콘 터치 영역 약 44×44px, 글리프 약 20–22px.
- `prefers-reduced-motion`을 존중합니다.
