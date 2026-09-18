# 지은 · 재준 모바일 청첩장

2026년 12월 6일 14:00 예식을 위한 모바일 청첩장입니다. **ivory × sky** 톤의 항공권·보딩패스와 여권 콘셉트로 예식 정보, 사진 갤러리, 연락·계좌 안내, 사진 선물 이벤트를 제공합니다.

모바일을 우선으로 구성하며, 태블릿·데스크톱에서도 같은 콘텐츠를 표시합니다. **방명록·RSVP·카카오페이 송금**은 범위에 포함하지 않습니다.

- **배포 주소:** [지은 · 재준 모바일 청첩장](https://tk-moon.github.io/jieun-jaejun-wedding-2026-12-06/)
- **전체 갤러리:** [우리의 순간](https://tk-moon.github.io/jieun-jaejun-wedding-2026-12-06/gallery/)
- **문서 기준:** 2026-09-18 로컬 소스 코드. 아래의 구현 표시는 코드와 UI 연결 상태를 뜻하며, 배포 반영·실기기 동작·콘텐츠 최종 승인까지 확인했다는 의미는 아닙니다.

기획 방향은 [`PLANNING.md`](./PLANNING.md), 코드 규칙은 [`AGENTS.md`](./AGENTS.md)를 참고합니다. 구현 현황은 이 README와 실제 코드를 기준으로 확인합니다.

## 현재 구현 상태

### 화면과 기능

홈은 **배너 → 초대 인사·가족 소개 → 일시·티켓·지도 → 갤러리 미리보기 → 연락·계좌 → 사진 선물 이벤트 → 감사 인사** 순서입니다. 푸터는 홈과 전체 갤러리에 공통으로 표시합니다.

| 영역                           | 상태                | 구현 내용                                                                             |
| ------------------------------ | ------------------- | ------------------------------------------------------------------------------------- |
| 배너 (`BannerSection`)         | 구현                | 신랑·신부 영문 이름, 예식 날짜·요일, 메인 사진, 예식장명, 문구와 등장 모션            |
| 초대 인사 (`GreetingSection`)  | 구현                | 초대 문구, 양가 가족 소개                                                             |
| 일시·장소 (`TicketSection`)    | 구현                | 날짜·시간·홀·층·주소, 주소 복사, 네이버·카카오맵 길찾기 링크                          |
| 보딩패스                       | 구현                | 신랑·신부 경로, 예식 메타 정보, 절취선·바코드 장식, 화면 진입 모션                    |
| 카운트다운                     | 구현                | 한국 시간 기준 일·시·분·초, 1초 갱신, 예식 시각 도달 시 0과 `Boarded` 표시            |
| 캘린더 추가                    | 구현                | 예식 정보를 담은 ICS 파일 다운로드. 일정 길이는 코드에서 2시간으로 설정               |
| 홈 갤러리 (`GallerySection`)   | 구현                | 사진 5장, 스크롤에 따른 등장 효과, 전체 갤러리 이동 링크                              |
| 전체 갤러리 (`GalleryMain`)    | 구현                | `/gallery` 사진 30장, 썸네일 지연 로딩, 뒤로가기, 사진 크게 보기                      |
| 갤러리 사진 모달               | 구현                | 좌우 스와이프·마우스 드래그·이전/다음 버튼·좌우 방향키, 닫기·Escape·브라우저 뒤로가기 |
| 연락·계좌 (`ContactSection`)   | 구현                | 신랑·신부·양가 부모님 전화/문자 링크, 등록된 계좌 모달·복사, 성공·실패 토스트         |
| 사진 선물 (`PhotoGiftSection`) | 안내·시각 효과 구현 | 여권 내지 2면, 한·영 안내, 사진·서명·도장·점선 일련번호·MRZ 장식, 참여 3단계          |
| 여권 홀로그램                  | 구현                | 카메라 모양 칩 영역의 Canvas 홀로그램, 기기 센서·스크롤·마우스 입력, 센서 권한 안내   |
| 감사 인사 (`ClosingSection`)   | 구현                | `고맙습니다` 제목과 마무리 인사                                                       |
| 푸터 (`FooterSection`)         | 구현                | 제작자 이메일 링크, 콘텐츠 사용 안내, 저작권 문구                                     |
| 공통 UI                        | 구현                | 계좌 모달 포커스 관리·스크롤 잠금·뒤로가기 닫기, 공통 토스트, WebP/JPEG `Picture`     |
| 화면 이동                      | 구현                | React Router 홈/갤러리 라우트, 스크롤 복원, 링크의 View Transition 설정               |
| 카카오톡 인앱 대응             | 전환 시도 구현      | User-Agent 판별 후 외부 브라우저 열기와 인앱 닫기 요청. 전환 성공 감지는 없음         |

### 콘텐츠 반영 상태

| 항목           | 코드 기준 상태                                                             |
| -------------- | -------------------------------------------------------------------------- |
| 예식           | 2026-12-06 14:00, 더메리든 메리든홀 8F, 주소·지도 URL 등록                 |
| 이름·가족 관계 | 신랑·신부 이름, 영문 이름·코드, 양가 부모님, 차남·장녀 표기 등록           |
| 연락처         | 신랑·신부·양가 부모님 6곳에 전화번호 등록                                  |
| 계좌           | 신랑·신부, 신랑측 아버지·어머니, 신부측 어머니의 5개 계좌 등록             |
| 계좌 미등록    | 신부측 아버지. 현재 해당 인물의 계좌 버튼은 표시하지 않음                  |
| 사진           | 배너 사진, 홈 미리보기 5장, 전체 갤러리 30장, 여권에 사용하는 사진 연결    |
| 문구           | 초대 인사, 사진 이벤트 한·영 안내·참여 단계, 감사 인사, 제작자·저작권 반영 |
| HTML 메타      | 제목·설명·작성자·테마 색, OG·Twitter 제목·설명 설정                        |

전화번호와 계좌번호 원문은 README에 중복 기재하지 않습니다. 등록된 정보의 정확성·당사자 동의·최종 문구 승인은 별도로 확인해야 합니다.

### 미구현·미연결

| 항목        | 현재 상태                                                         |
| ----------- | ----------------------------------------------------------------- |
| 공유 이미지 | `og:image`·`twitter:image` 미설정. 제목·설명 메타는 설정되어 있음 |
| 파비콘      | `public/favicon.svg`는 있으나 `index.html`에 연결하지 않음        |

## 주요 기능의 동작 범위

### 갤러리와 이미지 로딩

- 사진 모달은 진행 중인 이동을 새 드래그로 이어받는 연속 스와이프와 첫·마지막 사진의 경계 저항을 처리합니다. 양 끝에서 반대쪽 사진으로 순환하지 않습니다.
- 목록에는 WebP 썸네일과 JPEG 대체 이미지를 사용하고 `loading="lazy"`·`decoding="async"`를 설정합니다. 배너는 우선 로딩합니다.
- 사진 모달에는 긴 변 기준 960·1920·2880px JPEG 변형이 있으며, `dimensions.json`의 가로·세로 비율로 `srcSet`·`sizes`를 구성합니다. 실제 해상도 선택은 브라우저가 수행하며, 모든 화면·DPR에서 원본 수준의 선명도를 보장한다는 의미는 아닙니다.
- 선택 사진을 우선 요청하고 이미지 디코딩 후 표시합니다. 인접 사진은 진입 애니메이션과 드래그·이동이 끝난 유휴 시점에 선로딩하며, `requestIdleCallback`이 없으면 타이머를 사용합니다.
- 사진 로딩 중에는 상태 안내를 표시하며, 로딩 실패 시 오류 안내와 재시도 버튼을 제공합니다.
- 네이티브 `<dialog>`로 배경 상호작용을 막고 스크롤을 잠급니다. 닫힘 애니메이션 이후 dialog·히스토리·포커스를 정리합니다.
- 갤러리 페이지의 뒤로가기는 앱 이동 기록이 있으면 이전 화면으로, 없으면 홈 링크로 이동합니다. 공통 `ScrollRestoration`이 스크롤 복원을 담당합니다.

### 사진 이벤트와 홀로그램

- 여권은 각 면이 `125 / 88` 비율인 두 내지로 구성됩니다. 사진 요청·참여 안내를 표시하며, 사진을 직접 접수하는 폼은 아닙니다.
- 홀로그램은 칩 내부에 한정되며, 표면 패턴과 빛 반사 레이어를 Canvas로 그립니다.
- 유효한 센서 입력이 있으면 **센서 + 스크롤**, 센서가 없고 데스크톱 포인터를 사용할 수 있으면 **마우스 + 스크롤**을 사용합니다. 둘 다 없으면 스크롤 입력으로 반응합니다.
- `devicemotion`을 우선 사용합니다. 센서 입력이 끊기면 대체 모드로 전환하며, 추가 권한 요청 없이 사용할 수 있는 환경에서는 `deviceorientation`도 시도합니다.
- 권한 확인·요청은 `Passport`, 센서 구독·스크롤 입력·렌더링은 `PageTwo/Chip` 아래의 개별 훅에서 관리합니다.
- 권한 요청이 필요한 상태에는 `이벤트 확인하기` 오버레이를 표시하고 버튼 동작에서 권한을 요청합니다. 허용·거부 결과 이후 오버레이를 닫으며, 거부되어도 이벤트 내용을 표시합니다. 데스크톱 포인터·모션 감소 설정에서는 권한 요청을 생략하도록 구현되어 있습니다.
- 해당 섹션이 화면 밖에 있거나 문서가 숨겨지면 센서·스크롤 구독과 렌더링을 멈춥니다. `prefers-reduced-motion`에서는 홀로그램 모션을 비활성화합니다.
- 권한 조회와 시스템 팝업, 센서 중단·복구의 실제 동작은 브라우저·기기·사이트 권한 상태에 따라 확인해야 합니다.

### 연락·계좌·일정

- 전화·문자 URL은 `WEDDING_INFO`의 번호에서 숫자만 추출해 생성합니다.
- 계좌가 등록된 인물에게만 계좌 버튼이 표시됩니다. 은행명·계좌번호 복사에 성공하면 모달을 닫고 토스트를 표시하며, 실패하면 실패 토스트를 표시합니다.
- 주소·계좌 복사 버튼은 보안 컨텍스트와 Clipboard API를 사용할 수 있을 때만 제공합니다. 복사 불가 환경에서도 주소와 계좌 정보는 읽을 수 있습니다.
- 캘린더 버튼은 ICS 다운로드를 실행합니다. 캘린더 앱에 일정을 자동으로 저장하거나 저장 완료를 감지하는 기능은 없습니다.

## 시작하기

Node.js 22와 npm을 사용합니다. 배포 CI도 Node.js 22에서 실행합니다.

```bash
npm ci
npm run dev
```

| 스크립트               | 설명                                                      |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Vite 개발 서버                                            |
| `npm run dev:tunnel`   | `http://127.0.0.1:5173`을 Cloudflare 임시 터널로 노출     |
| `npm run build`        | TypeScript 타입 체크 + 프로덕션 빌드                      |
| `npm run preview`      | 이미 생성된 빌드 결과 미리보기. 먼저 `npm run build` 필요 |
| `npm run lint`         | ESLint 검사. 경고도 실패 처리                             |
| `npm run lint:fix`     | ESLint 자동 수정                                          |
| `npm run format`       | Prettier 포맷 적용                                        |
| `npm run format:check` | Prettier 포맷 검사                                        |
| `npm run check`        | 포맷 검사 + lint + 타입 체크·빌드                         |

휴대전화 개발 접속이 필요하면 개발 서버를 실행한 상태에서 별도 터미널로 `npm run dev:tunnel`을 실행하고 출력된 HTTPS 주소를 엽니다. Vite에는 `.trycloudflare.com` 호스트가 허용되어 있습니다. 터널이 가리키는 포트는 스크립트상 5173으로 고정되어 있습니다.

## 배포와 라우팅

[GitHub Pages 워크플로](./.github/workflows/deploy-pages.yml)는 `main` 브랜치 push 또는 `main`을 선택한 수동 실행 시 `npm ci` → 포맷 검사 → lint → build → `dist/` 배포 순서로 동작하도록 설정되어 있습니다. 검사나 빌드가 실패하면 배포 작업으로 진행하지 않습니다.

| 구분                    | 홈                                                       | 전체 갤러리                                                      |
| ----------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| 개발 서버 기본 주소     | `http://localhost:5173/`                                 | `http://localhost:5173/gallery`                                  |
| 빌드 미리보기 기본 주소 | `http://localhost:4173/jieun-jaejun-wedding-2026-12-06/` | `http://localhost:4173/jieun-jaejun-wedding-2026-12-06/gallery/` |
| Pages 경로              | `/jieun-jaejun-wedding-2026-12-06/`                      | `/jieun-jaejun-wedding-2026-12-06/gallery/`                      |

- [`vite.config.ts`](./vite.config.ts)의 `base`는 개발 서버에서 `/`, 빌드·미리보기에서 `/jieun-jaejun-wedding-2026-12-06/`입니다.
- [`src/main.tsx`](./src/main.tsx)의 `createBrowserRouter`는 `import.meta.env.BASE_URL`을 `basename`으로 사용합니다. 라우트 경로는 [`src/constants/routes.ts`](./src/constants/routes.ts)에 있습니다.
- 빌드 플러그인이 `dist/gallery/index.html`을 생성해 Pages에서 갤러리 직접 접속·새로고침에 대응합니다. 새 라우트를 추가할 때는 해당 정적 진입 HTML 처리도 함께 검토해야 합니다.

## 기술 스택과 구조

`package.json` 기준 React 19, React Router 7, TypeScript 6, Vite 8, Motion 13을 사용합니다.

- 스타일: CSS Modules, PostCSS (`postcss-custom-media`, `@csstools/postcss-global-data`), 공통 미디어 정의 `src/breakpoints.css`
- 날짜: dayjs, 기본 시간대 `Asia/Seoul`
- 이미지: 공통 `Picture`, WebP/JPEG 썸네일, 반응형 JPEG 사진
- 아이콘: 공통 SVG 아이콘, Font Awesome regular·solid 패키지
- 폰트: Cormorant Garamond·Noto Serif KR의 Google Fonts 로드, IBM Plex Mono의 지연 스타일 로드 설정. 본문은 Pretendard·시스템 폰트 스택이며 Pretendard 별도 로드는 없음
- 품질 도구: ESLint, Prettier, TypeScript

```text
src/
  App.tsx                       Outlet, 공통 Footer·Toast, ScrollRestoration
  main.tsx                      createBrowserRouter, RouterProvider
  domains/
    home/
      index.tsx                 홈 섹션 구성
      sections/
        BannerSection/
        GreetingSection/
        TicketSection/
        GallerySection/         사진 5장 미리보기
        ContactSection/
        PhotoGiftSection/
          Passport/
            PageOne/
            PageTwo/Chip/       센서·스크롤·홀로그램
            SensorPermissionOverlay/
            _hooks/             권한·오버레이 관리
        ClosingSection/
        FooterSection/          App에서 공통 렌더링
    gallery/
      index.tsx                 사진 30장 목록
      GalleryImageModal/        Viewer, Photo, 스와이프·선로딩 훅
      _images/                  thumbnail, resized, dimensions.json
      _constants/
      _types/
  components/                   SectionTitle, Picture, Modal, Toast, Portal, MapLink, icons
  constants/                    WEDDING_INFO, routes, motion
  hooks/                        카운트다운, 인앱 대응, 관찰자, 토스트, 타이머·프레임 루프
  lib/                          clipboard, dayjs
  index.css                     전역 토큰·기본 스타일·접근성 설정
  breakpoints.css               공통 미디어 정의
public/                         favicon.svg, icons.svg, robots.txt
```

전용 자식 컴포넌트와 훅·상수·유틸·스타일은 소유 컴포넌트 아래에 둡니다. 공통 UI는 `src/components`, 공용 훅은 `src/hooks`에 둡니다. 경로 별칭 `@`는 `src`를 가리킵니다.

### 콘텐츠 수정 위치

| 내용                                 | 수정 위치                                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| 이름·관계·연락처·계좌·예식·장소·지도 | `src/constants/index.ts`의 `WEDDING_INFO`                                                     |
| 배너 사진·문구·모션                  | `src/domains/home/sections/BannerSection/`                                                    |
| 초대 인사                            | `src/domains/home/sections/GreetingSection/Messages/index.tsx`                                |
| 홈 미리보기 사진                     | `src/domains/home/sections/GallerySection/_images`, `_constants`                              |
| 전체 갤러리 사진·크기 정보           | `src/domains/gallery/_images/thumbnail`, `_images/resized`, `_images/resized/dimensions.json` |
| 갤러리 목록·반응형 소스 구성         | `src/domains/gallery/_constants/index.ts`                                                     |
| 사진 이벤트 문구·단계·여권 표기      | `src/domains/home/sections/PhotoGiftSection/_constants/index.ts`                              |
| 감사 인사                            | `src/domains/home/sections/ClosingSection/index.tsx`                                          |
| 제작자·저작권                        | `src/domains/home/sections/FooterSection/_constants/index.ts`의 `SITE_INFO`                   |
| HTML 제목·설명·공유 메타·폰트 로드   | `index.html`                                                                                  |

갤러리 사진을 추가·교체할 때는 같은 파일명으로 WebP/JPEG 썸네일, 960·1920·2880 변형, 크기 메타데이터를 함께 관리합니다. 목록은 크기 메타데이터의 키를 숫자 순서로 정렬하며, 대응 이미지가 누락되면 오류를 발생시킵니다. HTML 메타는 `WEDDING_INFO`에서 자동 생성되지 않으므로 예식 정보를 바꿀 때 함께 수정해야 합니다.

## 보안 · 개인정보

연락처·계좌·사진은 클라이언트 코드와 정적 자산으로 제공됩니다. 계좌 모달은 표시 방식이며 접근 권한을 제한하지 않습니다.

- **검색 제외 요청:** `index.html`에 `noindex`·`nofollow`·`nosnippet`·`noimageindex` 등을 선언합니다. 실제 색인 상태는 이 코드만으로 확인할 수 없습니다.
- **크롤링 정책:** [`public/robots.txt`](./public/robots.txt)는 도메인 루트 배포를 전제로 한 파일입니다. 현재 프로젝트 Pages의 정책 위치는 도메인 루트 `/robots.txt`이며, 이 저장소의 파일을 배포하는 것만으로 루트 정책이 갱신되지는 않습니다. 루트 정책 원본은 별도 `TK-moon/tk-moon.github.io` 저장소에서 관리하는 구조이며, 실제 적용 상태는 도메인 루트에서 별도로 확인해야 합니다.
- **접근 제한의 한계:** 크롤링 거부와 `noai`·`noimageai`는 인증 기능이 아닙니다. 정적 사이트와 공개된 저장소·Git 기록의 내용을 숨기지 않습니다.
- **CSP 설정:** 빌드 HTML에 CSP 메타를 삽입합니다. 스크립트·통신은 같은 출처로 제한하고 Google Fonts 스타일·폰트 출처를 허용합니다. 인라인 스타일은 허용하지만 인라인 스크립트·이벤트 핸들러는 허용하지 않습니다. 프레임 삽입 차단은 구현되어 있지 않습니다.
- **소스맵·환경 파일:** 기본 프로덕션 빌드에서는 소스맵을 생성하지 않고, `development` 모드 빌드에서만 생성합니다. `.env`·`.env.*`는 Git 제외 대상으로 설정하되 `.env.example`은 예외입니다. 프런트엔드 번들에 포함되는 값을 비밀로 간주하지 않습니다.
- **Referrer·외부 링크:** HTML에 `referrer=no-referrer`를 선언하고 지도 링크에 `noreferrer`를 사용합니다.
- **카카오톡 인앱:** `KAKAOTALK` User-Agent에서 외부 브라우저 열기를 요청한 뒤 100ms 후 인앱 닫기를 시도합니다. OS·앱별 전환 성공은 별도 확인이 필요합니다.
- **데이터 관리:** 연락처·계좌·사진은 게시 동의 범위에서 관리하고, 운영용 비밀 키는 프런트엔드에 넣지 않습니다.

## 디자인 · 접근성 규칙

방향은 **ivory 배경 × sky 액센트**의 보딩패스와 여권입니다. 장식은 티켓·여권 영역에 두고 안내 문구의 가독성을 우선합니다.

| 용도     | 변수                                                                                |
| -------- | ----------------------------------------------------------------------------------- |
| 면       | `--color-canvas`, `--color-paper`, `--color-paper-raised`, `--color-sky-wash`       |
| 텍스트   | `--color-ink`, `--color-ink-muted`, `--color-ink-subtle`                            |
| 포인트   | `--color-sky`, `--color-sky-deep`, `--color-sky-soft`                               |
| 구분선   | `--color-line`, `--color-line-soft`                                                 |
| 레이아웃 | `--layout-frame-width`, `--layout-inline-padding`, `--layout-section-padding-block` |

- 전역 최소 너비는 320px, 공통 콘텐츠 폭은 `min(100%, 560px)`, 기본 좌우 패딩은 16px입니다. 이는 스타일 설정이며 모든 기기에서의 검증 완료를 뜻하지 않습니다.
- 섹션 제목·이름은 display 폰트, 역할·설명·액션은 body 폰트를 사용합니다. 섹션 제목은 `--color-sky-deep`, 구역 소제목은 `--color-sky`, 역할은 `--color-ink-muted`로 위계를 구분합니다.
- 컴포넌트 스타일은 옆의 `index.module.css`에, 전역 토큰·기본 요소·접근성 설정은 `src/index.css`에 둡니다.
- 시맨틱 HTML과 이름이 있는 버튼·링크를 사용합니다. 계좌 모달과 갤러리 모달은 키보드 닫기·포커스 관리·배경 스크롤 잠금 처리를 갖습니다.
- `prefers-reduced-motion`에 따라 배너·티켓·갤러리·여권 등의 모션을 줄이거나 비활성화하는 처리가 있습니다. 접근성 전체 적합성 평가를 완료한 상태는 아닙니다.
