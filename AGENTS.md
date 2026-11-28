# AGENTS.md — 기본 프로젝트 AI 개발 가이드

> 이 파일은 프로젝트의 **AI 개발 규칙에 대한 단일 원본(SSOT)**입니다. AI 코딩 도구는 작업 전에 이 파일을 확인하며, 도구별 지침 파일(`CLAUDE.md` 등)은 이 문서를 참조하도록 설정합니다.
>
> 이 프로젝트는 **publishTemplate**(React 퍼블리싱 템플릿, https://github.com/codoly83/publishTemplate)을 기반으로 합니다. 규칙은 템플릿의 구조·스타일 방식을 그대로 따르며, 템플릿 가이드 화면(`/guide/base`, `/guide/naming-convention`, `/guide/tailwind-strategy`, `/guide/folder-structure`)과 이 문서가 다르면 사용자에게 확인합니다.
>
> 스택별 문법·폴더·명령어·예시 코드는 `docs/requirements.md` 0장에 지정한 **스택 파일**(`docs/stack/react.md`)에 있습니다.

---

## 1. 프로젝트 개요

- **이 문서는 프로젝트마다 수정하지 않습니다.** 프로젝트 이름·설명·대상 사용자·**스택**은 `docs/requirements.md` 0장에서만 정의합니다.
- **작업 범위:** **퍼블리싱 전용** (실제 API 연동은 하지 않습니다)
- **스택 파일:** `docs/requirements.md` 0장에 지정된 스택 파일 **하나만** 읽습니다.
- **문서 읽기 순서:** `AGENTS.md` → `docs/requirements.md` 0장(스택 확인) → 스택 파일 → `docs/requirements.md` → `docs/design.md` → `docs/tasks.md`
- **디자인 원본:** 사용하는 디자인 툴과 링크·파일 위치는 `docs/requirements.md` 6장에서만 정의합니다. 디자인 원본이 없으면 템플릿에 있는 컴포넌트·토큰을 기준으로 작업합니다.
- **작업별 추가 문서:** 퍼블리싱 목록(IA) 작업은 `docs/ia-spec-react.md`, 가이드 작업은 `docs/guide-spec-react.md`를 읽습니다.
- 문서가 없거나 내용이 불명확하면 가정하지 않고 사용자에게 확인합니다.

## 2. 기술 스택 및 라이브러리

정확한 버전과 목록은 `package.json`이 기준이며, 요약은 스택 파일 1장에 있습니다.

| 구분 | 사용 기술 | 규칙 |
| --- | --- | --- |
| 스타일 | Tailwind CSS 4 + CSS/SCSS + CSS Modules | 5.3절 |
| 공통 UI 기반 | Radix UI (shadcn 방식), class-variance-authority, tailwind-merge | 컴포넌트는 `src/components/ui/`에 직접 소유 |
| 아이콘 | 프로젝트 SVG(`src/assets/icons/`, `Icon` 컴포넌트) 우선, 보조로 `lucide-react` | 5.4절 |
| 슬라이드 | Swiper (`SwiperCustom`) | 5.6절 |
| 패키지 매니저 | **pnpm** (`pnpm-lock.yaml`) | npm·yarn으로 설치하지 않음 |

**설치 정책**

- `package.json`에 이미 있는 라이브러리를 우선 사용합니다. 같은 역할의 라이브러리를 새로 추가하지 않습니다. (예: 아이콘이 필요하면 `react-icons`를 새로 쓰지 말고 `src/assets/icons/` 또는 `lucide-react`)
- 새 라이브러리는 이유와 영향 범위를 설명하고 승인받은 뒤 `pnpm add`로 설치하며, 이 문서와 스택 파일을 갱신합니다.
- 전역 상태(`zustand`), 서버 상태(`@tanstack/react-query`), 목 API(`msw`)는 템플릿에 포함되어 있지만 퍼블리싱 단계에서는 필요할 때만 씁니다.

## 3. 주요 명령어

- 설치·개발 서버·빌드·린트·테스트 명령은 **스택 파일 2장**을 따릅니다.
- 작업 완료 시 빌드 명령으로 확인하고, 실행하지 못했다면 그 사실을 명시합니다.

## 4. 프로젝트 폴더 구조

- 기준 폴더 구조는 **스택 파일 3장**을 따릅니다.
- 공통 UI 컴포넌트는 `src/components/ui/{Name}/{Name}.tsx` + 같은 폴더의 스타일 파일로 두고, `src/components/ui/index.ts`에서 내보냅니다.
- 퍼블리싱 페이지는 `src/publish/pages/` 아래에 파일로 만들면 `/publish/...` 경로로 **자동 등록**됩니다. (스택 파일 3장)
- 가이드 샘플 페이지는 `src/publish/guide/` 아래 `sample*.tsx` 패턴을 유지합니다.
- 구조에 없는 폴더는 사용자가 승인한 경우에만 추가하고 스택 파일을 갱신합니다.

## 5. 코딩 규칙

### 5.1 컴포넌트

- 컴포넌트 작성 문법은 스택 파일 4장을 따릅니다.
- 이벤트 핸들러는 `handle + 대상 + 동사` 형식을 사용합니다. 예: `handleSubmitForm`
- 기존 공통 컴포넌트가 있으면 새로 만들지 않고 재사용합니다. 템플릿에 이미 있는 컴포넌트 목록은 `/guide`의 components 섹션과 `src/components/ui/index.ts`가 기준입니다.
- 새 공통 컴포넌트는 2곳 이상에서 쓰일 때만 만들고, 1곳에서만 쓰는 UI는 해당 페이지 파일 안에 작성합니다.
- 공통 컴포넌트별 사용 규칙은 `docs/components/{이름}.md`에 있습니다. 해당 컴포넌트를 쓰거나 고치기 전에 읽습니다.
### 5.1.1 className 사용 범위와 간격

- 공통 컴포넌트(`src/components/ui`)의 **색·크기·모양**은 `className`으로 덮어쓰지 않습니다. 필요한 모양이 없으면 컴포넌트에 `variant`(cva)를 추가하고 가이드 샘플과 `docs/components/{이름}.md`를 함께 갱신합니다.
- 페이지에서 `className`은 **배치·간격**에만 씁니다. (예: `flex`, `grid`, `grid-cols-2`, `items-center`, `justify-between`, `w-full`, `gap-4`, `mt-6`)
    - 금지 예: `<Button className="bg-red-500 h-12 rounded-none">`, `<Input className="text-lg border-2">`
- 간격(`gap-*`, `space-*`, `m*-*`, `p*-*`)은 **`2`(8px)·`4`(16px)·`6`(24px) 세 단계만** 씁니다.
    - `2`: 라벨과 입력창, 버튼끼리 등 작은 묶음
    - `4`: 입력 항목 사이, 카드 사이 (기본)
    - `6`: 페이지 안 구역 사이
- 세 단계로 표현할 수 없는 간격이 디자인에 있으면 임의 값(`gap-[13px]` 등)을 쓰지 않고 사용자에게 확인합니다.

### 5.2 이름 규칙 (템플릿 `/guide/naming-convention`)

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 함수, 타입 | PascalCase | `SampleUserCard`, `ButtonProps` |
| 변수, 함수, 객체 key | camelCase | `userName`, `fetchUserList` |
| 이벤트 핸들러 | `handle` + 대상 + 동사 | `handleClickSave` |
| Boolean | `is/has/can/should` 접두어 | `isOpen`, `hasError` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 커스텀 훅 | `use` + camelCase | `useScrollSpy` |
| 가이드 샘플 파일 | camelCase, `sample` 접두어 | `sampleButton.tsx` |
| 커스텀 CSS 클래스 | camelCase | `.userCardWrap` |
| Tailwind·외부 라이브러리 클래스 | kebab-case 그대로 | `flex`, `swiper-slide` |

- 축약어는 팀 공통 약속어만 허용합니다. 약속어: `icon`, `btn`, `inner`, `area`, `wrap`, `box`, `list`/`item`, `title`/`desc`, `thumb`, `content`, `header`/`body`/`footer`, `form`/`field`

### 5.3 스타일 (템플릿 `/guide/tailwind-strategy`)

- **컴포넌트 규칙은 SCSS/CSS, 페이지 유동 배치는 Tailwind `className`**으로 혼용합니다.
    - 공통 컴포넌트의 기본 스타일, variant, size, 상태 스타일 → 컴포넌트 폴더의 스타일 파일(`.module.css`/`.module.scss`/`.scss`)
    - 페이지 단위 레이아웃, 반응형 그리드·간격, 정렬 → Tailwind 유틸리티 클래스
- 기존 `module.css` 구간은 점진적으로 SCSS로 통일하는 것을 권장하되, 요청 없이 일괄 변환하지 않습니다.
- 전역 스타일은 `src/assets/styles/global.css`에서 `_font.css` → `_color.css` → `_base.css` → `_layout.css` → `_mixin.scss` → `common.scss` → `contents.scss` 순서로 불러옵니다. 페이지 전용 공통 스타일은 `contents.scss`에 둡니다.
- 색상은 하드코딩하지 않고 토큰(`var(--primary)`, `--font-*`, `--bg-*`, `--line*` 등, `docs/design.md` 6장)이나 대응되는 Tailwind 색(`text-primary`, `bg-base` 등)을 사용합니다. 다크모드는 `.dark` 클래스로 토큰 값이 바뀌므로 hex 직접 사용을 최소화합니다.
- 인라인 `style`은 런타임에 계산되는 동적 값에만 사용합니다. 고정 값은 Tailwind 클래스나 스타일 파일로 작성합니다.
- 반응형 기준: Mobile `360~767`, Tablet `768~1023`, Desktop `1024~1439`, Wide `1440+`

### 5.4 이미지 및 아이콘

- 이미지·아이콘은 디자인 원본의 에셋을 사용하고, 임의 제작·유사 아이콘 대체를 하지 않습니다. 원본을 구할 수 없으면 사용자에게 확인합니다.
- 아이콘은 `src/assets/icons/`(SVG)에 두고 `Icon` 컴포넌트 또는 `vite-plugin-svgr`(`?react`)로 사용합니다. 파일명은 kebab-case로 용도를 알 수 있게 작성합니다. 예: `arrow-down.svg`
- 정보 전달 이미지는 의미 있는 `alt`, 장식용은 `alt=""`를 사용하고, 아이콘 버튼에는 `aria-label`을 제공합니다.

### 5.5 상태 관리 원칙

- 같은 상태를 중복 관리하지 않고, 계산 가능한 값은 원본 상태에서 도출합니다.
- 상태는 그 상태를 쓰는 가장 가까운 공통 부모에서 관리합니다. 여러 페이지에서 공유할 때만 Context나 `zustand`를 씁니다.
- 상태를 바꿀 때 배열·객체의 불변성을 유지합니다.

### 5.6 슬라이드(Swiper)

- 슬라이드·캐러셀은 템플릿의 `Swiper`·`SwiperSlide`(`@/components/ui`에서 export)로 구현하며 직접 구현하지 않습니다.
- 자동 재생·페이지네이션·네비게이션은 디자인·요구사항에 있을 때만 추가합니다.

## 6. 퍼블리싱 작업 규칙

### 6.1 기본 규칙

- 목업 데이터를 사용할 수 있습니다.
- 기존 마크업 구조와 클래스명을 최대한 유지하고, 시맨틱 태그와 접근성 기본(버튼 `type`, `alt`, `label` 연결, 포커스 표시 유지)을 지킵니다.

### 6.2 퍼블리싱 목록 (`/guide/ialist`)

- 상세 명세는 **`docs/ia-spec-react.md`**입니다.
- 새 퍼블리싱 페이지를 만들면 **같은 작업에서** `src/publish/guide/publishing.ts`의 `publishingList`에 등록합니다.
- 검증되지 않은 페이지를 `완료`로 표시하지 않으며, `docs/tasks.md`와 상태가 다르면 사용자에게 확인합니다.

### 6.3 퍼블리싱 가이드 (`/guide/*`)

- 상세 명세는 **`docs/guide-spec-react.md`**입니다.
- 공통 컴포넌트를 추가하거나 Props·사용법을 바꾸면 **같은 작업에서** 가이드 샘플 페이지와 `sampleMeta.ts`, 라우트를 갱신합니다.
- 가이드 변경이 없으면 결과 보고에 `Guide 변경 없음(공통 컴포넌트 변경 없음)`이라고 명시합니다.

### 6.4 작업 순서

**앞 단계가 완료(검증 및 `docs/tasks.md` 체크)되기 전에 다음 단계를 시작하지 않습니다.**

| 단계 | 작업 | 완료 조건 |
| --- | --- | --- |
| 1. 초기 구성 | 템플릿 적용, 프로젝트 정보 반영 | `/guide/ialist` 접속, 빌드 통과 |
| 2. 화면 분석 | 디자인 원본의 전체 페이지를 보고 필요한 UI를 템플릿 컴포넌트와 대조. 부족한 컴포넌트·variant 목록 작성 | `docs/design.md` 2장 표에 기록, 사용자 승인, `docs/tasks.md`에 작업 등록 |
| 3. 공통 컴포넌트 + 가이드 | 2단계에서 승인된 컴포넌트 추가·수정 | 가이드 샘플 페이지 갱신, 9.2 수동 검수 |
| 4. 페이지 | 공통 컴포넌트를 조합해 `src/publish/pages/`에 페이지 작성 | 퍼블리싱 목록 등록, 디자인·동작 확인, 빌드 통과 |

- 2단계에서는 코드를 작성하지 않습니다.
- 4단계에서 공통 컴포넌트가 부족하면 페이지에서 복사하거나 스타일 덮어쓰기로 우회하지 않고, 2단계로 돌아가 목록 추가를 제안합니다.
- 조회 목록 화면은 검색 결과 0건일 때의 "데이터 없음" 영역을 함께 만듭니다. 문구와 모양은 디자인 원본을 따르고, 없으면 사용자에게 확인합니다.

## 7. SSOT 문서 관리

| 정보 | 공식 원본 |
| --- | --- |
| AI 개발 규칙 (공통) | `AGENTS.md` |
| 프로젝트 정보·사용 스택 | `docs/requirements.md` 0장 |
| 스택별 규칙 (문법, 폴더, 명령어, 예시) | `docs/stack/react.md` |
| 기능 요구사항 | `docs/requirements.md` |
| 디자인 원본 | `docs/requirements.md` 6장 |
| 구조 및 설계, 컴포넌트 목록, 디자인 토큰 | `docs/design.md` |
| 공통 컴포넌트별 사용 규칙 (Props, variant, 접근성, 금지 사항) | `docs/components/{이름}.md` (페이지에서 쓰게 되는 컴포넌트부터 작성) |
| 작업 진행 상태 | `docs/tasks.md` (체크박스) |
| 퍼블리싱 목록 명세 | `docs/ia-spec-react.md` (데이터는 `src/publish/guide/publishing.ts`) |
| 가이드 명세 | `docs/guide-spec-react.md` (메뉴는 `src/publish/guide/sampleMeta.ts`) |

- `docs/personal/`은 개인 메모 폴더입니다(일정, 문서 변경 이력, 프롬프트 작성법 등). 프로젝트 규칙·요구사항이 아니므로 작업 기준으로 읽지 않습니다.
- 같은 규칙과 데이터를 여러 곳에 중복 정의하지 않습니다.
- 문서에 쌓이는 기록(결정 기록, 완료 기록 등)은 본문에 두지 않고 같은 폴더의 `{파일명}_history.md`에 추가합니다. 본문에는 해당 장 제목과 참조 문구만 남깁니다.
    - 현재: `docs/design_history.md`(`design.md` 8장 결정 기록), `docs/tasks_history.md`(`tasks.md` 완료 기록)
    - `{파일명}_history.md` 파일(`design_history.md`, `tasks_history.md` 등)은 사람이 보는 기록입니다. AI는 작업 기준으로 읽지 않고, 기록을 추가할 때만 엽니다.
- 스펙 변경이 확정되면 공식 문서를 먼저 갱신하고 코드를 수정합니다.
- 문서와 코드가 충돌하면 임의로 덮어쓰지 않고 차이를 보고합니다.

## 8. AI 작업 절차

1. **문서 확인:** 이 문서와 스택 파일, 관련 문서를 확인하고, `docs/tasks.md`에서 현재 작업이 6.4절 순서상 시작 가능한지 확인합니다.
2. **기존 코드 검색:** 새 파일을 만들기 전에 `src/components/ui/`와 가이드에 유사한 컴포넌트가 있는지 찾습니다.
3. **작업 단위:** 요청된 작업 한 가지에만 집중합니다.
4. **최소 수정:** 요청 범위 밖의 리팩터링, 파일 이동·삭제·덮어쓰기, 라이브러리 설치는 사전 승인을 받습니다.
5. **불명확하면 질문:** 추측으로 설계를 확정하거나 디자인 원본에 없는 UI·기능·에셋을 추가하지 않습니다.
6. **목록·가이드 동기화:** 페이지 추가 시 퍼블리싱 목록, 공통 컴포넌트 추가·변경 시 가이드를 같은 작업에서 갱신합니다.
7. **검증:** 9.1절 자동 검사를 실행하고, 9.2절 수동 검수 항목 중 이번 변경에 해당하는 것을 정리합니다. 실행하지 않은 검사를 통과했다고 보고하지 않습니다.
8. **작업 기록:** 검증된 작업만 `docs/tasks.md`에서 `[x]`로 변경합니다.
9. **결과 보고:** 수정 파일, 목록·가이드 반영 여부, 변경 이유, 남은 문제를 요약하고 마지막에 아래 표를 붙입니다.

```markdown
**검수 결과**

| 검사 | 결과 |
| --- | --- |
| 빌드 | 통과 / 실패 / 미실행(이유) |
| 린트 | 통과 / 실패 / 미실행(이유) |
| 사람이 확인할 항목 (9.2) | 예: Modal ESC·포커스 복귀, 360px 레이아웃 |
```

### 8.1 Git 안전 규칙

- 작업 전 `git status`로 변경 범위를 확인하고, 사용자 변경분을 덮어쓰지 않습니다.
- `git reset --hard`, `git clean -fd`, 강제 푸시, 이력 재작성은 명시적 승인 없이는 금지합니다.

## 9. 검수

### 9.1 자동 검사 (작업 완료 시 AI가 실행)

| 규칙 | 명령 |
| --- | --- |
| 타입·빌드 오류 없음 | `pnpm build` |
| 린트 | `pnpm lint` (이번 작업에서 새 오류를 만들지 않았는지 확인) |
| 테스트가 있는 경우 | `pnpm test --run` |

### 9.2 수동 검수 (사람이 `/guide`·페이지에서 확인)

| 구분 | 확인 내용 |
| --- | --- |
| 모양 | 디자인 원본의 variant·size가 가이드에 있고 디자인과 일치한다. |
| 다크모드 | 가이드 상단 다크모드 스위치를 켰을 때 색이 토큰대로 바뀐다. |
| 키보드 | Tab으로 이동되고 Enter·Space로 동작한다. 포커스 표시가 보인다. |
| 오버레이 | Modal은 ESC로 닫히고 포커스가 내부로 이동했다가 복귀한다. |
| 반응형 | 360px, 768px, 1024px, 1440px에서 깨지지 않는다. |

### 9.3 완료 전 점검 목록

- [ ] 4장 폴더 구조와 5.2 이름 규칙을 지켰다.
- [ ] 색상을 하드코딩하지 않고 토큰을 사용했다. (5.3)
- [ ] 공통 컴포넌트에 `className`으로 색·크기·모양을 덮어쓰지 않았고, 간격은 `2`·`4`·`6`만 썼다. (5.1.1)
- [ ] 디버깅용 `console.log`가 남아 있지 않다.
- [ ] 승인되지 않은 패키지를 설치하지 않았다. (2장)
- [ ] 같은 기능의 공통 컴포넌트를 중복으로 만들지 않았다. (5.1)
- [ ] 퍼블리싱 목록·가이드를 갱신했다. (6.2, 6.3)
- [ ] 스택 파일 10장의 점검 목록을 확인했다.

규칙을 지키기 어려운 사정이 있으면 이유와 대안을 먼저 설명하고 승인받은 뒤 진행합니다.
