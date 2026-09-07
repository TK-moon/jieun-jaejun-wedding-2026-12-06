# 지은 · 재준 모바일 청첩장

2026년 12월 6일 14:00 예식을 위한 모바일 청첩장입니다. **ivory × sky** 톤의 항공권·보딩패스 콘셉트로 예식 정보, 지도 링크, 연락·계좌 안내를 한 페이지에 담습니다.

우선 대응은 모바일 브라우저이며, 태블릿·데스크톱도 같은 레이아웃으로 확장합니다. **방명록·RSVP·카카오페이 송금**은 범위에 포함하지 않습니다.

**배포 주소:** [지은 · 재준 모바일 청첩장](https://tk-moon.github.io/jieun-jaejun-wedding-2026-12-06/)

기획 방향은 [`PLANNING.md`](./PLANNING.md), 코드 규칙은 [`AGENTS.md`](./AGENTS.md)를 참고합니다. 기획 문서의 일부 구현 현황은 이전 상태이므로, 현재 반영 내용은 아래와 실제 코드를 기준으로 확인합니다.

## 시작하기

Node.js 22와 npm을 사용합니다. 배포 CI도 Node.js 22에서 실행합니다.

```bash
npm ci
npm run dev
```

| 스크립트               | 설명                                  |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | 개발 서버                             |
| `npm run build`        | 타입 체크 + 프로덕션 빌드             |
| `npm run preview`      | `npm run build` 후 빌드 결과 미리보기 |
| `npm run lint`         | ESLint 검사 (경고도 실패 처리)        |
| `npm run lint:fix`     | ESLint 자동 수정                      |
| `npm run format`       | Prettier 포맷 적용                    |
| `npm run format:check` | Prettier 포맷 검사                    |
| `npm run check`        | format 검사 + lint + build            |

## 배포

GitHub Pages와 [배포 워크플로](./.github/workflows/deploy-pages.yml)를 사용합니다. `main` 브랜치에 push하거나 `main`을 선택해 워크플로를 수동 실행하면, `npm ci` → 포맷 검사 → lint → build를 거쳐 `dist/`를 배포합니다. 검사나 빌드가 실패하면 배포하지 않습니다.

`vite.config.ts`의 `base`는 개발 서버에서 `/`, 프로덕션 빌드와 미리보기에서 `/jieun-jaejun-wedding-2026-12-06/`입니다. `BrowserRouter`의 `basename`도 `import.meta.env.BASE_URL`을 사용해 리소스 경로와 페이지 경로를 일치시킵니다. `npm run preview`에서는 `http://localhost:4173/jieun-jaejun-wedding-2026-12-06/`로 확인합니다.

빌드 시 `dist/gallery/index.html`도 생성하므로 GitHub Pages에서 `/jieun-jaejun-wedding-2026-12-06/gallery/`를 직접 열거나 새로고침할 수 있습니다.

## 기술 스택

- **React 19** + **TypeScript** + **Vite 8**
- 스타일: **CSS Modules**, PostCSS (`postcss-custom-media`)
- 모션: **Motion** (`motion/react`)
- 날짜: **dayjs** (Asia/Seoul)
- 아이콘: Font Awesome (regular)
- 폰트: Cormorant Garamond·Noto Serif KR(Google Fonts 로드), Pretendard·시스템 폰트(스택, Pretendard 별도 로드 없음)
- 품질: ESLint, Prettier

### 구조

```
src/
  sections/     Banner → Greeting → Ticket → Contact (+ Footer)
  components/   SectionTitle, Modal, Toast, MapLink, icons…
  constants/    WEDDING_INFO (예식·인물·계좌 — 하드코딩 금지)
  hooks/        카카오 인앱, 카운트다운, IntersectionObserver, Toast…
  lib/          clipboard, dayjs
```

### 현재 구현 상태

아래는 현재 코드 기준이며, 콘텐츠 최종 확정이나 모바일 실기기 검증 완료를 뜻하지 않습니다.

- **구현:** 예식 카운트다운, ICS 일정 파일 다운로드, 주소·계좌 복사와 토스트, 네이버·카카오맵 링크, 전화·문자 링크, 계좌 모달, 카카오톡 인앱에서 외부 브라우저 열기 시도.
- **콘텐츠 반영:** 배너 이미지(`main.jpg`)·문구, 초대 인사말, 신랑·신부 계좌 및 신랑측 아버지·어머니 / 신부측 어머니 계좌. 신부측 아버지 계좌는 등록되어 있지 않아 계좌 버튼을 표시하지 않습니다.
- **플레이스홀더:** 신랑·신부·양가 부모님 전화번호 6곳은 모두 `010-0000-0000`입니다.
- **미구현·미연결:** 갤러리, 교통·주차 안내, 공유 UI, `og:image`·`twitter:image`, 파비콘 연결. `public/favicon.svg` 파일은 있지만 `index.html`에 연결되어 있지 않습니다. OG·Twitter 제목과 설명 메타는 이미 설정되어 있습니다.

예식·인물·계좌 정보는 `src/constants/index.ts`의 `WEDDING_INFO`, 배너 이미지·문구는 `BannerSection`, 인사말은 `GreetingSection/Messages`, 제작자·저작권 문구는 `FooterSection/_constants`에서 관리합니다. HTML 제목·설명·공유 메타는 `index.html`에 별도로 있어 예식 정보를 바꿀 때 함께 확인해야 합니다.

## 보안 · 개인정보

청첩장은 공개 URL이면 연락처·계좌가 **사실상 공개 정보**입니다. 아래는 노출을 줄이고 안전하게 쓰기 위한 처리입니다.

- **검색 제외**: `index.html`의 `noindex`/`nofollow`/`nosnippet`/`noimageindex`. Googlebot·Bingbot·Yeti는 HTML을 읽어 이 지시문을 확인할 수 있게 허용합니다. 실제 색인 제거 여부는 검색엔진에서 별도로 확인해야 합니다.
- **AI 수집 억제**: 현재 프로젝트 Pages의 유효한 정책은 도메인 루트의 [`robots.txt`](https://tk-moon.github.io/robots.txt)입니다. 원본은 별도 저장소의 [`robots.txt`](https://github.com/TK-moon/tk-moon.github.io/blob/main/robots.txt)에서 관리·배포합니다. 청첩장 경로만 대상으로 AI 봇·기타 크롤러에 수집 금지를 요청합니다. 이 프로젝트를 배포해도 루트 정책은 자동 갱신되지 않습니다.
- **하위 경로 robots.txt**: `public/robots.txt`는 향후 독립 도메인의 루트에 배포할 때 사용하는 정책입니다. 현재 `/jieun-jaejun-wedding-2026-12-06/robots.txt`는 표준 크롤러의 정책 위치가 아닙니다.
- **차단 한계**: robots.txt는 접근 제어가 아닙니다. 규칙을 무시하는 수집기나 사용자가 요청한 AI 접근까지 보장하지 않으며, `noai`/`noimageai`는 보조 신호입니다. 공개 저장소·Git 기록·JavaScript에 포함된 계좌는 계속 직접 접근할 수 있습니다.
- **호스팅 제약**: 현재 저장소와 배포 사이트는 공개 상태입니다. [GitHub 공식 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)에 따르면 GitHub Free의 Pages는 공개 저장소에서 사용할 수 있습니다. 원본 비공개와 실제 접근 통제가 필요하면 비공개 저장소를 지원하는 플랜·호스팅과 사이트 인증을 각각 검토해야 합니다.
- **CSP**: 프로덕션 빌드에 CSP 메타를 삽입해 스크립트·통신을 같은 출처로 제한하고, 외부 리소스는 기존 Google Fonts만 허용합니다. 인라인 스타일은 React·모션에 필요해 허용합니다. `frame-ancestors`는 메타로 적용할 수 없으며 프레임 삽입 차단까지 구현한 것은 아닙니다.
- **소스맵·환경 파일**: 프로덕션 소스맵 생성을 명시적으로 끄고 `.env`·`.env.*`를 Git에서 제외합니다. 프런트엔드 환경 변수에 넣은 값도 번들에 포함될 수 있으므로 비밀 저장소로 사용하지 않습니다.
- **Referrer**: 외부 폰트 요청보다 먼저 `referrer=no-referrer`를 선언해 리소스 요청과 외부 이동 시 레퍼러 유출을 줄입니다.
- **외부 링크**: 지도 등은 `rel="noreferrer"` / `noopener`로 엽니다.
- **클립보드**: `window.isSecureContext` + Clipboard API가 있을 때만 복사 UI를 제공합니다.
- **카카오톡 인앱**: User-Agent에 `KAKAOTALK`이 있으면 외부 브라우저 열기를 요청하고, 100ms 뒤 인앱 브라우저 닫기를 시도합니다. 실제 전환 성공 여부를 감지하는 처리는 없어 OS·앱 버전에 따른 실기기 확인이 필요합니다.
- **데이터 원칙**: 전화번호·계좌는 당사자 동의 범위만 `WEDDING_INFO`에 둡니다. 공개 저장소·배포·Git 기록에 남을 수 있음을 전제로 합니다. 운영용 키는 프런트에 넣지 않습니다.
- **계좌 UI**: `ContactSection` 모달에서 표시하고, 복사 성공·실패를 토스트로 안내합니다.

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

- 스타일은 컴포넌트 옆 `*.module.css`. 전역은 `index.css`의 토큰·리셋·기본 요소·접근성 설정.
- 시맨틱 HTML 우선 (`section`, `dl`/`dt`/`dd`, `address` 등). 아이콘 전용 버튼은 `aria-label` 필수.
- 연락 동작은 `전화`·`문자`·`계좌` 텍스트 링크/버튼이며, 최소 높이는 44px입니다.
- `prefers-reduced-motion`을 존중합니다.
