# Checkbox

> 파일: `src/components/ui/Checkbox/Checkbox.tsx` (+ `Checkbox.module.css`) · 가이드: `/guide/checkbox` (Samples · Playground 탭)
> 기준: 컴포넌트 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import { Checkbox, CheckboxGroup } from "@/components/ui";
```

## Props

**Checkbox** — 체크박스 하나 (전체가 `<label>`로 감싸져 글자를 눌러도 체크됨)

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | 글자 · 요소 | — | 체크박스 옆 글자 |
| `variant` | `default` · `spec` · `btn` | `default` | 기본 동그라미 체크 / 아이콘만 / 버튼 모양 |
| `checked` + `onCheckedChange` | `boolean` · `"indeterminate"` / 함수 | — | 제어형 (단독으로 쓸 때) |
| `defaultChecked` | `boolean` | `false` | 처음 체크 상태 (비제어형) |
| `value` | `string` | — | `CheckboxGroup` 안에서 항목 구분 값 |
| `disabled` | `boolean` | `false` | 선택 불가 |
| `children` | `<Checkbox.item />` + `<Checkbox.label>` | — | 라벨에 설명을 덧붙이는 등 직접 구성할 때 |
| 그 외 | `id`, `name`, `required`, `aria-invalid` 등 | | 체크박스(버튼)에 전달 |

**CheckboxGroup** — 여러 개를 배열 값으로 묶을 때: `value` + `onValueChange` (제어형) 또는 `defaultValue` (`string[]`)

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 기본 | `<Checkbox label="…" />` | 약관 동의 |
| 그룹 | `CheckboxGroup` + `Checkbox value="…"` | 관심 보장 선택 (암·뇌·심장) |
| 라벨 + 설명 | `children`에 `Checkbox.item` + `Checkbox.label` | "개인정보 수집 동의" + 한 줄 설명 |
| 오류 | `aria-invalid="true"` | 필수 약관 미동의 |
| 비활성 | `disabled` (체크/미체크 둘 다) | 가입 조건상 선택 불가 특약 |
| 아이콘만 | `variant="spec"` | 표 안 행 선택 |
| 버튼형 | `variant="btn"` + `label` | 특약 "적용" / "미적용" |

## 접근성

- Radix가 `role="checkbox"`, `aria-checked`, `Space` 키 토글을 자동으로 넣어 줍니다.
- **`label`이 없으면 이름이 없는 체크박스가 됩니다.** `variant="spec"`처럼 글자 없이 쓸 때는 `aria-label`을 반드시 넣습니다. 예: `aria-label="홍길동 고객 선택"`
- 여러 개를 묶을 때는 `CheckboxGroup`에 `role="group"`과 `aria-labelledby`(묶음 제목 id)를 넣습니다. 컴포넌트가 자동으로 넣어 주지 않습니다.
- 오류는 `aria-invalid="true"`(빨간 표시)와 함께 오류 문구를 보이게 쓰고 `aria-describedby`로 연결합니다. 예: "필수 약관에 동의해 주세요."
- 필수 약관은 `required`를 넣고 라벨에 "(필수)"를 글자로 적습니다.

```tsx
const titleId = useId();

<p id={titleId}>약관 동의</p>
<CheckboxGroup role="group" aria-labelledby={titleId} value={agreed} onValueChange={setAgreed} className="grid gap-2">
  <Checkbox value="terms" required label="(필수) 보험 약관 동의" />
  <Checkbox value="privacy" required label="(필수) 개인정보 수집·이용 동의" />
  <Checkbox value="marketing" label="(선택) 마케팅 정보 수신 동의" />
</CheckboxGroup>
```

## 하면 안 되는 것

- `className`·`wrapperClassName`·`labelClassName`으로 체크 아이콘 색·크기·라벨 글자 크기 바꾸기
    - 금지: `<Checkbox className="size-6 text-red-500" labelClassName="text-lg" />`
    - 허용: `<CheckboxGroup className="grid gap-4 md:grid-cols-2">` (배치)
- 묶음 간격에 `2`·`4`·`6` 외의 값 쓰기 (`gap-3`, `gap-5` 등)
- 하나만 고르는 선택에 체크박스 쓰기 → `Radio`를 씁니다. 켜고 끄는 설정은 `Toggle`을 씁니다.
- `CheckboxGroup` 안에서 `Checkbox`에 `value` 빠뜨리기 → 그룹 값에 반영되지 않습니다.
