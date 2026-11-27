import { useId, useState } from "react";

import {
  InputStepper,
  type InputStepperControlVariant,
  type InputStepperMode,
} from "@/components/ui";
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

/** mode별 처음 값 (mode를 바꾸면 value·min·max를 이 값으로 되돌립니다) */
const MODE_DEFAULTS: Record<
  InputStepperMode,
  { value: string; min: string; max: string; label: string }
> = {
  number: { value: "0", min: "0", max: "10", label: "수량" },
  date: {
    value: "2025-06-15",
    min: "2025-01-01",
    max: "2025-12-31",
    label: "날짜",
  },
};

const DEFAULT_STEP = 1;

type InputStepperPlaygroundValues = {
  mode: InputStepperMode;
  stepperVariant: InputStepperControlVariant;
  step: number;
  minText: string;
  maxText: string;
  value: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
};

/** step 입력값을 숫자로 바꿉니다. 0 이하·숫자가 아니면 기본값 1을 씁니다. */
function parseStep(stepText: string) {
  const stepNumber = Number(stepText);
  return Number.isFinite(stepNumber) && stepNumber > 0
    ? stepNumber
    : DEFAULT_STEP;
}

/** min·max 값을 코드 표기로 바꿉니다. 숫자 모드는 {0}, 날짜 모드는 "2025-01-01" */
function formatBoundProp(name: string, text: string, mode: InputStepperMode) {
  if (text === "") return "";
  const isNumberBound = mode === "number" && Number.isFinite(Number(text));
  return `\n    ${name}=${isNumberBound ? `{${text}}` : `"${text}"`}`;
}

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(values: InputStepperPlaygroundValues) {
  const { mode, stepperVariant, step, minText, maxText, value } = values;
  const modeProp = mode === "number" ? "" : `\n    mode="${mode}"`;
  const variantProp =
    stepperVariant === "plusMinus"
      ? ""
      : `\n    stepperVariant="${stepperVariant}"`;
  const stepProp = step === DEFAULT_STEP ? "" : `\n    step={${step}}`;
  const disabledProp = values.isDisabled ? "\n    disabled" : "";
  const readOnlyProp = values.isReadOnly ? "\n    readOnly" : "";
  const invalidProp = values.isInvalid ? "\n    aria-invalid" : "";

  return `const inputId = useId();
const [value, setValue] = useState("${value}");

<div className="flex w-full max-w-xs flex-col gap-2">
  <label htmlFor={inputId} className="text-sm text-font-b">
    ${MODE_DEFAULTS[mode].label}
  </label>
  <InputStepper
    id={inputId}${modeProp}${variantProp}
    value={value}
    onValueChange={setValue}${formatBoundProp("min", minText, mode)}${formatBoundProp("max", maxText, mode)}${stepProp}${disabledProp}${readOnlyProp}${invalidProp}
  />
</div>`;
}

/** InputStepper Playground (이 페이지에서만 사용) */
function InputStepperPlayground() {
  const inputId = useId();
  const [mode, setMode] = useState<InputStepperMode>("number");
  const [stepperVariant, setStepperVariant] =
    useState<InputStepperControlVariant>("plusMinus");
  const [stepText, setStepText] = useState(String(DEFAULT_STEP));
  const [minText, setMinText] = useState(MODE_DEFAULTS.number.min);
  const [maxText, setMaxText] = useState(MODE_DEFAULTS.number.max);
  const [value, setValue] = useState(MODE_DEFAULTS.number.value);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const step = parseStep(stepText);
  const isNumberMode = mode === "number";

  const handleChangeStepperValue = (nextValue: string) => {
    setValue(nextValue);
    addEventLog("onValueChange", nextValue);
  };

  const handleChangeMode = (nextMode: string) => {
    const typedMode = nextMode as InputStepperMode;
    const defaults = MODE_DEFAULTS[typedMode];
    setMode(typedMode);
    // 숫자·날짜는 값 형식이 달라 value·min·max를 해당 모드의 처음 값으로 바꿉니다.
    setValue(defaults.value);
    setMinText(defaults.min);
    setMaxText(defaults.max);
  };

  const handleClickReset = () => {
    setMode("number");
    setStepperVariant("plusMinus");
    setStepText(String(DEFAULT_STEP));
    setMinText(MODE_DEFAULTS.number.min);
    setMaxText(MODE_DEFAULTS.number.max);
    setValue(MODE_DEFAULTS.number.value);
    setIsDisabled(false);
    setIsReadOnly(false);
    setIsInvalid(false);
    clearEventLogs();
  };

  const boundPlaceholder = isNumberMode ? "예: 0" : "yyyy-MM-dd";

  const controls: GuidePlaygroundControl[] = [
    {
      name: "mode",
      type: '"number" | "date"',
      description: "숫자 입력 / 날짜 입력 (바꾸면 value·min·max가 해당 모드의 처음 값으로 바뀝니다)",
      control: (
        <PlaygroundRadioControl
          label="mode"
          value={mode}
          options={["number", "date"]}
          onValueChange={handleChangeMode}
        />
      ),
    },
    {
      name: "stepperVariant",
      type: '"plusMinus" | "chevron"',
      description: "버튼 모양 (−/+ 또는 ‹/›)",
      control: (
        <PlaygroundRadioControl
          label="stepperVariant"
          value={stepperVariant}
          options={["plusMinus", "chevron"]}
          onValueChange={(next) =>
            setStepperVariant(next as InputStepperControlVariant)
          }
        />
      ),
    },
    {
      name: "value",
      type: "string",
      description: "현재 값 (onValueChange와 함께 제어형). 날짜는 yyyy-MM-dd",
      control: (
        <PlaygroundTextControl
          label="value"
          type={isNumberMode ? "number" : "text"}
          value={value}
          onValueChange={setValue}
          placeholder={boundPlaceholder}
        />
      ),
    },
    {
      name: "step",
      type: "number",
      description: "한 번에 바뀌는 양 (date에서는 일 단위). 0 이하는 1로 처리",
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
      name: "min",
      type: "string | number",
      description: "최솟값. 끝에 닿으면 − 버튼이 비활성 (비우면 범위 없음)",
      control: (
        <PlaygroundTextControl
          label="min"
          type={isNumberMode ? "number" : "text"}
          value={minText}
          onValueChange={setMinText}
          placeholder={boundPlaceholder}
        />
      ),
    },
    {
      name: "max",
      type: "string | number",
      description: "최댓값. 끝에 닿으면 + 버튼이 비활성 (비우면 범위 없음)",
      control: (
        <PlaygroundTextControl
          label="max"
          type={isNumberMode ? "number" : "text"}
          value={maxText}
          onValueChange={setMaxText}
          placeholder={boundPlaceholder}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "입력창과 버튼 전체 비활성",
      control: (
        <PlaygroundSwitchControl
          label="disabled"
          checked={isDisabled}
          onCheckedChange={setIsDisabled}
        />
      ),
    },
    {
      name: "readOnly",
      type: "boolean",
      description: "직접 입력과 −/+ 버튼을 모두 막음",
      control: (
        <PlaygroundSwitchControl
          label="readOnly"
          checked={isReadOnly}
          onCheckedChange={setIsReadOnly}
        />
      ),
    },
    {
      name: "aria-invalid",
      type: "boolean",
      description: "오류 테두리 (오류 문구는 aria-describedby로 연결)",
      control: (
        <PlaygroundSwitchControl
          label="aria-invalid"
          checked={isInvalid}
          onCheckedChange={setIsInvalid}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 −/+ 버튼을 누르거나 값을 입력해도 Controls의 value가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode({
        mode,
        stepperVariant,
        step,
        minText,
        maxText,
        value,
        isDisabled,
        isReadOnly,
        isInvalid,
      })}
      controls={controls}
      controlsNote="inputGroupType(btnType)은 테두리 없는 버튼형 묶음용이라 docs/components/InputStepper.md의 '쓸 수 있는 형태'에 없어 넣지 않았습니다. className·inputGroupClassName은 배치용이라 Controls에 넣지 않았습니다."
      state={{
        mode,
        stepperVariant,
        value,
        step,
        min: minText,
        max: maxText,
        disabled: isDisabled,
        readOnly: isReadOnly,
        "aria-invalid": isInvalid,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="flex w-full max-w-xs flex-col gap-2">
        <label htmlFor={inputId} className="text-sm text-font-b">
          {MODE_DEFAULTS[mode].label}
        </label>
        <InputStepper
          id={inputId}
          mode={mode}
          stepperVariant={stepperVariant}
          value={value}
          onValueChange={handleChangeStepperValue}
          min={minText || undefined}
          max={maxText || undefined}
          step={step}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={isInvalid || undefined}
        />
      </div>
    </GuidePlayground>
  );
}

function SampleInputStepperPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">InputStepper Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<InputStepperPlayground />}>
          <GuideBox
            title="숫자 · + / −"
            description="InputGroup과 동일한 테두리·포커스 스타일로 좌우 버튼으로 숫자를 증감합니다."
            code={`
<div className="grid max-w-3xl gap-6 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">기본 (step 1)</div>
    <InputStepper defaultValue="0" min={0} max={10} />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">step 0.5, min/max</div>
    <InputStepper defaultValue="1" step={0.5} min={0} max={5} />
  </div>
</div>
          `}
          >
            <div className="grid max-w-3xl gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-font-g">기본 (step 1)</div>
                <InputStepper defaultValue="0" min={0} max={10} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-font-g">step 0.5, min/max</div>
                <InputStepper defaultValue="1" step={0.5} min={0} max={5} />
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="숫자 · &lt; &gt; (chevron)"
            description='stepperVariant="chevron"일 때 날짜 피커와 같은 좌우 화살표 아이콘을 씁니다.'
            code={`
<div className="grid max-w-3xl gap-6 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">chevron</div>
    <InputStepper
      stepperVariant="chevron"
      defaultValue="5"
      min={1}
      max={99}
    />
  </div>
</div>
          `}
          >
            <div className="grid max-w-3xl gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-font-g">chevron</div>
                <InputStepper
                  stepperVariant="chevron"
                  defaultValue="5"
                  min={1}
                  max={99}
                />
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="날짜 · + / − 및 chevron"
            description='mode="date"는 type=date 입력과 동일하며, step은 일(day) 단위입니다.'
            code={`
<div className="grid max-w-3xl gap-6 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">date · plusMinus</div>
    <InputStepper
      mode="date"
      defaultValue="2025-06-15"
      min="2025-01-01"
      max="2025-12-31"
      step={1}
    />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">date · 7일 단위</div>
    <InputStepper
      mode="date"
      stepperVariant="chevron"
      defaultValue="2025-06-01"
      min="2025-01-01"
      max="2025-12-31"
      step={7}
    />
  </div>
</div>
          `}
          >
            <div className="grid max-w-3xl gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-font-g">date · plusMinus</div>
                <InputStepper
                  mode="date"
                  defaultValue="2025-06-15"
                  min="2025-01-01"
                  max="2025-12-31"
                  step={1}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-font-g">date · 7일 단위</div>
                <InputStepper
                  mode="date"
                  stepperVariant="chevron"
                  defaultValue="2025-06-01"
                  min="2025-01-01"
                  max="2025-12-31"
                  step={7}
                />
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="상태: disabled · readOnly · error"
            description="disabled는 전체 비활성, readOnly는 직접 입력만 막고 스테퍼 버튼도 비활성화됩니다. error는 aria-invalid로 테두리 강조(Input과 동일)입니다."
            code={`
<section className="flex max-w-5xl flex-col gap-8">
  <div>
    <div className="mb-3 text-sm font-medium text-font-b">숫자</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-font-g">기본</div>
        <InputStepper defaultValue="4" min={0} max={10} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-font-g">disabled</div>
        <InputStepper defaultValue="3" min={0} max={10} disabled />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-font-g">readOnly</div>
        <InputStepper defaultValue="7" min={0} max={10} readOnly />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-font-g">error (aria-invalid)</div>
        <InputStepper defaultValue="-1" min={0} max={10} aria-invalid />
      </div>
    </div>
  </div>
  <div>
    <div className="mb-3 text-sm font-medium text-font-b">날짜</div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-font-g">기본</div>
        <InputStepper
          mode="date"
          defaultValue="2025-06-15"
          min="2025-01-01"
          max="2025-12-31"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-font-g">disabled</div>
        <InputStepper
          mode="date"
          defaultValue="2025-03-01"
          min="2025-01-01"
          max="2025-12-31"
          disabled
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-font-g">readOnly</div>
        <InputStepper
          mode="date"
          defaultValue="2025-08-20"
          min="2025-01-01"
          max="2025-12-31"
          readOnly
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-font-g">error (aria-invalid)</div>
        <InputStepper
          mode="date"
          defaultValue="2024-06-01"
          min="2025-01-01"
          max="2025-12-31"
          aria-invalid
        />
      </div>
    </div>
  </div>
</section>
          `}
          >
            <section className="flex max-w-5xl flex-col gap-8">
              <div>
                <div className="mb-3 text-sm font-medium text-font-b">숫자</div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-font-g">기본</div>
                    <InputStepper defaultValue="4" min={0} max={10} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-font-g">disabled</div>
                    <InputStepper defaultValue="3" min={0} max={10} disabled />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-font-g">readOnly</div>
                    <InputStepper defaultValue="7" min={0} max={10} readOnly />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-font-g">
                      error (aria-invalid)
                    </div>
                    <InputStepper
                      defaultValue="-1"
                      min={0}
                      max={10}
                      aria-invalid
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-3 text-sm font-medium text-font-b">날짜</div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-font-g">기본</div>
                    <InputStepper
                      mode="date"
                      defaultValue="2025-06-15"
                      min="2025-01-01"
                      max="2025-12-31"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-font-g">disabled</div>
                    <InputStepper
                      mode="date"
                      defaultValue="2025-03-01"
                      min="2025-01-01"
                      max="2025-12-31"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-font-g">readOnly</div>
                    <InputStepper
                      mode="date"
                      defaultValue="2025-08-20"
                      min="2025-01-01"
                      max="2025-12-31"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-font-g">
                      error (aria-invalid)
                    </div>
                    <InputStepper
                      mode="date"
                      defaultValue="2024-06-01"
                      min="2025-01-01"
                      max="2025-12-31"
                      aria-invalid
                    />
                  </div>
                </div>
              </div>
            </section>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleInputStepperPage };
export default SampleInputStepperPage;
