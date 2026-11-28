# InputStepper

> 파일: `src/components/ui/InputStepper/InputStepper.tsx` (+ `InputStepper.module.css`) · 가이드: `/guide/input-stepper` (Samples · Playground 탭)
> 기준: 컴포넌트 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import { InputStepper } from "@/components/ui";
```

입력창 양옆에 −/+ (또는 ‹/›) 버튼이 붙어 숫자나 날짜를 한 단계씩 올리고 내립니다. `InputGroup`으로 만들어져 `Input`과 테두리·포커스 모양이 같습니다.

## Props

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `mode` | `number` · `date` | `number` | 숫자 입력 / 날짜 입력(`type="date"`) |
| `stepperVariant` | `plusMinus` · `chevron` | `plusMinus` | 버튼 모양 (−/+ 또는 ‹/›) |
| `step` | `number` | `1` | 한 번에 바뀌는 양. `date`에서는 **일(day)** 단위 |
| `min` / `max` | 숫자 또는 `"yyyy-MM-dd"` | — | 범위. 끝에 닿으면 해당 버튼이 비활성 |
| `value` / `onValueChange` | `string` / `(value) => void` | — | 제어형 (값은 **문자열**) |
| `defaultValue` | `string` | `""` | 처음 값 (비제어형) |
| `inputGroupType` | `default` · `btnType` | `default` | 바깥 `InputGroup` 모양 |
| `inputGroupClassName` | `string` | — | 바깥 묶음의 배치용 className |
| 그 외 | `id`, `name`, `disabled`, `readOnly`, `aria-*` 등 `<input>` 속성 | | 입력창에 전달 |

- `readOnly`면 직접 입력도, −/+ 버튼도 막힙니다.

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 숫자 · −/+ | `min`·`max` (+ 필요하면 `step={0.5}`) | 가입 금액(천만 원 단위), 보험 기간(년) |
| 숫자 · ‹/› | `stepperVariant="chevron"` | 납입 기간 |
| 날짜 · −/+ | `mode="date"` + `min`·`max` | 보험 시작일을 하루씩 조정 |
| 날짜 · 7일 단위 | `mode="date" stepperVariant="chevron" step={7}` | 주 단위 일정 |
| 상태 | `disabled`, `readOnly`, `aria-invalid`(오류 테두리) | 계산된 값은 `readOnly` |

```tsx
<InputStepper
  id={periodId}
  value={period}
  onValueChange={setPeriod}
  min={10}
  max={30}
  step={5}
/>
```

## 접근성

- **라벨을 반드시 연결합니다.** 페이지에서 `useId()`로 만든 id를 `<label htmlFor>`와 `InputStepper id`에 함께 넣습니다.
- `mode="number"` 입력창은 `type="number"`라 "스핀버튼"으로 읽히고, `min`·`max`·`step`이 그대로 전달됩니다. 키보드 ↑/↓로도 값이 바뀝니다.
- −/+ 버튼의 읽기 이름은 고정(`값 감소`·`값 증가`, 날짜는 `이전 날짜`·`다음 날짜`)입니다. 바꿀 수 없으므로 **라벨을 꼭 붙여** 무엇의 값인지 알 수 있게 합니다.
- 단위(`년`, `만원`)는 라벨에 적습니다. 예: "보험 기간(년)".
- 오류는 `aria-invalid`와 함께 오류 문구를 화면에 보이게 쓰고 `aria-describedby`로 연결합니다.
- `mode="date"`는 브라우저 기본 날짜 칸이라 보이는 형식이 브라우저마다 다릅니다. 값은 늘 `yyyy-MM-dd`입니다.

## 하면 안 되는 것

- `className`·`inputGroupClassName`으로 높이·테두리·글자 크기·색 바꾸기 → 필요한 모양은 variant로 추가합니다.
    - 금지: `<InputStepper className="text-lg border-2" />`
    - 허용: `<InputStepper inputGroupClassName="w-full" />` (폭), 감싼 부모의 `flex flex-col gap-2`
- 값을 숫자로 넘기기(`value={10}`) → 값은 문자열입니다. `value={String(period)}`처럼 넘깁니다.
- 날짜를 큰 폭으로 고르는 곳에 쓰기 → 달력이 필요하면 `DatePicker`를 씁니다.
- `min`·`max` 없이 쓰기 → 0 아래, 상품 한도 위로 값이 넘어갑니다. 범위를 꼭 적습니다.
- 간격에 `gap-3`, `mt-[10px]` 쓰기 → `2`·`4`·`6`만 씁니다.
