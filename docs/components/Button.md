# Button

> 파일: `src/components/ui/Button/Button.tsx` (+ `Button.module.css`) · 가이드: `/guide/button` (Samples · Playground 탭)
> 기준: 컴포넌트 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import { Button } from "@/components/ui";
```

## Props

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `variant` | `default` · `outline` · `text` · `ghost` | `default` | 모양 |
| `color` | `default` · `black` · `gray` · `grayBg` | `default` | 색 |
| `size` | `default`(높이 48) · `md`(40) · `sm`(32) | `default` | **글자 버튼** 크기 |
| `iconSize` | `default`(40×40) · `md`(36×36) · `sm`(28×28) | — | **아이콘 전용 버튼** 크기(정사각형). 지정하면 `size`는 적용되지 않습니다 |
| `shape` | `default` · `square` | `default` | 둥근형 / 각진형 |
| `type` | `button` · `submit` · `reset` | **`button`** | 폼 제출 버튼만 `type="submit"`을 명시합니다. `asChild`일 때는 붙지 않음 |
| `asChild` | `boolean` | `false` | 자식 요소(예: 링크)에 버튼 모양을 입힘 |
| 그 외 | `disabled`, `onClick` 등 `<button>` 속성 | | 그대로 전달 |

## 쓸 수 있는 조합 (가이드에 있는 것만)

| variant | color | 용도 |
| --- | --- | --- |
| `default` | `default` | 주요 동작 (다음, 확인, 가입 설계 저장) |
| `default` | `black` | 강조가 필요한 보조 동작 |
| `outline` | `default` | 보조 동작 (이전, 취소) |
| `outline` | `gray` · `grayBg` | 덜 중요한 동작, 아이콘 전용 사각 버튼 |
| `text` | `default` | 글자형 동작 (자세히 보기) |
| `ghost` | `default` | 아이콘 동작 (닫기 등) |

- 위 표에 없는 조합(예: `ghost` + `black`)은 쓰지 않습니다. 필요하면 가이드에 먼저 추가합니다.
- 아이콘 전용 버튼은 위 조합에 `iconSize`를 더해 씁니다. 예: `variant="outline" color="gray" iconSize="md"` (가이드 "iconSize" 예시)

## 접근성

- `type` 기본값이 `button`이라 폼 안에 두어도 실수로 제출되지 않습니다. **폼 제출 버튼은 반드시 `type="submit"`을 적습니다.** (적지 않으면 Enter·클릭으로 제출되지 않음)
- 아이콘만 있는 버튼(`iconSize` 사용)은 `aria-label`이 필수입니다. 예: `<Button variant="ghost" iconSize="sm" aria-label="닫기"><Icon name="btn-close" aria-hidden /></Button>`
- 사용할 수 없는 상태는 `disabled` 속성으로 표시합니다. 색만 흐리게 바꾸지 않습니다.
- 포커스 표시(`:focus-visible`)를 없애지 않습니다.
- 페이지 이동은 `<Button asChild><Link to="…">…</Link></Button>`로 링크 의미를 유지합니다. `onClick`으로 `navigate`만 하는 버튼으로 만들지 않습니다.

## 하면 안 되는 것

- `className`으로 색·높이·글자 크기·모서리를 바꾸기 → `variant`·`size`·`shape`·`color`를 쓰거나 새 variant를 추가합니다.
    - 금지: `<Button className="bg-red-500 h-12 rounded-none">`
    - 허용: `<Button className="w-full">` (배치), 감싼 부모의 `gap-2`
- 버튼 대신 `<div onClick>` · `<span onClick>` 쓰기
- 한 화면에 주요 버튼(`variant="default"`)을 여러 개 나란히 두기 → 하나만 주요, 나머지는 `outline`
