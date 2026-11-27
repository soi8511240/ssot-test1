# Chip

> 파일: `src/components/ui/Chip/Chip.tsx` (+ `Chip.module.css`) · 가이드: `/guide/chip` (Samples · Playground 탭)
> 기준: 템플릿 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import { Chip, Icon } from "@/components/ui";
```

## Props

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `variant` | `tint` · `solid` · `stateYes` · `stateNo` · `iconData` | `tint` | 모양 |
| `color` | `blue` · `green` · `yellow` · `red` · `purple` · `gray` | 없음 | 색 (`tint`·`solid`에서만 씀) |
| `asChild` | `boolean` | `false` | 자식 요소(예: 링크)에 칩 모양을 입힘 |
| 그 외 | `title`, `aria-*` 등 `<span>` 속성 | | 그대로 전달 |

- 기본 태그는 `<span>`입니다. 누를 수 있는 기능은 없습니다.

## 쓸 수 있는 조합 (가이드에 있는 것만)

| variant | color | 구성 | 용도 (보험 설계 예) |
| --- | --- | --- | --- |
| `tint` | 6색 모두 | 글자만 | 연한 꼬리표 (상품 구분: 종신·건강·실손) |
| `solid` | 6색 모두 | 글자만 | 눈에 띄어야 하는 꼬리표 (신상품, 추천) |
| `stateYes` | — | `Icon name="checkbox-circle-fill"` + 글자 | 긍정 상태 (가입가능) |
| `stateNo` | — | `Icon name="error-warning-fill"` + 글자 | 부정 상태 (판매중지) |
| `iconData` | — | `Icon name="attachment"` + 글자/개수 | 첨부 파일 개수, 파일 이름 |
| `iconData` + `asChild` | — | `<a>` + `Icon` + 글자 | 첨부 파일 내려받기 링크 |

```tsx
<Chip variant="stateYes">
  <Icon name="checkbox-circle-fill" aria-hidden />
  <span>가입가능</span>
</Chip>
<Chip variant="stateNo">
  <Icon name="error-warning-fill" aria-hidden />
  <span>판매중지</span>
</Chip>
```

- 위 표에 없는 조합(예: `stateYes` + `color="red"`)은 쓰지 않습니다. 필요하면 가이드에 먼저 추가합니다.

## 접근성

- 상태는 **글자로** 적습니다. 색이나 아이콘만으로 "가입가능/판매중지"를 구분하지 않습니다.
- 칩 안의 아이콘은 꾸밈이므로 `aria-hidden`을 붙입니다. 글자가 이미 뜻을 전달합니다.
- 숫자만 있는 칩(예: 첨부 `2`)은 무엇의 개수인지 알 수 있게 `aria-label="첨부 파일 2개"`를 붙입니다.
- 링크로 쓸 때는 `asChild`로 `<a href>`를 감쌉니다. 새 창으로 열면(`target="_blank"`) `rel="noreferrer"`를 함께 적고, 글자에 "(새 창)"을 알 수 있게 합니다.
- 칩은 버튼이 아닙니다. `onClick`을 붙여 누르게 만들지 않습니다. 눌러야 하면 `Button`을 씁니다.

## 하면 안 되는 것

- `className`으로 색·크기·모서리·글자 굵기 바꾸기 → `variant`·`color`를 쓰거나 새 variant를 추가합니다.
    - 금지: `<Chip className="bg-red-100 text-red-600 text-xs rounded-none">`
    - 허용: 여러 칩을 감싼 부모의 `flex flex-wrap gap-2`
- 칩 사이 간격에 `gap-1`, `gap-3`, `ml-[5px]` 쓰기 → 간격은 `2`·`4`·`6`만 씁니다. (칩끼리는 보통 `gap-2`)
- `<Chip onClick>`으로 필터 버튼 만들기 → `Button`이나 `Toggle`을 씁니다.
- 긴 문장을 칩에 넣기 → 칩은 줄바꿈되지 않습니다(`nowrap`). 짧은 낱말만 넣습니다.
