import { Radio, RadioGroup } from "@/components/ui";
import { useState } from "react";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundCheckboxControl,
  PlaygroundRadioControl,
  PlaygroundSwitchControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";

const PLAYGROUND_OPTIONS = [
  { value: "pending", label: "대기" },
  { value: "reviewing", label: "심사중" },
  { value: "approved", label: "승인" },
];

const OPTION_VALUES = PLAYGROUND_OPTIONS.map((option) => option.value);
const NONE_VALUE = "__none__";
const DEFAULT_VALUE = "reviewing";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  selectedValue: string,
  isGroupDisabled: boolean,
  disabledValues: string[],
  invalidValues: string[],
) {
  const disabledProp = isGroupDisabled ? "\n  disabled" : "";

  const items = PLAYGROUND_OPTIONS.map((option) => {
    const itemDisabledProp = disabledValues.includes(option.value)
      ? " disabled"
      : "";
    const invalidProp = invalidValues.includes(option.value)
      ? ' aria-invalid="true"'
      : "";
    return `  <Radio value="${option.value}" label="${option.label}"${itemDisabledProp}${invalidProp} />`;
  }).join("\n");

  return `const [value, setValue] = useState("${selectedValue}");

<RadioGroup
  value={value}
  onValueChange={setValue}${disabledProp}
  className="flex flex-col gap-2"
>
${items}
</RadioGroup>`;
}

/** Radio Playground (이 페이지에서만 사용) */
function RadioPlayground() {
  const [selectedValue, setSelectedValue] = useState(DEFAULT_VALUE);
  const [isGroupDisabled, setIsGroupDisabled] = useState(false);
  const [disabledValues, setDisabledValues] = useState<string[]>([]);
  const [invalidValues, setInvalidValues] = useState<string[]>([]);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const handleChangeRadioValue = (nextValue: string) => {
    setSelectedValue(nextValue);
    addEventLog("onValueChange", nextValue);
  };

  const handleChangeSelectedValue = (nextValue: string) => {
    setSelectedValue(nextValue === NONE_VALUE ? "" : nextValue);
  };

  const handleClickReset = () => {
    setSelectedValue(DEFAULT_VALUE);
    setIsGroupDisabled(false);
    setDisabledValues([]);
    setInvalidValues([]);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "value",
      type: "string",
      description: "선택된 항목 (onValueChange와 함께 제어형)",
      control: (
        <PlaygroundRadioControl
          label="value"
          value={selectedValue || NONE_VALUE}
          options={[{ value: NONE_VALUE, label: "없음" }, ...OPTION_VALUES]}
          onValueChange={handleChangeSelectedValue}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "RadioGroup 전체 비활성화",
      control: (
        <PlaygroundSwitchControl
          label="disabled"
          checked={isGroupDisabled}
          onCheckedChange={setIsGroupDisabled}
        />
      ),
    },
    {
      name: "Radio disabled",
      type: "boolean",
      description: "선택할 수 없는 항목",
      control: (
        <PlaygroundCheckboxControl
          label="Radio disabled"
          value={disabledValues}
          options={OPTION_VALUES}
          onValueChange={setDisabledValues}
        />
      ),
    },
    {
      name: 'Radio aria-invalid="true"',
      type: "boolean",
      description: "오류 상태 표시",
      control: (
        <PlaygroundCheckboxControl
          label="Radio aria-invalid"
          value={invalidValues}
          options={OPTION_VALUES}
          onValueChange={setInvalidValues}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 항목을 눌러도 Controls의 value가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode(
        selectedValue,
        isGroupDisabled,
        disabledValues,
        invalidValues,
      )}
      controls={controls}
      controlsNote="orientation은 키보드 화살표 방향만 바꾸고 배치 스타일은 연결되어 있지 않아(배치는 className으로 지정) Controls에 넣지 않았습니다. variant·size Props는 없습니다."
      state={{
        value: selectedValue,
        disabled: isGroupDisabled,
        disabledItems: disabledValues,
        invalidItems: invalidValues,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <RadioGroup
        value={selectedValue}
        onValueChange={handleChangeRadioValue}
        disabled={isGroupDisabled}
        className="flex flex-col gap-2"
      >
        {PLAYGROUND_OPTIONS.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            label={option.label}
            disabled={disabledValues.includes(option.value)}
            aria-invalid={invalidValues.includes(option.value) || undefined}
          />
        ))}
      </RadioGroup>
    </GuidePlayground>
  );
}

function SampleRadioPage() {
  const [value, setValue] = useState("reviewing");

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Radio Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<RadioPlayground />}>
        <GuideBox
          title="Basic radio"
          description="기본 선택, 비활성화, 커스텀 라벨 구조를 한 번에 비교합니다."
          code={`
<RadioGroup
  defaultValue="checked"
  className="grid max-w-3xl gap-4 md:grid-cols-2"
>
  <Radio value="default" label="default" />
  <Radio value="checked" label="checked" />
  <Radio value="disabled" disabled label="disabled" />
  <Radio value="checked-disabled" disabled label="checked disabled" />
  <Radio value="custom">
    <Radio.item />
    <Radio.label>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-font-b">custom label</span>
        <span className="text-xs text-font-gray">
          children으로 라벨과 설명을 함께 렌더링
        </span>
      </div>
    </Radio.label>
  </Radio>
</RadioGroup>
          `}
        >
          <RadioGroup
            defaultValue="checked"
            className="grid max-w-3xl gap-4 md:grid-cols-2"
          >
            <Radio value="default" label="default" />

            <Radio value="checked" label="checked" />

            <Radio value="disabled" disabled label="disabled" />

            <Radio value="checked-disabled" disabled label="checked disabled" />

            <Radio value="custom">
              <Radio.item />
              <Radio.label>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-font-b">
                    custom label
                  </span>
                  <span className="text-xs text-font-gray">
                    children으로 라벨과 설명을 함께 렌더링
                  </span>
                </div>
              </Radio.label>
            </Radio>
          </RadioGroup>
        </GuideBox>

        <GuideBox
          title="State"
          description="제어 컴포넌트와 invalid 표시처럼 실제 폼에서 자주 쓰는 상태 예시입니다."
          code={`
const [value, setValue] = useState("reviewing");

<RadioGroup
  value={value}
  onValueChange={setValue}
  className="grid max-w-3xl gap-4 md:grid-cols-2"
>
  <Radio value="pending" label="pending" />
  <Radio
    value="reviewing"
    label={value === "reviewing" ? "selected" : "reviewing"}
  />
  <Radio value="approved" label="approved" />
  <Radio value="invalid" aria-invalid="true" label="invalid" />
</RadioGroup>
          `}
        >
          <RadioGroup
            value={value}
            onValueChange={setValue}
            className="grid max-w-3xl gap-4 md:grid-cols-2"
          >
            <Radio value="pending" label="pending" />

            <Radio
              value="reviewing"
              label={value === "reviewing" ? "selected" : "reviewing"}
            />

            <Radio value="approved" label="approved" />

            <Radio value="invalid" aria-invalid="true" label="invalid" />
          </RadioGroup>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleRadioPage };
export default SampleRadioPage;
