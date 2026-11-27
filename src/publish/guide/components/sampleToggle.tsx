import { Switch } from "@/components/ui";
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

type SwitchSize = "default" | "sm";

const DEFAULT_ON_LABEL = "ON";
const DEFAULT_OFF_LABEL = "OFF";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  isChecked: boolean,
  size: SwitchSize,
  isDisabled: boolean,
  onLabel: string,
  offLabel: string,
) {
  const isDefaultSize = size === "default";
  const props = [
    "checked={checked}",
    "onCheckedChange={setChecked}",
    !isDefaultSize ? `size="${size}"` : "",
    isDisabled ? "disabled" : "",
    isDefaultSize && onLabel !== DEFAULT_ON_LABEL
      ? `onLabel=${JSON.stringify(onLabel)}`
      : "",
    isDefaultSize && offLabel !== DEFAULT_OFF_LABEL
      ? `offLabel=${JSON.stringify(offLabel)}`
      : "",
    'aria-label="알림 받기"',
  ]
    .filter(Boolean)
    .map((prop) => `  ${prop}`)
    .join("\n");

  return `const [checked, setChecked] = useState(${isChecked});

<Switch
${props}
/>`;
}

/** Switch Playground (이 페이지에서만 사용) */
function SwitchPlayground() {
  const [isChecked, setIsChecked] = useState(false);
  const [size, setSize] = useState<SwitchSize>("default");
  const [isDisabled, setIsDisabled] = useState(false);
  const [onLabel, setOnLabel] = useState(DEFAULT_ON_LABEL);
  const [offLabel, setOffLabel] = useState(DEFAULT_OFF_LABEL);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const isDefaultSize = size === "default";

  const handleChangeSwitchChecked = (nextChecked: boolean) => {
    setIsChecked(nextChecked);
    addEventLog("onCheckedChange", nextChecked);
  };

  const handleClickReset = () => {
    setIsChecked(false);
    setSize("default");
    setIsDisabled(false);
    setOnLabel(DEFAULT_ON_LABEL);
    setOffLabel(DEFAULT_OFF_LABEL);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "checked",
      type: "boolean",
      description: "켜짐 여부 (onCheckedChange와 함께 제어형)",
      control: (
        <PlaygroundSwitchControl
          label="checked"
          checked={isChecked}
          onCheckedChange={setIsChecked}
        />
      ),
    },
    {
      name: "size",
      type: '"default" | "sm"',
      description: "크기 (sm은 ON/OFF 문구를 표시하지 않음)",
      control: (
        <PlaygroundRadioControl
          label="size"
          value={size}
          options={["default", "sm"]}
          onValueChange={(next) => setSize(next as SwitchSize)}
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
      name: "onLabel",
      type: "ReactNode",
      description: '켜짐 문구 (size="default"에서만 표시)',
      control: (
        <PlaygroundTextControl
          label="onLabel"
          value={onLabel}
          onValueChange={setOnLabel}
          disabled={!isDefaultSize}
        />
      ),
    },
    {
      name: "offLabel",
      type: "ReactNode",
      description: '꺼짐 문구 (size="default"에서만 표시)',
      control: (
        <PlaygroundTextControl
          label="offLabel"
          value={offLabel}
          onValueChange={setOffLabel}
          disabled={!isDefaultSize}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기 스위치를 눌러도 Controls의 checked가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode(isChecked, size, isDisabled, onLabel, offLabel)}
      controls={controls}
      controlsNote="문구가 길면 기본 너비(최소 68px)를 넘을 수 있습니다. 너비를 바꾸는 className은 모양 변경이라 Controls에 넣지 않았습니다."
      state={{
        checked: isChecked,
        size,
        disabled: isDisabled,
        onLabel: isDefaultSize ? onLabel : "(size=default에서만 표시)",
        offLabel: isDefaultSize ? offLabel : "(size=default에서만 표시)",
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="flex items-center gap-2">
        <Switch
          checked={isChecked}
          onCheckedChange={handleChangeSwitchChecked}
          size={size}
          disabled={isDisabled}
          onLabel={onLabel}
          offLabel={offLabel}
          aria-label="알림 받기"
        />
        <span className="text-sm font-medium text-font-b">알림 받기</span>
      </div>
    </GuidePlayground>
  );
}

function SampleSwitchPage() {
  const [enabled, setEnabled] = useState(true);
  const [smallEnabled, setSmallEnabled] = useState(false);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Switch Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<SwitchPlayground />}>
          <GuideBox
            title="Basic toggle"
            description="기본 크기, small 크기, disabled 상태를 한 번에 비교합니다."
            code={`
<div className="flex flex-wrap items-center gap-4">
  <Switch defaultChecked aria-label="default checked toggle" />
  <Switch aria-label="default unchecked toggle" />
  <Switch
    size="sm"
    defaultChecked
    aria-label="small checked toggle"
  />
  <Switch disabled aria-label="disabled toggle" />
</div>
            `}
          >
            <div className="flex flex-wrap items-center gap-4">
              <Switch defaultChecked aria-label="default checked toggle" />
              <Switch aria-label="default unchecked toggle" />
              <Switch
                size="sm"
                defaultChecked
                aria-label="small checked toggle"
              />
              <Switch disabled aria-label="disabled toggle" />
            </div>
          </GuideBox>

          <GuideBox
            title="Controlled state"
            description="폼 제어처럼 상태를 외부에서 관리하는 예시입니다."
            code={`
const [enabled, setEnabled] = useState(true);
const [smallEnabled, setSmallEnabled] = useState(false);

<div className="flex flex-col gap-4">
  <div className="flex items-center gap-3">
    <Switch
      checked={enabled}
      onCheckedChange={setEnabled}
      aria-label="controlled toggle"
    />
    <span className="text-sm font-medium text-font-b">
      {enabled ? "enabled" : "disabled"}
    </span>
  </div>
  <div className="flex items-center gap-3">
    <Switch
      size="sm"
      checked={smallEnabled}
      onCheckedChange={setSmallEnabled}
      aria-label="small controlled toggle"
    />
    <span className="text-sm font-medium text-font-b">
      {smallEnabled ? "small on" : "small off"}
    </span>
  </div>
</div>
            `}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={enabled}
                  onCheckedChange={setEnabled}
                  aria-label="controlled toggle"
                />
                <span className="text-sm font-medium text-font-b">
                  {enabled ? "enabled" : "disabled"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  size="sm"
                  checked={smallEnabled}
                  onCheckedChange={setSmallEnabled}
                  aria-label="small controlled toggle"
                />
                <span className="text-sm font-medium text-font-b">
                  {smallEnabled ? "small on" : "small off"}
                </span>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Custom labels"
            description="기본 ON/OFF 대신 상황에 맞는 문구를 props로 전달할 수 있습니다."
            code={`
<div className="flex flex-col gap-4">
  <div className="flex items-center gap-3">
    <Switch
      defaultChecked
      onLabel="사용"
      offLabel="미사용"
      aria-label="usage label toggle"
      className="w-20"
    />
    <span className="text-sm font-medium text-font-b">사용 여부</span>
  </div>
  <div className="flex items-center gap-3">
    <Switch
      onLabel="공개"
      offLabel="비공개"
      aria-label="visibility label toggle"
      className="w-20"
    />
    <span className="text-sm font-medium text-font-b">공개 설정</span>
  </div>
  <div className="flex items-center gap-3">
    <Switch
      defaultChecked
      onLabel="YES"
      offLabel="NO"
      aria-label="english label toggle"
      className="w-20"
    />
    <span className="text-sm font-medium text-font-b">영문 라벨</span>
  </div>
</div>
            `}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  defaultChecked
                  onLabel="사용"
                  offLabel="미사용"
                  aria-label="usage label toggle"
                  className="w-20"
                />
                <span className="text-sm font-medium text-font-b">사용 여부</span>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  onLabel="공개"
                  offLabel="비공개"
                  aria-label="visibility label toggle"
                  className="w-20"
                />
                <span className="text-sm font-medium text-font-b">공개 설정</span>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  defaultChecked
                  onLabel="YES"
                  offLabel="NO"
                  aria-label="english label toggle"
                  className="w-20"
                />
                <span className="text-sm font-medium text-font-b">영문 라벨</span>
              </div>
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleSwitchPage };
export default SampleSwitchPage;
