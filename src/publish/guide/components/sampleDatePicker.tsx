import {
  DatePicker,
  DateRangePicker,
  DateRangePickerTwoPickers,
  type DateRange,
} from "@/components/ui";
import * as React from "react";
import { format, isValid, parse } from "date-fns";

import { Input } from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  PlaygroundSwitchControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";

type DatePickerVariant = "default" | "btnType";
type DatePickerAlign = "start" | "center" | "end";
type DatePickerSide = "top" | "right" | "bottom" | "left";
type DisabledDaysPreset = "none" | "beforeToday" | "weekend";

const VALUE_FORMAT = "yyyy-MM-dd";
const DEFAULT_PLACEHOLDER = "날짜를 선택하세요";
const DEFAULT_FORMAT_STRING = "yyyy.MM.dd";
const FORMAT_STRINGS = ["yyyy.MM.dd", "yyyy-MM-dd", "yyyy년 MM월 dd일"];

const DISABLED_DAYS_OPTIONS = [
  { value: "none", label: "없음" },
  { value: "beforeToday", label: "오늘 이전" },
  { value: "weekend", label: "주말" },
];

const DISABLED_DAYS_CODE: Record<DisabledDaysPreset, string> = {
  none: "",
  beforeToday: "calendarProps={{ disabled: { before: new Date() } }}",
  weekend:
    "calendarProps={{ disabled: (date) => date.getDay() === 0 || date.getDay() === 6 }}",
};

/** 미리 정한 선택 불가 날짜 조건을 calendarProps로 바꿉니다. */
function getCalendarProps(preset: DisabledDaysPreset) {
  if (preset === "beforeToday") {
    return { disabled: { before: new Date() } };
  }
  if (preset === "weekend") {
    return {
      disabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    };
  }
  return undefined;
}

function formatValue(date: Date | undefined) {
  return date ? format(date, VALUE_FORMAT) : undefined;
}

type DatePickerPlaygroundOptions = {
  variant: DatePickerVariant;
  selectedDate: Date | undefined;
  placeholder: string;
  formatString: string;
  isDisabled: boolean;
  isInvalid: boolean;
  isResetEnabled: boolean;
  disabledDays: DisabledDaysPreset;
  align: DatePickerAlign;
  side: DatePickerSide;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  variant,
  selectedDate,
  placeholder,
  formatString,
  isDisabled,
  isInvalid,
  isResetEnabled,
  disabledDays,
  align,
  side,
}: DatePickerPlaygroundOptions) {
  const initialValue = selectedDate
    ? `new Date(${selectedDate.getFullYear()}, ${selectedDate.getMonth()}, ${selectedDate.getDate()})`
    : "";
  const props = [
    "id={pickerId}",
    "aria-labelledby={`${labelId} ${pickerId}`}",
    variant === "default" ? "" : `variant="${variant}"`,
    "value={date}",
    "onValueChange={(next) => setDate(next ?? null)}",
    placeholder === DEFAULT_PLACEHOLDER ? "" : `placeholder="${placeholder}"`,
    formatString === DEFAULT_FORMAT_STRING
      ? ""
      : `formatString="${formatString}"`,
    isDisabled ? "disabled" : "",
    isInvalid ? 'aria-invalid="true"' : "",
    isResetEnabled ? "resetEnabled" : "",
    DISABLED_DAYS_CODE[disabledDays],
    align === "start" ? "" : `align="${align}"`,
    side === "bottom" ? "" : `side="${side}"`,
  ]
    .filter(Boolean)
    .map((prop) => `  ${prop}`)
    .join("\n");

  return `const labelId = useId();
const pickerId = useId();
// 값이 없는 제어형은 null (undefined를 넘기면 비제어형으로 동작)
const [date, setDate] = useState<Date | null>(${initialValue || "null"});

<span id={labelId}>보험 시작일</span>
<DatePicker
${props}
/>`;
}

/** DatePicker Playground (이 페이지에서만 사용) */
function DatePickerPlayground() {
  const labelId = React.useId();
  const pickerId = React.useId();
  const [variant, setVariant] = React.useState<DatePickerVariant>("default");
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [placeholder, setPlaceholder] = React.useState(DEFAULT_PLACEHOLDER);
  const [formatString, setFormatString] = React.useState(
    DEFAULT_FORMAT_STRING,
  );
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [isResetEnabled, setIsResetEnabled] = React.useState(true);
  const [disabledDays, setDisabledDays] =
    React.useState<DisabledDaysPreset>("none");
  const [align, setAlign] = React.useState<DatePickerAlign>("start");
  const [side, setSide] = React.useState<DatePickerSide>("bottom");
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const updateSelectedDate = (nextDate: Date | undefined) => {
    setSelectedDate(nextDate);
  };

  const handleChangeDatePickerValue = (nextDate: Date | undefined) => {
    updateSelectedDate(nextDate);
    addEventLog("onValueChange", formatValue(nextDate));
  };

  const handleResetDatePickerValue = (nextDate: Date | undefined) => {
    addEventLog("onResetValue", formatValue(nextDate));
  };

  const handleChangeValueControl = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextText = event.target.value;
    if (!nextText) {
      updateSelectedDate(undefined);
      return;
    }
    const nextDate = parse(nextText, VALUE_FORMAT, new Date());
    if (isValid(nextDate)) {
      updateSelectedDate(nextDate);
    }
  };

  const handleClickReset = () => {
    setVariant("default");
    updateSelectedDate(undefined);
    setPlaceholder(DEFAULT_PLACEHOLDER);
    setFormatString(DEFAULT_FORMAT_STRING);
    setIsDisabled(false);
    setIsInvalid(false);
    setIsResetEnabled(true);
    setDisabledDays("none");
    setAlign("start");
    setSide("bottom");
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "variant",
      type: '"default" | "btnType"',
      description: "btnType은 달력 아이콘을 버튼 칸으로 분리한 모양",
      control: (
        <PlaygroundRadioControl
          label="variant"
          value={variant}
          options={["default", "btnType"]}
          onValueChange={(next) => setVariant(next as DatePickerVariant)}
        />
      ),
    },
    {
      name: "value",
      type: "Date | null",
      description: "선택한 날짜 (onValueChange와 함께 제어형)",
      control: (
        <Input
          type="date"
          value={formatValue(selectedDate) ?? ""}
          onChange={handleChangeValueControl}
          aria-label="value"
          className="w-full max-w-xs"
        />
      ),
    },
    {
      name: "placeholder",
      type: "string",
      description: "비었을 때 글자 (라벨 대신 쓰지 않음)",
      control: (
        <PlaygroundTextControl
          label="placeholder"
          value={placeholder}
          onValueChange={setPlaceholder}
        />
      ),
    },
    {
      name: "formatString",
      type: "string (date-fns 형식)",
      description: "화면에 보이는 날짜 형식",
      control: (
        <PlaygroundRadioControl
          label="formatString"
          value={formatString}
          options={FORMAT_STRINGS}
          onValueChange={setFormatString}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "트리거를 누를 수 없음",
      control: (
        <PlaygroundSwitchControl
          label="disabled"
          checked={isDisabled}
          onCheckedChange={setIsDisabled}
        />
      ),
    },
    {
      name: "aria-invalid",
      type: '"true"',
      description: "오류 테두리 (오류 문구와 aria-describedby를 함께 씀)",
      control: (
        <PlaygroundSwitchControl
          label="aria-invalid"
          checked={isInvalid}
          onCheckedChange={setIsInvalid}
        />
      ),
    },
    {
      name: "resetEnabled",
      type: "boolean",
      description: "값이 있을 때 지우기(×) 표시 (disabled이면 숨김)",
      control: (
        <PlaygroundSwitchControl
          label="resetEnabled"
          checked={isResetEnabled}
          onCheckedChange={setIsResetEnabled}
        />
      ),
    },
    {
      name: "calendarProps.disabled",
      type: "Matcher",
      description: "고를 수 없는 날짜 (예시 조건)",
      control: (
        <PlaygroundRadioControl
          label="calendarProps.disabled"
          value={disabledDays}
          options={DISABLED_DAYS_OPTIONS}
          onValueChange={(next) =>
            setDisabledDays(next as DisabledDaysPreset)
          }
        />
      ),
    },
    {
      name: "align",
      type: '"start" | "center" | "end"',
      description: "달력이 열리는 가로 위치",
      control: (
        <PlaygroundRadioControl
          label="align"
          value={align}
          options={["start", "center", "end"]}
          onValueChange={(next) => setAlign(next as DatePickerAlign)}
        />
      ),
    },
    {
      name: "side",
      type: '"top" | "right" | "bottom" | "left"',
      description: "달력이 열리는 방향 (공간이 모자라면 반대쪽으로 열릴 수 있음)",
      control: (
        <PlaygroundRadioControl
          label="side"
          value={side}
          options={["top", "right", "bottom", "left"]}
          onValueChange={(next) => setSide(next as DatePickerSide)}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 날짜를 골라도 Controls의 value가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode({
        variant,
        selectedDate,
        placeholder,
        formatString,
        isDisabled,
        isInvalid,
        isResetEnabled,
        disabledDays,
        align,
        side,
      })}
      controls={controls}
      controlsNote="달력 열림(open)은 DatePicker 안에서만 관리해 밖에서 제어할 수 없으므로 Controls에 넣지 않았습니다. DateRangePicker·DateRangePickerTwoPickers와 name·resetValue는 Samples 탭의 예시를 참고하세요."
      state={{
        value: formatValue(selectedDate) ?? null,
        variant,
        placeholder,
        formatString,
        disabled: isDisabled,
        "aria-invalid": isInvalid,
        resetEnabled: isResetEnabled,
        calendarDisabled: disabledDays,
        align,
        side,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="flex w-full max-w-md flex-col gap-2">
        <span id={labelId} className="text-sm text-font-g">
          보험 시작일
        </span>
        <DatePicker
          id={pickerId}
          aria-labelledby={`${labelId} ${pickerId}`}
          variant={variant}
          value={selectedDate ?? null}
          onValueChange={handleChangeDatePickerValue}
          placeholder={placeholder}
          formatString={formatString}
          disabled={isDisabled}
          aria-invalid={isInvalid ? "true" : undefined}
          resetEnabled={isResetEnabled}
          onResetValue={handleResetDatePickerValue}
          calendarProps={getCalendarProps(disabledDays)}
          align={align}
          side={side}
        />
      </div>
    </GuidePlayground>
  );
}

function SampleDatePickerPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedRange, setSelectedRange] = React.useState<DateRange>();

  return (
    <div className="guide-layout">
      <h1 className="guide-title">DatePicker Samples</h1>

      {/* ── DatePicker ─────────────────────────────────────────────────── */}
      <div className="guide-content">
        <GuideSampleTabs playground={<DatePickerPlayground />}>
        <GuideBox
          title="Basic date picker"
          description="기본 placeholder, 기본값, 비활성화 상태를 한 번에 확인합니다."
          code={`
  <DatePicker placeholder="YYYY.MM.DD" />
  <DatePicker defaultValue={new Date(2026, 2, 7)} />
  <DatePicker disabled defaultValue={new Date(2026, 2, 15)} />
  <DatePicker defaultValue={new Date(2026, 2, 15)} aria-invalid="true" />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">placeholder</div>
              <DatePicker placeholder="YYYY.MM.DD" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">default value</div>
              <DatePicker defaultValue={new Date(2026, 2, 7)} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">disabled</div>
              <DatePicker disabled defaultValue={new Date(2026, 2, 15)} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">error</div>
              <DatePicker
                defaultValue={new Date(2026, 2, 15)}
                aria-invalid="true"
              />
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Basic date picker (btnType)"
          description="btnType"
          code={`
  <DatePicker variant="btnType" placeholder="YYYY.MM.DD" />
  <DatePicker variant="btnType" defaultValue={new Date(2026, 2, 7)} />
  <DatePicker variant="btnType" disabled defaultValue={new Date(2026, 2, 15)} />
  <DatePicker variant="btnType" defaultValue={new Date(2026, 2, 15)} aria-invalid="true" />`}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">placeholder</div>
              <DatePicker variant="btnType" placeholder="YYYY.MM.DD" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">default value</div>
              <DatePicker
                variant="btnType"
                defaultValue={new Date(2026, 2, 7)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">disabled</div>
              <DatePicker
                variant="btnType"
                disabled
                defaultValue={new Date(2026, 2, 15)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">error</div>
              <DatePicker
                variant="btnType"
                defaultValue={new Date(2026, 2, 15)}
                aria-invalid="true"
              />
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="resetEnabled"
          description="선택된 날짜가 있을 때만 트리거 우측에 리셋 버튼이 표시됩니다."
          code={`
<div className="grid max-w-3xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">default (value exists)</div>
    <DatePicker resetEnabled defaultValue={new Date(2026, 2, 7)} />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">default (empty)</div>
    <DatePicker resetEnabled placeholder="YYYY.MM.DD" />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">btnType (value exists)</div>
    <DatePicker variant="btnType" resetEnabled defaultValue={new Date(2026, 2, 15)} />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">btnType (empty)</div>
    <DatePicker variant="btnType" resetEnabled placeholder="YYYY.MM.DD" />
  </div>
</div>
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">default (value exists)</div>
              <DatePicker resetEnabled defaultValue={new Date(2026, 2, 7)} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">default (empty)</div>
              <DatePicker resetEnabled placeholder="YYYY.MM.DD" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">btnType (value exists)</div>
              <DatePicker
                variant="btnType"
                resetEnabled
                defaultValue={new Date(2026, 2, 15)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">btnType (empty)</div>
              <DatePicker
                variant="btnType"
                resetEnabled
                placeholder="YYYY.MM.DD"
              />
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Controlled value"
          description="외부 state와 연결해서 선택값을 제어하는 형태입니다."
          code={`
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  
  <DatePicker value={selectedDate} onValueChange={setSelectedDate} />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">controlled</div>
              <DatePicker
                value={selectedDate}
                onValueChange={setSelectedDate}
                placeholder="결재일을 선택하세요"
              />
            </div>

            <div className="rounded-xl border  bg-box p-4">
              <div className="text-sm font-medium text-slate-700">
                selected value
              </div>
              <div className="mt-2 text-sm text-font-g">
                {selectedDate
                  ? selectedDate.toLocaleDateString("ko-KR")
                  : "선택된 날짜가 없습니다."}
              </div>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Calendar options"
          description="특정 기간만 선택 가능하도록 `calendarProps`를 넘기는 예시입니다."
          code={`
  <DatePicker
    defaultValue={new Date(2026, 2, 10)}
    calendarProps={{
      fromDate: new Date(2026, 2, 1),
      toDate: new Date(2026, 2, 31),
    }}
  />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">range limited</div>
              <DatePicker
                defaultValue={new Date(2026, 2, 10)}
                placeholder="3월 내 날짜만 선택"
                calendarProps={{
                  fromDate: new Date(2026, 2, 1),
                  toDate: new Date(2026, 2, 31),
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">custom format</div>
              <DatePicker
                defaultValue={new Date(2026, 2, 21)}
                formatString="yyyy년 MM월 dd일"
              />
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Disabled dates — DatePicker"
          description={`calendarProps.disabled 에 Matcher를 전달해 특정 날짜를 비활성화합니다.
  • { before: date } — 해당 날짜 이전 전체 비활성화
  • { after: date } — 해당 날짜 이후 전체 비활성화
  • 배열로 조합하면 특정 구간만 활성화
  • 함수로 요일·날짜 조건 지정 가능`}
          code={`
  const today = new Date();
  const rangeStart = new Date(2026, 2, 10);
  const rangeEnd   = new Date(2026, 2, 20);
  
  // 오늘 이전 날짜 비활성화 (오늘 포함 이후만 선택 가능)
  <DatePicker calendarProps={{ disabled: { before: today } }} />
  
  // 특정 구간만 선택 가능 (3/10 ~ 3/20)
  <DatePicker
    calendarProps={{ disabled: [{ before: rangeStart }, { after: rangeEnd }] }}
  />
  
  // 주말(토·일) 비활성화
  <DatePicker
    calendarProps={{
      disabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    }}
  />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">오늘 이전 비활성화</div>
              <DatePicker
                placeholder="오늘 이후만 선택"
                calendarProps={{ disabled: { before: new Date() } }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">3/10 ~ 3/20 구간만 선택</div>
              <DatePicker
                placeholder="3/10 ~ 3/20만 선택"
                calendarProps={{
                  disabled: [
                    { before: new Date(2026, 2, 10) },
                    { after: new Date(2026, 2, 20) },
                  ],
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">주말(토·일) 비활성화</div>
              <DatePicker
                placeholder="평일만 선택"
                calendarProps={{
                  disabled: (date: Date) =>
                    date.getDay() === 0 || date.getDay() === 6,
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">특정 날짜들 비활성화</div>
              <DatePicker
                placeholder="3/5·3/15·3/25 불가"
                calendarProps={{
                  disabled: [
                    new Date(2026, 2, 5),
                    new Date(2026, 2, 15),
                    new Date(2026, 2, 25),
                  ],
                }}
              />
            </div>
          </div>
        </GuideBox>

        {/* ── DateRangePicker ────────────────────────────────────────────── */}

        <div className="border-t  pt-2">
          <h2 className="text-lg font-semibold text-slate-800">
            DateRangePicker Samples
          </h2>
        </div>

        <GuideBox
          title="Basic range picker"
          description="기간 선택 피커의 기본 상태입니다. 시작일을 먼저 클릭한 뒤 종료일을 클릭하면 범위가 완성됩니다."
          code={`
  <DateRangePicker placeholder="기간을 선택하세요" />
  <DateRangePicker
    defaultValue={{ from: new Date(2026, 2, 5), to: new Date(2026, 2, 20) }}
  />
  <DateRangePicker disabled defaultValue={{ from: new Date(2026, 2, 1), to: new Date(2026, 2, 31) }} />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">placeholder</div>
              <DateRangePicker placeholder="기간을 선택하세요" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">default value</div>
              <DateRangePicker
                defaultValue={{
                  from: new Date(2026, 2, 5),
                  to: new Date(2026, 2, 20),
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">disabled</div>
              <DateRangePicker
                disabled
                defaultValue={{
                  from: new Date(2026, 2, 1),
                  to: new Date(2026, 2, 31),
                }}
              />
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Controlled range"
          description="외부 state와 연결해서 선택된 기간을 제어하는 형태입니다."
          code={`
  const [selectedRange, setSelectedRange] = React.useState<DateRange>();
  
  <DateRangePicker value={selectedRange} onValueChange={setSelectedRange} />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">controlled</div>
              <DateRangePicker
                value={selectedRange}
                onValueChange={setSelectedRange}
                placeholder="조회 기간을 선택하세요"
              />
            </div>

            <div className="rounded-xl border  bg-box p-4">
              <div className="text-sm font-medium text-slate-700">
                selected range
              </div>
              <div className="mt-2 space-y-1 text-sm text-font-g">
                <div>
                  <span className="font-medium">from: </span>
                  {selectedRange?.from
                    ? selectedRange.from.toLocaleDateString("ko-KR")
                    : "—"}
                </div>
                <div>
                  <span className="font-medium">to: </span>
                  {selectedRange?.to
                    ? selectedRange.to.toLocaleDateString("ko-KR")
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Range by 2 DatePickers"
          description="시작일/종료일을 DatePicker 2개로 구성해 선택합니다."
          code={`
  <DateRangePickerTwoPickers
    defaultValue={{ from: new Date(2026, 2, 5), to: new Date(2026, 2, 20) }}
  />
  <DateRangePickerTwoPickers startPlaceholder="시작일" endPlaceholder="종료일" />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">start/end (default)</div>
              <DateRangePickerTwoPickers
                defaultValue={{
                  from: new Date(2026, 2, 5),
                  to: new Date(2026, 2, 20),
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">start/end (empty)</div>
              <DateRangePickerTwoPickers
                startPlaceholder="시작일"
                endPlaceholder="종료일"
              />
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Range with calendar options"
          description="선택 가능한 날짜 범위를 제한하거나 커스텀 포맷을 적용합니다."
          code={`
  // 선택 가능 기간 제한
  <DateRangePicker
    placeholder="이번달만 선택 가능"
    calendarProps={{
      disabled: [{ before: new Date(2026, 2, 1) }, { after: new Date(2026, 2, 31) }],
    }}
  />
  
  // 커스텀 날짜 포맷
  <DateRangePicker
    defaultValue={{ from: new Date(2026, 2, 1), to: new Date(2026, 2, 15) }}
    formatString="MM/dd"
  />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">range limited (3월만)</div>
              <DateRangePicker
                placeholder="3월 내 기간만 선택"
                calendarProps={{
                  disabled: [
                    { before: new Date(2026, 2, 1) },
                    { after: new Date(2026, 2, 31) },
                  ],
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">custom format (MM/dd)</div>
              <DateRangePicker
                defaultValue={{
                  from: new Date(2026, 2, 1),
                  to: new Date(2026, 2, 15),
                }}
                formatString="MM/dd"
              />
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Disabled dates — DateRangePicker"
          description={`DateRangePicker에서도 동일한 disabled Matcher를 사용해 선택 불가 날짜를 지정합니다.
  비활성화된 날짜는 범위 선택 시작·끝으로 지정할 수 없습니다.`}
          code={`
  const today = new Date();
  
  // 오늘 이전 비활성화
  <DateRangePicker calendarProps={{ disabled: { before: today } }} />
  
  // 특정 구간만 선택 가능 (3/10 ~ 3/20)
  <DateRangePicker
    calendarProps={{
      disabled: [{ before: new Date(2026, 2, 10) }, { after: new Date(2026, 2, 20) }],
    }}
  />
  
  // 주말 비활성화
  <DateRangePicker
    calendarProps={{
      disabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    }}
  />
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">오늘 이전 비활성화</div>
              <DateRangePicker
                placeholder="오늘 이후 기간만 선택"
                calendarProps={{ disabled: { before: new Date() } }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">3/10 ~ 3/20 구간만 선택</div>
              <DateRangePicker
                placeholder="3/10 ~ 3/20 사이만"
                calendarProps={{
                  disabled: [
                    { before: new Date(2026, 2, 10) },
                    { after: new Date(2026, 2, 20) },
                  ],
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">주말(토·일) 비활성화</div>
              <DateRangePicker
                placeholder="평일 기간만 선택"
                calendarProps={{
                  disabled: (date: Date) =>
                    date.getDay() === 0 || date.getDay() === 6,
                }}
              />
            </div>
          </div>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleDatePickerPage };
export default SampleDatePickerPage;
