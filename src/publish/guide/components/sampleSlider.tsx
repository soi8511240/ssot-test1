import * as React from "react";
import { Slider } from "@/components/ui";
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

type SliderSize = "sm" | "md" | "lg";
type SliderOrientation = "horizontal" | "vertical";
type SliderThumbCount = "1" | "2";

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;
const SINGLE_VALUE = [50];
const RANGE_VALUE = [25, 75];

/** 숫자로 바꿀 수 없으면 기본값을 씁니다. */
function toNumber(text: string, fallback: number) {
  const parsed = Number(text);
  return text.trim() !== "" && Number.isFinite(parsed) ? parsed : fallback;
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  values: number[],
  min: number,
  max: number,
  step: number,
  size: SliderSize,
  orientation: SliderOrientation,
  isDisabled: boolean,
  isInverted: boolean,
) {
  const isVertical = orientation === "vertical";
  const props = [
    "value={value}",
    "onValueChange={setValue}",
    min !== DEFAULT_MIN ? `min={${min}}` : "",
    max !== DEFAULT_MAX ? `max={${max}}` : "",
    step !== DEFAULT_STEP ? `step={${step}}` : "",
    size !== "md" ? `size="${size}"` : "",
    isVertical ? 'orientation="vertical"' : "",
    isDisabled ? "disabled" : "",
    isInverted ? "inverted" : "",
    'aria-label="가격 범위"',
  ]
    .filter(Boolean)
    .map((prop) => `    ${prop}`)
    .join("\n");
  const wrapClassName = isVertical
    ? "flex h-48 items-center justify-center"
    : "w-full max-w-md px-2";

  return `const [value, setValue] = useState(${JSON.stringify(values)});

<div className="${wrapClassName}">
  <Slider
${props}
  />
</div>`;
}

/** Slider Playground (이 페이지에서만 사용) */
function SliderPlayground() {
  const [values, setValues] = React.useState<number[]>(SINGLE_VALUE);
  const [minText, setMinText] = React.useState(String(DEFAULT_MIN));
  const [maxText, setMaxText] = React.useState(String(DEFAULT_MAX));
  const [stepText, setStepText] = React.useState(String(DEFAULT_STEP));
  const [size, setSize] = React.useState<SliderSize>("md");
  const [orientation, setOrientation] =
    React.useState<SliderOrientation>("horizontal");
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isInverted, setIsInverted] = React.useState(false);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  // 입력값이 잘못되면(숫자 아님, max <= min, step <= 0) 기본값으로 적용합니다.
  const min = toNumber(minText, DEFAULT_MIN);
  const parsedMax = toNumber(maxText, DEFAULT_MAX);
  const max = parsedMax > min ? parsedMax : min + DEFAULT_MAX;
  const parsedStep = toNumber(stepText, DEFAULT_STEP);
  const step = parsedStep > 0 ? parsedStep : DEFAULT_STEP;
  const appliedValues = values.map((value) => clampValue(value, min, max));
  const thumbCount: SliderThumbCount = values.length > 1 ? "2" : "1";

  const handleChangeSliderValue = (nextValues: number[]) => {
    setValues(nextValues);
    addEventLog("onValueChange", nextValues);
  };

  const handleCommitSliderValue = (nextValues: number[]) => {
    addEventLog("onValueCommit", nextValues);
  };

  const handleChangeThumbCount = (nextCount: string) => {
    const baseValues = nextCount === "2" ? RANGE_VALUE : SINGLE_VALUE;
    // 현재 min~max 범위 안의 같은 비율 위치로 맞춥니다.
    setValues(
      baseValues.map((value) =>
        Math.round(min + ((max - min) * value) / DEFAULT_MAX),
      ),
    );
  };

  const handleClickReset = () => {
    setValues(SINGLE_VALUE);
    setMinText(String(DEFAULT_MIN));
    setMaxText(String(DEFAULT_MAX));
    setStepText(String(DEFAULT_STEP));
    setSize("md");
    setOrientation("horizontal");
    setIsDisabled(false);
    setIsInverted(false);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "value",
      type: "number[]",
      description:
        "현재 값 배열. 배열 길이만큼 thumb가 생깁니다(1개: 단일, 2개: 범위). 미리보기를 드래그하면 값이 바뀝니다(제어형).",
      control: (
        <PlaygroundRadioControl
          label="value"
          value={thumbCount}
          options={[
            { value: "1", label: "단일 (thumb 1개)" },
            { value: "2", label: "범위 (thumb 2개)" },
          ]}
          onValueChange={handleChangeThumbCount}
        />
      ),
    },
    {
      name: "min",
      type: "number",
      description: "최솟값 (기본 0)",
      control: (
        <PlaygroundTextControl
          label="min"
          type="number"
          value={minText}
          onValueChange={setMinText}
        />
      ),
    },
    {
      name: "max",
      type: "number",
      description: "최댓값 (기본 100, min보다 커야 함)",
      control: (
        <PlaygroundTextControl
          label="max"
          type="number"
          value={maxText}
          onValueChange={setMaxText}
        />
      ),
    },
    {
      name: "step",
      type: "number",
      description: "이동 단위 (기본 1, 0보다 커야 함)",
      control: (
        <PlaygroundTextControl
          label="step"
          type="number"
          value={stepText}
          onValueChange={setStepText}
        />
      ),
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      description: "트랙·thumb 크기",
      control: (
        <PlaygroundRadioControl
          label="size"
          value={size}
          options={["sm", "md", "lg"]}
          onValueChange={(next) => setSize(next as SliderSize)}
        />
      ),
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      description: "방향 (vertical은 높이가 있는 부모가 필요)",
      control: (
        <PlaygroundRadioControl
          label="orientation"
          value={orientation}
          options={["horizontal", "vertical"]}
          onValueChange={(next) => setOrientation(next as SliderOrientation)}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "비활성",
      control: (
        <PlaygroundSwitchControl
          label="disabled"
          checked={isDisabled}
          onCheckedChange={setIsDisabled}
        />
      ),
    },
    {
      name: "inverted",
      type: "boolean",
      description: "값 방향 반전 (가로: 오른쪽→왼쪽, 세로: 위→아래로 증가)",
      control: (
        <PlaygroundSwitchControl
          label="inverted"
          checked={isInverted}
          onCheckedChange={setIsInverted}
        />
      ),
    },
  ];

  const slider = (
    <Slider
      value={appliedValues}
      onValueChange={handleChangeSliderValue}
      onValueCommit={handleCommitSliderValue}
      min={min}
      max={max}
      step={step}
      size={size}
      orientation={orientation}
      disabled={isDisabled}
      inverted={isInverted}
      aria-label="가격 범위"
    />
  );

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기 thumb를 드래그하면 State의 value가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode(
        appliedValues,
        min,
        max,
        step,
        size,
        orientation,
        isDisabled,
        isInverted,
      )}
      controls={controls}
      controlsNote="min·max·step에 잘못된 값(숫자 아님, max ≤ min, step ≤ 0)을 넣으면 기본값으로 적용합니다. minStepsBetweenThumbs·dir·name 등 Radix Slider의 나머지 Props는 Samples 탭과 Radix 문서를 참고하세요."
      state={{
        value: appliedValues,
        min,
        max,
        step,
        size,
        orientation,
        disabled: isDisabled,
        inverted: isInverted,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      {orientation === "vertical" ? (
        <div className="flex h-48 items-center justify-center">{slider}</div>
      ) : (
        <div className="w-full max-w-md px-2">{slider}</div>
      )}
    </GuidePlayground>
  );
}

function SampleSliderPage() {
  const [controlled, setControlled] = React.useState([40]);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Slider Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<SliderPlayground />}>
          <GuideBox
            title="기본 Slider"
            description="단일 슬라이더 기본값과 min/max 범위입니다."
            code={`
<div className="w-full max-w-md px-2">
  <Slider defaultValue={[50]} max={100} step={1} aria-label="기본 슬라이더" />
</div>
            `}
          >
            <div className="w-full max-w-md px-2">
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                aria-label="기본 슬라이더"
              />
            </div>
          </GuideBox>

          <GuideBox
            title="크기 (size)"
            description="sm / md / lg 세 가지 트랙·썸 크기를 비교합니다."
            code={`
<div className="flex w-full max-w-md flex-col gap-8 px-2">
  <Slider size="sm" defaultValue={[30]} aria-label="small slider" />
  <Slider size="md" defaultValue={[50]} aria-label="medium slider" />
  <Slider size="lg" defaultValue={[70]} aria-label="large slider" />
</div>
            `}
          >
            <div className="flex w-full max-w-md flex-col gap-8 px-2">
              <Slider size="sm" defaultValue={[30]} aria-label="small slider" />
              <Slider size="md" defaultValue={[50]} aria-label="medium slider" />
              <Slider size="lg" defaultValue={[70]} aria-label="large slider" />
            </div>
          </GuideBox>

          <GuideBox
            title="범위 (Range)"
            description="두 개의 thumb로 구간을 조절합니다."
            code={`
<div className="w-full max-w-md px-2">
  <Slider
    defaultValue={[25, 75]}
    max={100}
    step={1}
    minStepsBetweenThumbs={1}
    aria-label="범위 슬라이더"
  />
</div>
            `}
          >
            <div className="w-full max-w-md px-2">
              <Slider
                defaultValue={[25, 75]}
                max={100}
                step={1}
                minStepsBetweenThumbs={1}
                aria-label="범위 슬라이더"
              />
            </div>
          </GuideBox>

          <GuideBox
            title="세로 방향 (orientation)"
            description='orientation="vertical" 과 고정 높이 컨테이너가 필요합니다.'
            code={`
<div className="flex h-48 items-center justify-center gap-8">
  <Slider
    orientation="vertical"
    defaultValue={[40]}
    max={100}
    className="min-h-44"
    aria-label="세로 슬라이더"
  />
</div>
            `}
          >
            <div className="flex h-48 items-center justify-center gap-8">
              <Slider
                orientation="vertical"
                defaultValue={[40]}
                max={100}
                className="min-h-44"
                aria-label="세로 슬라이더"
              />
            </div>
          </GuideBox>

          <GuideBox
            title="제어 상태 (controlled)"
            description="value와 onValueChange로 외부에서 값을 관리합니다."
            code={`
const [controlled, setControlled] = useState([40]);

<div className="flex w-full max-w-md flex-col gap-2 px-2">
  <Slider
    value={controlled}
    onValueChange={setControlled}
    max={100}
    step={1}
    aria-label="제어 슬라이더"
  />
  <span className="text-sm font-medium text-font-b">
    값: {controlled[0]}
  </span>
</div>
            `}
          >
            <div className="flex w-full max-w-md flex-col gap-2 px-2">
              <Slider
                value={controlled}
                onValueChange={setControlled}
                max={100}
                step={1}
                aria-label="제어 슬라이더"
              />
              <span className="text-sm font-medium text-font-b">
                값: {controlled[0]}
              </span>
            </div>
          </GuideBox>

          <GuideBox
            title="비활성 (disabled)"
            description="disabled 시 트랙·썸이 비활성 스타일로 표시됩니다."
            code={`
<div className="w-full max-w-md px-2">
  <Slider
    defaultValue={[60]}
    disabled
    aria-label="비활성 슬라이더"
  />
</div>
            `}
          >
            <div className="w-full max-w-md px-2">
              <Slider defaultValue={[60]} disabled aria-label="비활성 슬라이더" />
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export default SampleSliderPage;
