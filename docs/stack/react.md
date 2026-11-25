# React 스택 규칙 (`docs/stack/react.md`)

> `docs/requirements.md` 0장의 스택이 **React + TypeScript (publishTemplate)**일 때 읽는 파일입니다.
> 공통 규칙(무엇을 지킬지)은 `AGENTS.md`에 있고, 이 파일은 그 규칙을 **이 템플릿에서 어떻게 구현하는지**만 정의합니다.
> 각 장 번호는 `AGENTS.md`에서 "스택 파일 N장"으로 참조합니다. 장 번호를 바꾸면 `AGENTS.md`의 참조도 함께 고칩니다.

---

## 1. 기술 스택

| 구분 | 사용 기술 | 비고 |
| --- | --- | --- |
| 빌드 | Vite 7 | `vite.config.ts` (`@` → `src` 별칭, `vite-plugin-svgr`, `@tailwindcss/vite`) |
| 프레임워크 | React 19 | 함수형 컴포넌트와 Hooks |
| 언어 | TypeScript 5.9 | `strict: true` |
| 라우팅 | React Router 7 | `src/routes/routes.tsx` |
| 스타일 | Tailwind CSS 4, CSS/SCSS(`sass-embedded`), CSS Modules | `AGENTS.md` 5.3 |
| 공통 UI 기반 | Radix UI(`radix-ui`), `class-variance-authority`, `clsx`, `tailwind-merge` (`cn()` in `src/lib/utils.ts`) | shadcn 설정은 `components.json` |
| 아이콘 | `src/assets/icons/*.svg` + `Icon` 컴포넌트, 보조 `lucide-react` | |
| 슬라이드 | Swiper 12 | `src/components/ui/SwiperCustom/` |
| 기타 포함 라이브러리 | `react-day-picker`·`date-fns`(DatePicker), `recharts`(Chart), `@dnd-kit/*`(SortableList), `@minoru/react-dnd-treeview`(TreeView), `sonner`(Toast), `shiki`(가이드 코드 하이라이트), `zustand`, `@tanstack/react-query`, `msw` | 정확한 목록은 `package.json` |
| 테스트 | Vitest + Testing Library | `vitest.setup.ts` |
| 패키지 매니저 | pnpm 10 | `pnpm-lock.yaml` |

**명세 문서**

| 문서 | 파일 |
| --- | --- |
| 퍼블리싱 목록(IA) 명세 | `docs/ia-spec-react.md` |
| 가이드 명세 | `docs/guide-spec-react.md` |

**사용 금지**

- 클래스형 React 컴포넌트
- 이미 있는 라이브러리와 같은 역할의 새 라이브러리 (예: MUI·Emotion은 템플릿 의존성에 있지만 새 화면에서 쓰지 않습니다. `react-icons`는 새로 쓰지 않습니다)

## 2. 주요 명령어

pnpm이 전역 설치되어 있지 않으면 `npx pnpm@10.26.1 <명령>`으로 실행합니다.

```bash
pnpm install       # 의존성 설치
pnpm dev           # 개발 서버 (http://localhost:5173/ → /guide/ialist로 이동)
pnpm build         # 프로덕션 빌드 (tsc -b + vite build)
pnpm preview       # 빌드 미리보기
pnpm lint          # ESLint
pnpm test          # Vitest
```

## 3. 폴더 구조

```text
src/
├── main.tsx                     # 진입점, global.css import
├── app/App.tsx                  # Provider 조합 (ThemeProvider) + Router
├── routes/
│   ├── Router.tsx
│   ├── routes.tsx               # 라우트 정의 (/guide/*, /publish/*)
│   └── RouteTitleSync.tsx       # 라우트 handle.title → 문서 제목
├── providers/
│   ├── theme-provider.tsx       # ThemeProvider (.dark 클래스 적용)
│   └── theme-context.ts         # 테마 Context, useTheme()
├── components/
│   ├── layout/                  # RootLayout, DefaultLayout, pageLayoutBasic/
│   └── ui/                      # 공통 UI: {Name}/{Name}.tsx + 스타일 파일, index.ts에서 export
├── hooks/                       # 공통 커스텀 훅 (useXxx.ts)
├── lib/utils.ts                 # cn() 등 공통 유틸
├── assets/
│   ├── icons/                   # SVG 아이콘 (kebab-case)
│   ├── fonts/                   # PretendardVariable.woff2
│   └── styles/                  # global.css, _font/_color/_base/_layout.css, _mixin/common/contents.scss
└── publish/
    ├── pages/                   # 퍼블리싱 페이지 (자동 라우팅)
    └── guide/                   # 퍼블리싱 가이드
        ├── Guide.tsx            # 가이드 셸 (헤더·검색·사이드바·다크모드)
        ├── PublishingList.tsx   # 퍼블리싱 목록 화면 (/guide/ialist)
        ├── publishing.ts        # 퍼블리싱 목록 데이터
        ├── sampleMeta.ts        # 가이드 사이드바 메뉴 데이터
        ├── GuideBox.tsx         # 샘플 블록 (제목·설명·코드)
        ├── components/          # UI 컴포넌트 샘플 페이지 (sample*.tsx)
        ├── hooks/               # 훅 샘플 페이지
        ├── layout/              # 레이아웃 샘플 페이지
        └── pageFeatures/        # 페이지 기능 샘플 페이지
```

**퍼블리싱 페이지 자동 라우팅**

- `src/publish/pages/**/*.tsx` 파일은 `import.meta.glob`으로 읽어 `/publish/{파일 경로}`로 자동 등록됩니다. `PageLayoutBasic` 레이아웃 안에서 렌더링됩니다.
    - `src/publish/pages/home.tsx` → `/publish/home`
    - `src/publish/pages/login/login.tsx` → `/publish/login/login`
    - `src/publish/pages/foo/index.tsx` → `/publish/foo`
- 페이지 파일은 `export default`로 컴포넌트를 내보내야 합니다.
- 페이지 제목(브라우저 탭)은 `sampleMeta.ts`의 `/pages/{경로}` 항목 → `publishing.ts`의 `name` → 경로 문자열 순서로 정해집니다.

## 4. 컴포넌트 작성

- 템플릿의 기존 방식을 따릅니다. 컴포넌트는 `function` 선언 또는 화살표 함수 모두 허용하며, 같은 파일 안에서는 기존 스타일에 맞춥니다.
- 공통 UI 컴포넌트는 **이름 있는 export**(`export { Button }`)로 내보내고 `src/components/ui/index.ts`에 추가합니다. 사용하는 쪽은 `import { Button } from "@/components/ui";`로 불러옵니다.
- 페이지·가이드 샘플 페이지는 `export default`로 내보냅니다.
- 변형은 `class-variance-authority`(`cva`)로 정의하고, 클래스 병합은 `cn()`(`@/lib/utils`)을 사용합니다. 변형을 다른 파일에서도 쓰려면 `{Name}.variants.ts`로 분리해 내보냅니다. (9장)
- 네이티브 속성은 `React.ComponentProps<"button">` 등을 확장해 `...props`로 전달합니다.
- import 경로는 `@/` 별칭을 사용합니다.

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import styles from "./Sample.module.css";

const sampleVariants = cva(styles.sample, {
  variants: {
    variant: { primary: styles.primary, secondary: styles.secondary },
  },
  defaultVariants: { variant: "primary" },
});

type SampleProps = React.ComponentProps<"div"> & VariantProps<typeof sampleVariants>;

function Sample({ className, variant, ...props }: SampleProps) {
  return <div className={cn(sampleVariants({ variant }), className)} {...props} />;
}

export { Sample };
```

## 5. 공통 규칙 ↔ 구현 대응표

| 공통 규칙 (`AGENTS.md`) | 구현 |
| --- | --- |
| 이벤트 Props | `onClick`, `onCheckedChange` 등 (Radix 규칙 유지). 내부 함수는 `handleXxx` |
| 변형·크기 | `cva`의 `variants` + `defaultVariants` |
| 오버레이 | Radix Portal 또는 템플릿 `Portal` 컴포넌트 (`container` 지정 가능) |
| 고유 ID | `useId()` |
| 반복 렌더링 키 | `map()` + 고유 `key` |
| 레이아웃 타입 전환 | `useLayoutClass("type2")` 등 템플릿 훅 사용 |
| 다크모드 | `useTheme()`(`@/providers/theme-context`)의 `setTheme` |

## 6. TypeScript 및 상태 관리

- `any`는 ESLint에서 허용되어 있지만, 새 코드에서는 구체적인 타입이나 `unknown`을 우선 사용합니다.
- 단순한 화면 상태는 `useState`, 여러 페이지 공유 상태만 Context 또는 `zustand`를 사용합니다.
- 상태 변경 시 배열·객체는 새 값으로 교체합니다.
- 직접 등록한 이벤트 리스너는 `useEffect` cleanup에서 해제합니다.

## 7. 슬라이드 (Swiper)

- `@/components/ui`에서 export하는 `Swiper`, `SwiperSlide`, `Navigation`, `SwiperPagination`을 사용합니다. 예시는 `src/publish/pages/home.tsx`와 `/guide/swiper`를 참고합니다.

## 8. 조회 목록: 데이터 없음

```tsx
{filteredList.length > 0 ? (
  <ul>
    {filteredList.map((item) => (
      <li key={item.id}>{item.title}</li>
    ))}
  </ul>
) : (
  <div className="noData">검색 결과가 없습니다.</div>
)}
```

- 테이블은 `TableBody` 안에 `colSpan`을 준 한 행으로 넣습니다.

## 9. 자동 검사

| 규칙 | 도구 |
| --- | --- |
| 타입 오류 없음 | `pnpm build` (`tsc -b`) |
| ESLint 권장 규칙, Hooks 규칙 | `pnpm lint` (`eslint.config.js`) |

- 린트 오류 0건 상태를 유지합니다. (2026-11-25 템플릿 원본 오류 정리 완료)
- `_` 접두어 변수·인자는 "의도적으로 쓰지 않는 값"으로 보고 미사용 검사에서 제외합니다.
- `react-refresh/only-export-components` 규칙 때문에 컴포넌트 파일(`.tsx`)에서는 **컴포넌트와 타입만** 내보냅니다. cva 변형·상수·유틸 함수는 같은 폴더의 `{Name}.variants.ts`, 훅은 별도 `.ts` 파일(예: `Portal/usePortalContainer.ts`, `providers/theme-context.ts`의 `useTheme`)에 두고 `index.ts`에서 다시 내보냅니다.

## 10. 완료 전 점검

- [ ] 새 공통 컴포넌트를 `src/components/ui/index.ts`에서 export했다.
- [ ] 새 페이지를 `src/publish/pages/`에 만들고 `publishing.ts`에 등록했다.
- [ ] 색상은 토큰 또는 토큰 기반 Tailwind 색을 사용했다.
- [ ] `vite.config.ts`, `tsconfig*.json`, `main.tsx`를 이유 없이 수정하지 않았다.
- [ ] 직접 등록한 이벤트 리스너를 cleanup에서 해제했다.
