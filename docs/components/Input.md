# Input

> 파일: `src/components/ui/Input/Input.tsx` (+ `Input.module.css`) · 가이드: `/guide/input` (Samples · Playground 탭)
> 기준: 컴포넌트 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import {
  Input,
  InputGroup, InputGroupAddon, InputGroupInput, InputGroupText, InputGroupButton,
} from "@/components/ui";
```

## Props

**Input** — 단독 입력창

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` / `onChange` | `string` / 이벤트 | — | 제어형으로 씁니다 (값은 부모 `useState`) |
| `resetEnabled` | `boolean` | `false` | 값이 있을 때 지우기(×) 버튼 표시 |
| `resetValue` | `string` | `""` | 지우기를 누르면 들어갈 값. 제어형이면 `onChange`도 이 값으로 호출됩니다 |
| `onResetValue` | `(value) => void` | — | 지우기를 누른 뒤 호출 |
| `resetLabel` | `string` | `"리셋"` | 지우기 버튼의 읽기 이름 (→ `"입력값 지우기"` 권장) |
| 그 외 | `id`, `type`, `name`, `placeholder`, `disabled`, `readOnly`, `inputMode`, `maxLength`, `aria-*` 등 `<input>` 속성 | | 그대로 전달 |

**InputGroup** — 앞뒤에 글자·아이콘·버튼을 붙일 때

| 컴포넌트 | Props | 설명 |
| --- | --- | --- |
| `InputGroup` | `type`: `default` · `btnType` | 묶음 전체. `btnType`은 검색 버튼을 바깥 outline 버튼으로 분리한 모양 |
| `InputGroupAddon` | `align`: `inline-start` · `inline-end` · `block-start` · `block-end` | 붙일 위치 (앞 · 뒤 · 위 · 아래) |
| `InputGroupInput` | `Input`과 같음 | 묶음 안의 입력창 (묶음 안에서는 `Input` 대신 이것을 씀) |
| `InputGroupText` | `<span>` 속성 | 단위·안내 글자 (예: `원`, `세`, `개월`) |
| `InputGroupButton` | `Button`과 같음 | 묶음 안의 버튼 (예: 검색) |

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 기본 | `Input` | 이름, 생년월일 |
| 단위 붙임 | `InputGroup` + `InputGroupAddon align="inline-end"` + `InputGroupText` | 보험료 `원`, 보험 기간 `년` |
| 위·아래 안내 | `InputGroupAddon align="block-start"` · `"block-end"` | 입력 형식 안내 |
| 검색 | `InputGroup` + `InputGroupButton` / `type="btnType"` | 상품 검색 |
| 지우기 | `resetEnabled` | 긴 입력값 |
| 상태 | `disabled`, `readOnly`, `aria-invalid="true"`(오류 테두리) | 계산된 보험료는 `readOnly` |

## 접근성

- **라벨을 반드시 연결합니다.** 컴포넌트에 라벨 기능이 없으므로 페이지에서 `useId()`로 만든 id를 `<label htmlFor>`와 `Input id`에 함께 넣습니다. `placeholder`를 라벨 대신 쓰지 않습니다.
- 오류는 `aria-invalid="true"`와 함께 오류 문구를 화면에 보이게 쓰고, `aria-describedby`로 입력창에 연결합니다. 빨간 테두리만으로 오류를 알리지 않습니다.
- 안내 문구(입력 형식 등)도 `aria-describedby`로 연결합니다.
- 숫자 입력(금액·나이)은 `inputMode="numeric"`, 개인정보는 알맞은 `autoComplete`(`name`, `bday`, `tel`)를 지정합니다.
- 지우기 버튼은 `resetLabel="입력값 지우기"`처럼 무엇을 지우는지 알 수 있게 적습니다.
- id를 하드코딩(`id="name"`)하지 않습니다. 같은 화면에 두 번 쓰이면 충돌합니다.

```tsx
const nameId = useId();
const nameErrorId = useId();

<label htmlFor={nameId}>이름</label>
<Input
  id={nameId}
  value={name}
  onChange={(e) => setName(e.target.value)}
  aria-invalid={hasNameError}
  aria-describedby={hasNameError ? nameErrorId : undefined}
/>
{hasNameError && <p id={nameErrorId}>이름을 입력하세요.</p>}
```

## 하면 안 되는 것

- `className`으로 높이·테두리·글자 크기·색 바꾸기 → 필요한 모양은 variant로 추가합니다. 폭(`w-full`, `max-w-*`)만 허용합니다.
- `InputGroup` 안에서 `Input`을 직접 쓰기 → `InputGroupInput`을 씁니다. (안 그러면 테두리가 이중으로 그려짐)
- 단위(`원`, `세`)를 `placeholder`나 값에 섞어 넣기 → `InputGroupText`로 붙입니다.
- 계산된 결과(예상 보험료)를 `disabled`로 보여 주기 → 읽을 수 있어야 하므로 `readOnly`를 씁니다.
- 날짜 입력에 Input을 쓰기 → `DatePicker`를 씁니다.
