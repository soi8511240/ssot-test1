# Accordion

> 파일: `src/components/ui/Accordion/Accordion.tsx` (+ `Accordion.variants.ts`, `Accordion.module.scss`) · 가이드: `/guide/accordion`
> 기준: 템플릿 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui";
```

## Props

| 컴포넌트 | Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `Accordion` | `type` | `single` · `multiple` | — (필수) | 하나만 열림 / 여러 개 동시에 열림 |
| `Accordion` | `collapsible` | `boolean` | `false` | `type="single"`에서 열린 항목을 다시 눌러 닫을 수 있게 함 |
| `Accordion` | `defaultValue` / `value` + `onValueChange` | `string` (`multiple`이면 `string[]`) | — | 처음 열어 둘 항목 / 제어형 |
| `Accordion` | `variant` · `size` | `default` · `bordered` · `ghost` / `default` · `sm` · `md` · `lg` | `default` | **현재 스타일이 연결되어 있지 않아 바꿔도 모양이 같습니다. 쓰지 않습니다.** |
| `AccordionItem` | `value` | `string` | — (필수) | 항목 구분 값 |
| `AccordionItem` | `disabled` | `boolean` | `false` | 열 수 없는 항목 |
| `AccordionItem` · `Trigger` · `Content` | `variant` | 각각 `bordered`·`ghost` / `compact`·`expanded` / `padded`·`minimal` | `default` | 위와 같은 이유로 쓰지 않습니다 |

- `AccordionTrigger`는 오른쪽에 펼침 화살표(▼)가 자동으로 붙습니다. 직접 넣지 않습니다.

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 하나씩 열기 | `type="single" collapsible` | 상품별 보장 내용 펼치기 |
| 여러 개 열기 | `type="multiple"` | 특약 여러 개를 동시에 비교 |
| 처음부터 열림 | `defaultValue="item-2"` | 주계약 보장은 기본으로 펼침 |
| 비활성 항목 | `AccordionItem disabled` | 가입 불가 특약 |

- 가이드의 "커스텀 스타일이 적용된 Accordion"(컴팩트·강조) 예시는 `className`으로 테두리·배경·글자 크기를 바꾸므로 5.1.1에 맞지 않습니다. **따라 쓰지 않습니다.** 그런 모양이 필요하면 variant에 스타일을 먼저 만들어 달라고 요청합니다.

## 접근성

- Radix가 버튼 역할, `aria-expanded`, `aria-controls`, 화살표·Home·End 키 이동을 자동으로 넣어 줍니다. 트리거를 `<div>`로 바꾸거나 `onClick`을 따로 달지 않습니다.
- 트리거 글자는 펼쳤을 때 무엇이 나오는지 알 수 있게 씁니다. 예: "자세히" (X) → "암 진단비 보장 내용" (O)
- 트리거는 `<h3>` 같은 제목 태그가 아닌 `Header`(div)로 감싸져 있습니다. 페이지 제목 구조가 필요하면 아코디언 바깥에 제목을 둡니다.
- 중요한 정보(필수 고지 사항, 면책 조건)를 닫힌 아코디언 안에만 두지 않습니다.

## 하면 안 되는 것

- `className`으로 테두리·배경·여백·글자 크기 바꾸기
    - 금지: `<AccordionTrigger className="py-2 text-sm">`, `<Accordion className="bg-bg-box rounded-lg p-2">`
    - 허용: `<Accordion type="single" collapsible className="w-full max-w-md">` (폭), 바깥 묶음의 `mt-4`
- 아코디언끼리·주변 간격에 `2`·`4`·`6` 외의 값 쓰기 (`space-y-3`, `mb-5` 등)
- `AccordionContent`에 `className` 주기 → 바깥과 안쪽 상자에 두 번 적용됩니다. 배치가 필요하면 내용 안에 `<div className="grid gap-2">`를 둡니다.
- 아코디언 안에 아코디언을 겹쳐 넣기
