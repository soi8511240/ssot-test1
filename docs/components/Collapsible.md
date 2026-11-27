# Collapsible

> 파일: `src/components/ui/Collapsible/Collapsible.tsx` (+ `Collapsible.variants.ts`, `Collapsible.module.scss`) · 가이드: `/guide/collapsible` (Samples · Playground 탭)
> 기준: 템플릿 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import {
  Collapsible, CollapsibleTrigger, CollapsibleContent,
  CollapsibleGroup, collapsibleChevronClassName,
} from "@/components/ui";
```

## Props

**Collapsible** — 접고 펼치는 한 덩어리 (Radix Collapsible 기반)

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | 처음에 펼쳐진 상태로 시작 |
| `open` / `onOpenChange` | `boolean` / `(open) => void` | — | 제어형 (값은 부모 `useState`) |
| `disabled` | `boolean` | `false` | 접기·펼치기를 막음 |
| `value` | `string` | — | **`CollapsibleGroup` 안에서만** 씀. 항목 이름 (이때 `open`·`defaultOpen`은 쓰지 않음) |

**CollapsibleGroup** — 여러 개를 묶어 열림을 함께 관리

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `type` | `single` · `multiple` | `single` | 하나만 열림 / 여러 개 동시에 열림 |
| `defaultValue` | `string` (single) · `string[]` (multiple) | 없음 · `[]` | 처음에 열려 있을 항목 |
| `value` / `onValueChange` | 위와 같음 | — | 제어형 |
| `collapsible` | `boolean` | `true` | (single 전용) 열린 항목을 다시 눌러 닫을 수 있는지 |

**그 밖의 부품**

| 이름 | 설명 |
| --- | --- |
| `CollapsibleTrigger` | 누르는 줄. `<button type="button">`으로 그려짐. `disabled` 가능 |
| `CollapsibleContent` | 펼쳐지는 본문 |
| `collapsibleChevronClassName` | 화살표 아이콘에 주면 열릴 때 회전 (`Collapsible.variants.ts`) |

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 기본 | `Collapsible` + `Trigger`(글자 + 화살표) + `Content` | 특약 상세 펼치기 |
| 하나만 열림 | `CollapsibleGroup type="single"` | 담보별 설명 목록 |
| 여러 개 열림 | `CollapsibleGroup type="multiple"` | 여러 특약을 함께 비교 |
| 처음부터 열림 | `defaultOpen` | 꼭 읽어야 하는 유의사항 요약 |
| 제어형 + 바깥 버튼 | `open` · `onOpenChange` + `Button` | "모두 펼치기" 버튼 |
| 비활성 트리거 | `CollapsibleTrigger disabled` | 아직 계산 전인 항목 |

```tsx
<Collapsible>
  <CollapsibleTrigger>
    <span>암진단 특약 상세</span>
    <ChevronDownIcon className={collapsibleChevronClassName} aria-hidden />
  </CollapsibleTrigger>
  <CollapsibleContent>보장 내용, 면책 기간 …</CollapsibleContent>
</Collapsible>
```

## 접근성

- 트리거에는 `aria-expanded`(열림 여부)와 `aria-controls`가 자동으로 붙습니다. 직접 넣지 않습니다.
- 트리거 글자는 **무엇이 펼쳐지는지** 알 수 있게 씁니다. "더보기"만 쓰지 말고 "암진단 특약 상세"처럼 적습니다.
- 화살표 아이콘은 꾸밈이므로 `aria-hidden`을 붙입니다.
- 트리거는 Tab으로 이동하고 Enter·Space로 엽니다. `CollapsibleTrigger` 대신 `<div onClick>`을 쓰지 않습니다.
- 포커스 테두리(`:focus-visible`)를 없애지 않습니다.

## 하면 안 되는 것

- `className`으로 테두리·배경·글자 크기·안쪽 여백 바꾸기 → 필요한 모양은 스타일 파일에 추가합니다.
    - 금지: `<CollapsibleTrigger className="bg-blue-50 text-lg p-3">`
    - 허용: `<Collapsible className="w-full max-w-md">` (폭), 감싼 부모의 `flex flex-col gap-4`
- 그룹 바깥에서 `Collapsible value="a"` 쓰기 → 그룹이 없으면 무시되고 따로 동작합니다.
- 그룹 안 항목에 `open`·`defaultOpen` 넣기 → 그룹의 `value`·`defaultValue`로 관리합니다.
- 간격에 `gap-3`, `mt-[10px]` 쓰기 → `2`·`4`·`6`만 씁니다.
