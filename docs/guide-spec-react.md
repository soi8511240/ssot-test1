# 퍼블리싱 가이드 명세 (`docs/guide-spec-react.md`)

> 퍼블리싱 가이드 `/guide/*`의 명세입니다 (`AGENTS.md` 6.3절). publishTemplate의 가이드를 그대로 사용합니다.

## 1. 화면 구성

- 셸: `src/publish/guide/Guide.tsx`
    - 상단 헤더: `Publish Guide` 로고(→ `/guide/ialist`), 메뉴 검색(`GuideSearch`), 다크모드 스위치
    - 왼쪽 사이드바: `Publish ialist` 링크 + 섹션별 메뉴 (`sampleMeta.ts`)
    - 본문: 선택한 샘플 페이지(`<Outlet />`), 자동 퀵메뉴(`GuideAutoQuickMenu`)
- 스타일: `src/publish/guide/guide.css` + Tailwind 클래스

**사이드바 섹션** (`GUIDE_NAV_SECTIONS`)

| id | 라벨 | 샘플 폴더 |
| --- | --- | --- |
| `basic` | 기본설정 | `components/` 안의 `sampleBase`, `sampleNamingConvention`, `sampleTailwindStrategy`, `SampleFont`, `SampleColor`, `sampleFolderStructure` |
| `layout` | layout 컴포넌트 | `layout/` |
| `pageFeatures` | 페이지 기능 샘플 | `pageFeatures/` |
| `hooks` | hooks | `hooks/` |
| `components` | components | `components/` |

## 2. 샘플 페이지 작성 규칙

- 파일: `src/publish/guide/{섹션 폴더}/sample{Name}.tsx`, `export default`로 내보냅니다.
- 각 예시는 `GuideBox`로 감쌉니다.

```tsx
import { GuideBox } from "@/publish/guide/GuideBox";
import { Button } from "@/components/ui";

export default function SampleButtonPage() {
  return (
    <div>
      <h1>Button</h1>
      <GuideBox
        title="Variant"
        description="버튼 변형별 예시입니다."
        code={`<Button variant="primary">확인</Button>`}
      >
        <Button variant="primary">확인</Button>
      </GuideBox>
    </div>
  );
}
```

| `GuideBox` Props | Type | Default | 설명 |
| --- | --- | --- | --- |
| `title` | `string` | required | 예시 제목 |
| `description` | `ReactNode` | - | 설명 |
| `code` | `string` | - | 사용 코드 (shiki로 하이라이트) |
| `lang` | `string` | `"tsx"` | 코드 언어 |
| `darkMode` | `boolean` | `false` | 코드 블록 테마 |
| `children` | `ReactNode` | required | 실제 UI 예시 |

- 실제 구현을 확인해 작성하며, 존재하지 않는 Props·variant 예시를 만들지 않습니다.
- variant·size는 값마다 실제 UI 예시를 보여 줍니다.

## 3. 새 샘플 등록 절차

1. 샘플 페이지 파일을 만듭니다.
2. `src/publish/guide/sampleMeta.ts`의 해당 목록에 항목을 추가합니다. (`id`, `title`, `path: "/guide/{경로}"`, `description`, `section`)
3. `src/routes/routes.tsx`의 `/guide` children에 라우트를 추가합니다. (`handle: { title: getGuideChildTitle("{경로}") }`)
4. 소스 보기 기능을 쓰는 경우 `guideSampleSourceIndex.ts`도 확인합니다.

## 4. 관리 규칙

- 공통 컴포넌트를 추가하거나 Props·사용법을 바꾸면 **같은 작업에서** 해당 샘플 페이지를 갱신합니다.
- 가이드에는 공통 컴포넌트·훅·레이아웃·기본 규칙만 둡니다. 실제 서비스 페이지는 퍼블리싱 목록(`docs/ia-spec-react.md`)에서 관리합니다.
- `기본설정` 섹션의 규칙 페이지(Base, 네이밍, Tailwind 전략, 폴더 구조)와 `AGENTS.md`가 다르면 사용자에게 확인하고 둘을 함께 맞춥니다.

## 5. 확인 항목

- [ ] 사이드바 메뉴 클릭 시 해당 샘플 페이지가 열리고 현재 메뉴가 강조된다.
- [ ] 검색으로 메뉴를 찾을 수 있다.
- [ ] 다크모드 스위치로 테마가 바뀐다.
- [ ] 샘플 예시가 실제 컴포넌트 Props·동작과 일치한다.
