# Icon

> 파일: `src/components/ui/Icon/Icon.tsx` (+ `Icon.types.ts`, 그림 파일 `src/assets/icons/*.svg`) · 가이드: `/guide/icon` (Samples · Playground 탭)
> 기준: 템플릿 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import { Icon } from "@/components/ui";
```

## Props

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `name` | 아래 목록의 이름 | (필수) | `src/assets/icons/{name}.svg` 파일 이름 |
| `size` | `sm`(16) · `md`(24) · `lg`(48) 또는 숫자(px) | `md` | 가로·세로 크기 |
| 그 외 | `aria-hidden`, `aria-label`, `role` 등 `<svg>` 속성 | | 그대로 전달 |

- 없는 이름을 넣으면 아무것도 그리지 않고 콘솔에 경고만 남깁니다.

## 쓸 수 있는 아이콘 (`src/assets/icons/`, 32개)

| 분류 | 이름 |
| --- | --- |
| 동작 | `search` · `send` · `attachment` · `btn-close` · `options` · `menu-fold` · `menu-unfold` · `arrow-down` · `arrow-left-line` · `arrow-left-right` |
| 상태 | `check-line` · `check-mark` · `checkbox-circle` · `checkbox-circle-line` · `checkbox-circle-fill` · `close-circle` · `error-warning` · `error-warning-fill` · `loader` · `waiting-on` |
| 날짜 | `calendar` · `datepicker-left` · `datepicker-right` · `datepicker-left-double` · `datepicker-right-double` |
| 기타 | `admin` · `user-settings` · `ai-agent-line` · `calculator-on` · `identification-on` · `desktop-icon` · `logo` |

- 새 아이콘은 `src/assets/icons/`에 svg를 넣고 `Icon.types.ts`의 `IconName`에도 이름을 추가합니다.
- 색은 svg 파일에 들어 있습니다. 글자색을 따라가는 것(`currentColor`)은 `admin`, `datepicker-*` 5개뿐입니다. 나머지는 색이 고정입니다.

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 기본 크기 | `<Icon name="search" />` (`md`, 24px) | 상품 검색 |
| 크기 단계 | `size="sm"` · `"md"` · `"lg"` | 표 안 작은 아이콘은 `sm` |
| 숫자 크기 | `size={16}` | 다른 컴포넌트 안에 맞출 때 |

## 접근성

- **꾸밈 아이콘**(옆에 글자가 있음)은 `aria-hidden`을 붙여 읽히지 않게 합니다.
    - 예: `<Button><Icon name="calculator-on" aria-hidden />보험료 계산</Button>`
- **뜻이 있는 아이콘**(글자 없이 아이콘만 있음)은 아이콘이 아니라 **감싼 버튼에** `aria-label`을 붙입니다.
    - 예: `<Button iconSize="default" aria-label="검색"><Icon name="search" aria-hidden /></Button>`
- 아이콘만 단독으로 뜻을 전할 때(예: 표 안 상태 표시)는 `role="img"`와 `aria-label`을 함께 붙입니다.
    - 예: `<Icon name="checkbox-circle-fill" role="img" aria-label="가입가능" />`
- 상태를 아이콘 색만으로 구분하지 않습니다. 글자를 함께 둡니다.

## 하면 안 되는 것

- `className`으로 크기·색 바꾸기 → 크기는 `size`를 씁니다. 다른 색이 필요하면 svg 파일을 추가합니다.
    - 금지: `<Icon name="search" className="w-8 h-8 text-red-500" />`
    - 허용: `<Icon name="search" className="shrink-0" />` (배치), 감싼 부모의 `flex items-center gap-2`
- `<img src="/src/assets/icons/search.svg">`로 직접 넣기 → `Icon`을 씁니다.
- 외부 아이콘 꾸러미를 새로 설치하기 → 승인 없이 설치하지 않습니다 (`AGENTS.md` 2장).
- 아이콘과 글자 사이 간격에 `gap-1`, `mr-[6px]` 쓰기 → `2`·`4`·`6`만 씁니다.
