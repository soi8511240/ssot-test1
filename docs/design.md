# 설계 (Design)

> 이 문서는 **어떻게 만드는지** 정의하는 설계 문서입니다.
> 기능 요구사항은 `docs/requirements.md`, AI 개발 및 코딩 규칙은 `AGENTS.md`를 따릅니다.
> **현재 작업 범위:** React + TypeScript 퍼블리싱 전용
> 마지막 수정: 2026-11-25

---

## 1. 화면 구조

### 1.1 전체 화면 구조

```text
App (ThemeProvider)
├── /                       → /guide/ialist 로 이동
├── /guide (Guide 셸: 헤더·검색·사이드바·다크모드)
│   ├── /guide/ialist       퍼블리싱 목록 (PublishingList)
│   └── /guide/{샘플}       컴포넌트·훅·레이아웃·기본설정 샘플
├── /guide/layout-basic     PageLayoutBasic 레이아웃 샘플 (독립 화면)
└── /publish (PageLayoutBasic)
    └── /publish/{페이지}   src/publish/pages/ 파일 기준 자동 라우트
```

- 라우트 정의: `src/routes/routes.tsx`
- 실제 서비스 화면은 `/publish/*`에 만들고, `/guide/*`는 관리·가이드 화면입니다.

### 1.2 레이아웃

| 컴포넌트 | 위치 (`src/` 기준) | 역할 |
| --- | --- | --- |
| `RootLayout` | `components/layout/RootLayout.tsx` | `/` 루트 (`.app-layout` > `.app-body` > `.app-content`) |
| `DefaultLayout` | `components/layout/DefaultLayout.tsx` | 사이드바형 기본 레이아웃 샘플 (`/guide/layout`) |
| `PageLayoutBasic` | `components/layout/pageLayoutBasic/` | Header·본문·Footer 기본 페이지 레이아웃. `/publish/*` 페이지에 적용 |

- 레이아웃 타입은 `useLayoutClass("type2")`처럼 페이지에서 지정합니다. (`/guide/layout-basic` 참고)
- 레이아웃 공통 스타일은 `src/assets/styles/_layout.css`와 각 레이아웃의 `.module.scss`에 있습니다.

### 1.3 폴더 구조

`docs/stack/react.md` 3장을 따릅니다.

## 2. 컴포넌트 명세

> 프로젝트에 포함된 공통 UI 컴포넌트 목록입니다. 사용 규칙은 `docs/components/{이름}.md`(작성된 것 12개: Accordion, AlertDialog, Button, Card, Chart, Checkbox, Chip, Collapsible, DatePicker, Icon, Input, InputStepper), 실제 예시는 `/guide/{경로}` 샘플 페이지가 기준입니다.
> 화면 분석(`AGENTS.md` 6.4 2단계)에서 부족한 컴포넌트·variant가 나오면 `상태`를 `제안`으로 추가하고, 승인 후 `승인`으로 바꿔 `docs/tasks.md`에 등록합니다.

| 컴포넌트 | 위치 (`components/ui/`) | 가이드 | 상태 |
| --- | --- | --- | --- |
| Accordion | `Accordion/` | `/guide/accordion` | 기본 |
| AlertDialog | `AlertDialog/` | `/guide/alert-dialog` | 기본 |
| Button | `Button/` | `/guide/button` | 기본 |
| Card | `Card/` | `/guide/card` | 기본 |
| Chart | `Chart/` | `/guide/chart` | 기본 |
| Checkbox, CheckboxGroup | `Checkbox/` | `/guide/checkbox` | 기본 |
| Chip | `Chip/` | `/guide/chip` | 기본 |
| Collapsible | `Collapsible/` | `/guide/collapsible` | 기본 |
| DatePicker, DateRangePicker | `DatePicker/` | `/guide/datepicker` | 기본 |
| Icon | `Icon/` | `/guide/icon` | 기본 |
| Input | `Input/` | `/guide/input` | 기본 |
| InputStepper | `InputStepper/` | `/guide/input-stepper` | 기본 |
| Loading | `Loading/` | `/guide/loading` | 기본 |
| Modal | `Modal/` | `/guide/modal` | 기본 |
| PageChangePanel | `PageChangePanel/` | `/guide/pagechangepanel` | 기본 |
| Pagination | `Pagination/` | `/guide/pagination` | 기본 |
| Popover | `Popover/` | `/guide/popover` | 기본 |
| Portal | `Portal/` | `/guide/portal` | 기본 |
| Radio | `Radio/` | `/guide/radio` | 기본 |
| ScrollArea | `ScrollArea/` | `/guide/scrollarea` | 기본 |
| Select | `Select/` | `/guide/select` | 기본 |
| Skeleton | `Skeleton/` | `/guide/skeleton` | 기본 |
| Slider | `Slider/` | `/guide/slider` | 기본 |
| SortableList | `SortableList/` | `/guide/sortable-list` | 기본 |
| Swiper (SwiperCustom) | `SwiperCustom/` | `/guide/swiper` | 기본 |
| Switch | `Switch/` | `/guide/switch` | 기본 |
| Table | `Table/` | `/guide/table` | 기본 |
| Tabs | `Tabs/` | `/guide/tabs` | 기본 |
| Textarea | `TextArea/` | `/guide/textarea` | 기본 |
| TextList | `TextList/` | `/guide/text-list` | 기본 |
| Toast | `Toast/` | `/guide/toast` | 기본 |
| Tooltip | `Tooltip/` | `/guide/tooltip` | 기본 |
| TreeView | `TreeView/` | `/guide/tree-view` | 기본 |

> `상태`: `기본`(기본 제공) / `제안`(화면 분석 후 승인 대기) / `승인`(구현 대상)

**공통 훅** (`src/hooks/`, 가이드 `hooks` 섹션): `useHtmlRootClass`, `useHtmlTag`, `useLayoutClass`, `useMediaDevice`, `useNearestScrollableMetrics`, `useRemainingHeight`, `useScrollSpy`

## 3. 데이터 타입

- 여러 파일에서 공유하는 타입은 사용하는 모듈 가까이에 두되, 2곳 이상에서 쓰면 해당 컴포넌트 파일에서 `export type`으로 내보내 재사용합니다. (예: `DateRange`, `ModalSize`)
- 목업 데이터에도 타입을 명시합니다.

## 4. 상태 관리

| 상태 | 위치 | 방식 |
| --- | --- | --- |
| 테마(라이트/다크) | `ThemeProvider` | Context (`useTheme`), `localStorage` 키 `ui-theme` |
| 컴포넌트 내부 상태 | 각 컴포넌트 | `useState` / Radix 내부 상태 |
| 여러 페이지 공유 상태 | 필요 시 | Context 또는 `zustand` |

## 5. 인터랙션

- 오버레이·메뉴·탭 등 인터랙션은 공통 컴포넌트(Radix 기반)의 동작을 그대로 사용합니다.
- 실제 API가 연결되지 않은 기능은 퍼블리싱용 목업 동작으로 구현합니다.

## 6. 디자인 토큰

> 토큰은 `src/assets/styles/_color.css`(색상), `_font.css`(폰트)에 정의합니다. Tailwind에서는 `@theme inline` 별칭으로 `text-primary`, `bg-base`, `border-line01` 등으로 사용합니다.
> `.dark` 클래스가 붙으면 같은 토큰 이름으로 다크 값이 적용됩니다.

| 토큰 | 라이트 | 다크 | Tailwind 별칭 |
| --- | --- | --- | --- |
| `--primary` | `#00997a` | `#04bc90` | `primary` |
| `--font-b` | `#1f2533` | `#ffffff` | `font-b` |
| `--font-g` | `#7a8599` | `#8d9199` | `font-g` |
| `--font-lg` | `#aab2bd` | `#5e6166` | `font-lg` |
| `--font-w` | `#ffffff` | `#17181a` | `font-w` |
| `--bg-base` | `#ffffff` | `#17181a` | `base` |
| `--bg-container` | `#ebf0f5` | `#000000` | `container` |
| `--bg-box` | `#f5f8fa` | `#222426` | `box` |
| `--bg-row` | `#ffffff` | `#222426` | `row` |
| `--blue` / `--red` / `--purple` / `--yellow` | 상태 색 | 상태 색 | 같은 이름 |
| `--green-50` ~ `--gray-50` | 상태 배경 | 상태 배경 | 같은 이름 |
| `--line01` / `--line02` | `#ebf0f5` / `#dde4eb` | `#2d2f33` / `#363940` | `line01` / `line02` |
| `--btn-b` / `--btn-g` | 버튼 색 | 버튼 색 | |
| `--gradient` | `--gr01` → `--gr02` | | |

- 폰트: Pretendard Variable (`src/assets/fonts/PretendardVariable.woff2`)
- 전체 값은 `/guide/color`, `/guide/font`에서 확인합니다.

## 7. API / 데이터 소스

- 현재 단계에서는 실제 API 연동을 구현하지 않습니다.
- 환경 변수는 `.env.*` 파일에 `VITE_` 접두사로 관리합니다. (`VITE_USE_MOCK_API`, `VITE_API_BASE_URL`, `VITE_API_TIMEOUT`, `VITE_BACKEND_URL`)
- 실제 비밀키나 인증 정보는 클라이언트 환경 변수에 저장하지 않습니다.

## 8. 결정 기록 (ADR)

결정 기록은 `docs/design_history.md`에 있습니다. 새 결정도 그 파일에 추가합니다.

## 9. 설계 변경 관리

- 기능 요구사항이 변경되면 `docs/requirements.md`를 먼저 확인합니다.
- 컴포넌트 구조, 데이터 흐름, 인터랙션 등이 변경되면 이 문서를 갱신합니다.
- 코딩 규칙이나 라이브러리 정책 변경은 `AGENTS.md`에서 관리합니다.
- 실제 코드와 설계 문서가 다르면 임의로 수정하지 않고 차이를 확인합니다.

## 10. 화면 검수

- 페이지 화면을 브라우저로 자세히 검수할 때는 `tools/renderlint-rules/RULES.md`(화면 검수 체크리스트)를 기준으로 하고, 그 문서의 보고 형식을 따릅니다.
