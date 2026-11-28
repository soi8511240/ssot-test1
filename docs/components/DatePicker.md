# DatePicker

> 파일: `src/components/ui/DatePicker/DatePicker.tsx` (+ `DatePicker.module.css`) · 가이드: `/guide/datepicker` (Samples · Playground 탭)
> 기준: 컴포넌트 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import {
  DatePicker, DateRangePicker, DateRangePickerTwoPickers,
  type DateRange,
} from "@/components/ui";
```

세 가지가 있습니다.

- `DatePicker` — 날짜 하나 (누르면 달력이 뜨고, 고르면 바로 닫힘)
- `DateRangePicker` — 기간 하나 (달력에서 시작·끝을 고른 뒤 **적용**을 눌러야 확정)
- `DateRangePickerTwoPickers` — 시작일·종료일을 `DatePicker` 두 개로 나눠 고름

## Props

**공통** (세 컴포넌트 모두)

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` / `onValueChange` | `Date \| null` (기간은 `DateRange \| null`, `DateRange` = `{ from, to }`) | — | 제어형 (값은 부모 `useState`). 값이 없을 때는 `null`을 넘깁니다. `undefined`를 넘기면 비제어형으로 바뀌어 이전 값이 남습니다 |
| `defaultValue` | 위와 같음 | — | 처음 값 (비제어형) |
| `variant` | `default` · `btnType` | `default` | `btnType`은 달력 아이콘을 버튼 칸으로 분리한 모양 |
| `formatString` | date-fns 형식 | `"yyyy.MM.dd"` | 화면에 보이는 날짜 형식 |
| `align` | `start` · `center` · `end` | `start` | 달력이 열리는 가로 위치 |
| `side` | `top` · `right` · `bottom` · `left` | `bottom` | 달력이 열리는 방향 |
| `calendarProps` | react-day-picker 옵션 | — | 고를 수 없는 날짜(`disabled`) 등 |

**DatePicker 전용**

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `placeholder` | `string` | `"날짜를 선택하세요"` | 비었을 때 글자 |
| `name` | `string` | — | 주면 폼용 숨은 값(`yyyy-MM-dd`)을 함께 보냄 |
| `resetEnabled` | `boolean` | `false` | 값이 있을 때 지우기(×) 표시 |
| `resetValue` / `onResetValue` / `resetLabel` | `Date` / 함수 / `string` | `undefined` / — / `"선택 해제"` | 지우기 동작 |
| 그 외 | `id`, `disabled`, `aria-*` 등 `<button>` 속성 | | 트리거 버튼에 전달 |

**DateRangePicker 전용**: `placeholder` (기본 `"기간을 선택하세요"`). `name`·`resetEnabled`는 없습니다.

**DateRangePickerTwoPickers 전용**

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `startPlaceholder` / `endPlaceholder` | `string` | `"시작일"` / `"종료일"` | 각 칸의 빈 글자 |
| `fromName` / `toName` | `string` | — | 폼용 숨은 값 이름 |
| `resetEnabled` | `boolean` | `false` | 각 칸에 지우기(×) 표시 |

- 시작일 이후 날짜는 종료일 달력에서, 종료일 이후 날짜는 시작일 달력에서 자동으로 막힙니다.

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 기본 · 버튼형 | `DatePicker` / `variant="btnType"` | 보험 시작일 |
| 상태 | `defaultValue`, `disabled`, `aria-invalid="true"`(오류 테두리) | 시작일 오류 |
| 지우기 | `resetEnabled` (기본·`btnType` 모두) | 선택 사항인 날짜 |
| 제어형 | `value` + `onValueChange` | 계산에 쓰는 날짜 |
| 고를 수 있는 날 제한 | `calendarProps={{ disabled: … }}` (이전·이후·구간·주말·특정 날) | 오늘 이후만 시작일로 |
| 다른 형식 | `formatString="yyyy년 MM월 dd일"` | 출력용 화면 |
| 기간 | `DateRangePicker` (기본·제어형·비활성·날 제한·`formatString`) | 계약 기간 조회 |
| 기간 두 칸 | `DateRangePickerTwoPickers` | 계약 시작일 ~ 만기일 |

```tsx
<DatePicker
  value={startDate}
  onValueChange={setStartDate}
  placeholder="보험 시작일"
  calendarProps={{ disabled: { before: new Date() } }}
  name="insuranceStartDate"
/>
```

## 접근성

- **라벨을 반드시 연결합니다.** 트리거는 `<button>`이라 라벨이 없으면 "2026.12.01"처럼 날짜만 읽힙니다. 라벨과 선택값을 함께 읽히도록 `aria-labelledby`에 라벨 id와 트리거 id를 같이 넣습니다.
- `placeholder`를 라벨 대신 쓰지 않습니다. 값을 고르면 사라집니다.
- 오류는 `aria-invalid="true"`와 함께 오류 문구를 화면에 보이게 쓰고 `aria-describedby`로 연결합니다.
- 키보드: 트리거에서 Enter·Space로 달력을 열고, 방향키로 날짜 이동, Enter로 선택, Esc로 닫습니다. 키보드로 끝까지 고를 수 있는지 확인합니다.
- 화면 날짜는 `formatString`(기본 `yyyy.MM.dd`), 폼으로 보내는 값은 늘 `yyyy-MM-dd`입니다. 둘을 섞어 쓰지 않습니다.
- 지우기(×)는 키보드로 닿지 않습니다. 꼭 지울 수 있어야 하면 화면에 따로 "선택 해제" 버튼을 둡니다.
- `DateRangePickerTwoPickers`는 각 칸에 라벨을 붙일 방법이 없습니다. 칸마다 라벨이 필요하면 `DatePicker` 두 개를 직접 씁니다.

```tsx
const labelId = useId();
const pickerId = useId();

<span id={labelId}>보험 시작일</span>
<DatePicker id={pickerId} aria-labelledby={`${labelId} ${pickerId}`} … />
```

## 하면 안 되는 것

- `className`·`contentClassName`으로 높이·테두리·글자 크기·색 바꾸기 → `variant`를 쓰거나 새로 추가합니다.
    - 금지: `<DatePicker className="h-12 border-2 text-lg">`
    - 허용: `<DatePicker className="w-full">` (폭), 감싼 부모의 `flex gap-2`
- 날짜를 `Input`(`type="text"`)으로 받기 → `DatePicker`를 씁니다. 하루씩 넘기는 화면만 `InputStepper mode="date"`를 씁니다.
- `DateRangePicker`에서 날짜만 고르고 끝났다고 여기기 → **적용**을 눌러야 값이 바뀝니다. 안내 문구에 적어 둡니다.
- 간격에 `gap-3`, `mt-[10px]` 쓰기 → `2`·`4`·`6`만 씁니다.
