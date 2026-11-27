import { Checkbox, CheckboxGroup } from "@/components/ui";
import { useState } from "react";
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

type CheckboxVariant = "default" | "spec" | "btn";

const VARIANT_OPTIONS: CheckboxVariant[] = ["default", "spec", "btn"];
const DEFAULT_LABEL = "(필수) 보험 약관 동의";

type CheckboxPlaygroundValues = {
  variant: CheckboxVariant;
  isChecked: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  label: string;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  variant,
  isChecked,
  isDisabled,
  isInvalid,
  label,
}: CheckboxPlaygroundValues) {
  const props = [
    variant !== "default" ? `variant="${variant}"` : "",
    "checked={isChecked}",
    "onCheckedChange={(checked) => setIsChecked(checked === true)}",
    isDisabled ? "disabled" : "",
    isInvalid ? 'aria-invalid="true"' : "",
    // spec은 글자가 없어 aria-label로 이름을 붙입니다.
    variant === "spec" ? `aria-label="${label}"` : `label="${label}"`,
  ].filter(Boolean);

  return `const [isChecked, setIsChecked] = useState(${isChecked});

<Checkbox
  ${props.join("\n  ")}
/>`;
}

/** Checkbox Playground (이 페이지에서만 사용) */
function CheckboxPlayground() {
  const [variant, setVariant] = useState<CheckboxVariant>("default");
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const isSpec = variant === "spec";

  const handleChangeChecked = (nextChecked: boolean | "indeterminate") => {
    setIsChecked(nextChecked === true);
    addEventLog("onCheckedChange", nextChecked);
  };

  const handleClickReset = () => {
    setVariant("default");
    setIsChecked(false);
    setIsDisabled(false);
    setIsInvalid(false);
    setLabel(DEFAULT_LABEL);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "variant",
      type: '"default" | "spec" | "btn"',
      description: "기본 동그라미 체크 / 아이콘만 / 버튼 모양",
      control: (
        <PlaygroundRadioControl
          label="variant"
          value={variant}
          options={VARIANT_OPTIONS}
          onValueChange={(nextValue) => setVariant(nextValue as CheckboxVariant)}
        />
      ),
    },
    {
      name: "checked",
      type: "boolean",
      description: "체크 상태 (onCheckedChange와 함께 제어형)",
      control: (
        <PlaygroundSwitchControl
          label="checked"
          checked={isChecked}
          onCheckedChange={setIsChecked}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "선택 불가",
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
      type: "boolean",
      description: "오류 표시 (실제 화면에서는 오류 문구를 함께 보여 줍니다)",
      control: (
        <PlaygroundSwitchControl
          label="aria-invalid"
          checked={isInvalid}
          onCheckedChange={setIsInvalid}
        />
      ),
    },
    {
      name: isSpec ? "aria-label" : "label",
      type: "ReactNode",
      description: isSpec
        ? "spec은 글자가 보이지 않아 aria-label로 이름을 붙입니다"
        : "체크박스 옆 글자",
      control: (
        <PlaygroundTextControl
          label={isSpec ? "aria-label" : "label"}
          value={label}
          onValueChange={setLabel}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기 체크박스를 눌러도 Controls의 checked가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode({
        variant,
        isChecked,
        isDisabled,
        isInvalid,
        label,
      })}
      controls={controls}
      controlsNote={`checked="indeterminate"는 default·spec variant에 표시 스타일이 없어 넣지 않았습니다. 여러 개를 묶는 CheckboxGroup(value·onValueChange)과 children 직접 구성은 Samples 탭에서 확인합니다. className·wrapperClassName·labelClassName으로 모양을 바꾸지 않습니다(docs/components/Checkbox.md).`}
      state={{
        variant,
        checked: isChecked,
        disabled: isDisabled,
        "aria-invalid": isInvalid,
        [isSpec ? "aria-label" : "label"]: label,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <Checkbox
        variant={variant}
        checked={isChecked}
        onCheckedChange={handleChangeChecked}
        disabled={isDisabled}
        aria-invalid={isInvalid ? "true" : undefined}
        label={isSpec ? undefined : label}
        aria-label={isSpec ? label : undefined}
      />
    </GuidePlayground>
  );
}

function SampleCheckboxPage() {
  const [selectedValues, setSelectedValues] = useState(["reviewing"]);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Checkbox Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<CheckboxPlayground />}>
          <GuideBox
            title="Basic checkbox"
            description="기본 체크박스의 on/off, disabled 상태를 한 번에 비교합니다."
            code={`
<CheckboxGroup
  defaultValue={["checked", "checked-disabled", "custom"]}
  className="grid max-w-3xl gap-4 md:grid-cols-2"
>
  <Checkbox value="default" label="default" />
  <Checkbox value="checked" label="checked" />
  <Checkbox value="disabled" disabled label="disabled" />
  <Checkbox value="checked-disabled" disabled label="checked disabled" />
  <Checkbox value="custom">
    <Checkbox.item />
    <Checkbox.label>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-font-b">custom label</span>
        <span className="text-xs text-font-gray">
          children으로 라벨과 설명을 함께 렌더링
        </span>
      </div>
    </Checkbox.label>
  </Checkbox>
</CheckboxGroup>
        `}
          >
            <CheckboxGroup
              defaultValue={["checked", "checked-disabled", "custom"]}
              className="grid max-w-3xl gap-4 md:grid-cols-2"
            >
              <Checkbox value="default" label="default" />
              <Checkbox value="checked" label="checked" />
              <Checkbox value="disabled" disabled label="disabled" />
              <Checkbox
                value="checked-disabled"
                disabled
                label="checked disabled"
              />
              <Checkbox value="custom">
                <Checkbox.item />
                <Checkbox.label>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-font-b">
                      custom label
                    </span>
                    <span className="text-xs text-font-gray">
                      children으로 라벨과 설명을 함께 렌더링
                    </span>
                  </div>
                </Checkbox.label>
              </Checkbox>
            </CheckboxGroup>
          </GuideBox>

          <GuideBox
            title="State"
            description="제어 컴포넌트와 invalid 표시처럼 실제 폼에서 자주 쓰는 상태 예시입니다."
            code={`
const [selectedValues, setSelectedValues] = useState(["reviewing"]);

<CheckboxGroup
  value={selectedValues}
  onValueChange={setSelectedValues}
  className="grid max-w-3xl gap-4 md:grid-cols-2"
>
  <Checkbox value="pending" label="pending" />
  <Checkbox
    value="reviewing"
    label={selectedValues.includes("reviewing") ? "checked" : "unchecked"}
  />
  <Checkbox value="approved" label="approved" />
  <Checkbox value="invalid" aria-invalid="true" label="invalid" />
</CheckboxGroup>
        `}
          >
            <CheckboxGroup
              value={selectedValues}
              onValueChange={setSelectedValues}
              className="grid max-w-3xl gap-4 md:grid-cols-2"
            >
              <Checkbox value="pending" label="pending" />

              <Checkbox
                value="reviewing"
                label={
                  selectedValues.includes("reviewing") ? "checked" : "unchecked"
                }
              />
              <Checkbox value="approved" label="approved" />
              <Checkbox value="invalid" aria-invalid="true" label="invalid" />
            </CheckboxGroup>
          </GuideBox>

          <GuideBox
            title="Variants"
            description="spec은 아이콘 전용, btn은 버튼형 체크 UI로 사용할 수 있습니다."
            code={`
<div className="flex flex-wrap items-center gap-4">
  <Checkbox variant="spec" defaultChecked />
  <Checkbox variant="spec" />
  <Checkbox variant="spec" disabled />
  <Checkbox variant="spec" defaultChecked disabled />
  <Checkbox variant="btn" defaultChecked label="적용" />
  <Checkbox variant="btn" label="미적용" />
  <Checkbox variant="btn" disabled label="비활성" />
  <Checkbox variant="btn" defaultChecked disabled label="적용" />
</div>
        `}
          >
            <div className="flex flex-wrap items-center gap-4">
              <Checkbox variant="spec" defaultChecked />
              <Checkbox variant="spec" />
              <Checkbox variant="spec" disabled />
              <Checkbox variant="spec" defaultChecked disabled />
              <Checkbox variant="btn" defaultChecked label="적용" />
              <Checkbox variant="btn" label="미적용" />
              <Checkbox variant="btn" disabled label="비활성" />
              <Checkbox variant="btn" defaultChecked disabled label="적용" />
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleCheckboxPage };
export default SampleCheckboxPage;
