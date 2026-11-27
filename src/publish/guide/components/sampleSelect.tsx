import * as React from "react";
import {
  SelectMultiple,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectSimple,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundCheckboxControl,
  PlaygroundRadioControl,
  PlaygroundSwitchControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";

const statusOptions = [
  { value: "pending", label: "대기" },
  { value: "reviewing", label: "심사중" },
  { value: "approved", label: "승인" },
  { value: "rejected", label: "반려" },
];

type SelectTriggerSize = "default" | "sm";

const STATUS_VALUES = statusOptions.map((option) => option.value);
const NONE_VALUE = "__none__";
const DEFAULT_VARIANT_VALUE = "(없음)";
const DEFAULT_PLACEHOLDER = "상태를 선택하세요";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  selectedValue: string,
  isDisabled: boolean,
  isResetEnabled: boolean,
  size: SelectTriggerSize,
  hasBtnType: boolean,
  placeholder: string,
  disabledValues: string[],
) {
  const rootProps = [
    isDisabled ? "\n  disabled" : "",
    isResetEnabled
      ? '\n  resetEnabled\n  onResetValue={() => setValue("")}'
      : "",
  ].join("");
  const triggerProps = [
    size !== "default" ? ` size="${size}"` : "",
    hasBtnType ? ' variant="btnType"' : "",
  ].join("");

  const items = statusOptions
    .map((option) => {
      const disabledProp = disabledValues.includes(option.value)
        ? " disabled"
        : "";
      return `    <SelectItem value="${option.value}"${disabledProp}>${option.label}</SelectItem>`;
    })
    .join("\n");

  return `const [value, setValue] = useState("${selectedValue}");
const [open, setOpen] = useState(false);

<Select
  value={value}
  onValueChange={setValue}
  open={open}
  onOpenChange={setOpen}${rootProps}
>
  <SelectTrigger${triggerProps} className="w-full max-w-xs">
    <SelectValue placeholder="${placeholder}" />
  </SelectTrigger>
  <SelectContent>
${items}
  </SelectContent>
</Select>`;
}

/** Select Playground (이 페이지에서만 사용) */
function SelectPlayground() {
  const [selectedValue, setSelectedValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isResetEnabled, setIsResetEnabled] = React.useState(false);
  const [size, setSize] = React.useState<SelectTriggerSize>("default");
  const [hasBtnType, setHasBtnType] = React.useState(false);
  const [placeholder, setPlaceholder] = React.useState(DEFAULT_PLACEHOLDER);
  const [disabledValues, setDisabledValues] = React.useState<string[]>([]);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const handleChangeSelectValue = (nextValue: string) => {
    setSelectedValue(nextValue);
    addEventLog("onValueChange", nextValue);
  };

  const handleChangeSelectOpen = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    addEventLog("onOpenChange", nextOpen);
  };

  const handleResetSelectValue = (nextValue: string | undefined) => {
    setSelectedValue(nextValue ?? "");
    addEventLog("onResetValue", nextValue);
  };

  const handleChangeSelectedValue = (nextValue: string) => {
    setSelectedValue(nextValue === NONE_VALUE ? "" : nextValue);
  };

  const handleClickReset = () => {
    setSelectedValue("");
    setIsOpen(false);
    setIsDisabled(false);
    setIsResetEnabled(false);
    setSize("default");
    setHasBtnType(false);
    setPlaceholder(DEFAULT_PLACEHOLDER);
    setDisabledValues([]);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "value",
      type: "string",
      description: '선택 값 (onValueChange와 함께 제어형). ""이면 placeholder 표시',
      control: (
        <PlaygroundRadioControl
          label="value"
          value={selectedValue || NONE_VALUE}
          options={[{ value: NONE_VALUE, label: "없음" }, ...STATUS_VALUES]}
          onValueChange={handleChangeSelectedValue}
        />
      ),
    },
    {
      name: "open",
      type: "boolean",
      description: "목록 열림 여부 (onOpenChange와 함께 제어형)",
      control: (
        <PlaygroundSwitchControl
          label="open"
          checked={isOpen}
          onCheckedChange={setIsOpen}
          disabled={isDisabled}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Select 전체 비활성화",
      control: (
        <PlaygroundSwitchControl
          label="disabled"
          checked={isDisabled}
          onCheckedChange={setIsDisabled}
        />
      ),
    },
    {
      name: "resetEnabled",
      type: "boolean",
      description:
        "값이 있을 때 트리거 오른쪽에 리셋 버튼 표시 (onResetValue로 값 비우기)",
      control: (
        <PlaygroundSwitchControl
          label="resetEnabled"
          checked={isResetEnabled}
          onCheckedChange={setIsResetEnabled}
        />
      ),
    },
    {
      name: "SelectTrigger size",
      type: '"default" | "sm"',
      description: "트리거 높이",
      control: (
        <PlaygroundRadioControl
          label="size"
          value={size}
          options={["default", "sm"]}
          onValueChange={(next) => setSize(next as SelectTriggerSize)}
        />
      ),
    },
    {
      name: "SelectTrigger variant",
      type: '"btnType"',
      description: "테두리 없는 버튼형 트리거",
      control: (
        <PlaygroundRadioControl
          label="variant"
          value={hasBtnType ? "btnType" : DEFAULT_VARIANT_VALUE}
          options={[DEFAULT_VARIANT_VALUE, "btnType"]}
          onValueChange={(next) => setHasBtnType(next === "btnType")}
        />
      ),
    },
    {
      name: "SelectValue placeholder",
      type: "string",
      description: "값이 없을 때 보이는 문구",
      control: (
        <PlaygroundTextControl
          label="placeholder"
          value={placeholder}
          onValueChange={setPlaceholder}
        />
      ),
    },
    {
      name: "SelectItem disabled",
      type: "boolean",
      description: "선택할 수 없는 항목",
      control: (
        <PlaygroundCheckboxControl
          label="SelectItem disabled"
          value={disabledValues}
          options={STATUS_VALUES}
          onValueChange={setDisabledValues}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 열고 고르면 Controls의 value·open이 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode(
        selectedValue,
        isDisabled,
        isResetEnabled,
        size,
        hasBtnType,
        placeholder,
        disabledValues,
      )}
      controls={controls}
      controlsNote="여러 개 선택(SelectMultiple)·한 줄 구성(SelectSimple)은 다른 컴포넌트라 Samples 탭을 참고하세요. resetValue는 기본값(undefined, placeholder 표시)으로 두었습니다."
      state={{
        value: selectedValue,
        open: isOpen,
        disabled: isDisabled,
        resetEnabled: isResetEnabled,
        size,
        variant: hasBtnType ? "btnType" : null,
        placeholder,
        disabledItems: disabledValues,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <Select
        value={selectedValue}
        onValueChange={handleChangeSelectValue}
        open={isOpen}
        onOpenChange={handleChangeSelectOpen}
        disabled={isDisabled}
        resetEnabled={isResetEnabled}
        onResetValue={handleResetSelectValue}
      >
        <SelectTrigger
          size={size}
          variant={hasBtnType ? "btnType" : undefined}
          className="w-full max-w-xs"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={disabledValues.includes(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </GuidePlayground>
  );
}

function SampleSelectPage() {
  const [selectedChannels, setSelectedChannels] = React.useState<string[]>([
    "email",
    "push",
  ]);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Select Samples</h1>

      <div className="guide-content">
        <GuideSampleTabs playground={<SelectPlayground />}>
        <GuideBox
          title="Basic select"
          description="기본값, placeholder, disabled, invalid 등 폼 기본 패턴을 확인합니다."
          code={`
<div className="grid max-w-3xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">default</div>
    <Select defaultValue="reviewing">
      <SelectTrigger>
        <SelectValue placeholder="상태를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">placeholder</div>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="담당자를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="hong">홍길동</SelectItem>
        <SelectItem value="kim">김영희</SelectItem>
        <SelectItem value="lee">이민수</SelectItem>
        <SelectItem value="disabled" disabled>disabled</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">disabled</div>
    <Select defaultValue="approved" disabled>
      <SelectTrigger>
        <SelectValue placeholder="선택 불가" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">invalid</div>
    <Select>
      <SelectTrigger aria-invalid="true">
        <SelectValue placeholder="필수 값을 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>
        `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">default</div>
              <Select defaultValue="reviewing">
                <SelectTrigger>
                  <SelectValue placeholder="상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">placeholder</div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="담당자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hong">홍길동</SelectItem>
                  <SelectItem value="kim">김영희</SelectItem>
                  <SelectItem value="lee">이민수</SelectItem>
                  <SelectItem value="disabled" disabled>
                    disabled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">disabled</div>
              <Select defaultValue="approved" disabled>
                <SelectTrigger>
                  <SelectValue placeholder="선택 불가" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">invalid</div>
              <Select>
                <SelectTrigger aria-invalid="true">
                  <SelectValue placeholder="필수 값을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="resetEnabled"
          description="선택 값이 있을 때만 트리거 우측에 리셋 버튼을 표시합니다."
          code={`
<div className="grid max-w-3xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">value exists</div>
    <Select resetEnabled defaultValue="reviewing">
      <SelectTrigger>
        <SelectValue placeholder="상태를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">empty (reset hidden)</div>
    <Select resetEnabled>
      <SelectTrigger>
        <SelectValue placeholder="상태를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">value exists</div>
              <Select resetEnabled defaultValue="reviewing">
                <SelectTrigger>
                  <SelectValue placeholder="상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">empty (reset hidden)</div>
              <Select resetEnabled>
                <SelectTrigger>
                  <SelectValue placeholder="상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="multiple select"
          description="한 개가 아닌 여러 항목을 동시에 선택할 수 있는 SelectMultiple 사용 예시입니다."
          code={`
const channelOptions = [
  { value: "email", label: "이메일" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "푸시 알림" },
  { value: "kakao", label: "카카오 알림톡" },
];

const [selectedChannels, setSelectedChannels] = React.useState<string[]>([
  "email",
  "push",
]);

<SelectMultiple
  label="알림 채널"
  options={channelOptions}
  value={selectedChannels}
  onValueChange={setSelectedChannels}
  placeholder="채널을 선택하세요"
/>
          `}
        >
          <div className="max-w-xl space-y-3">
            <SelectMultiple
              label="알림 채널"
              options={[
                { value: "email", label: "이메일" },
                { value: "sms", label: "SMS" },
                { value: "push", label: "푸시 알림" },
                { value: "kakao", label: "카카오 알림톡" },
                { value: "kakao1", label: "카카오 알림톡1" },
                { value: "kakao2", label: "카카오 알림톡2" },
                { value: "kakao3", label: "카카오 알림톡3" },
                { value: "kakao4", label: "카카오 알림톡4" },
              ]}
              value={selectedChannels}
              onValueChange={setSelectedChannels}
              placeholder="채널을 선택하세요"
            />
            <div className="text-sm text-font-g">
              선택값:{" "}
              {selectedChannels.length > 0
                ? selectedChannels.join(", ")
                : "선택된 항목 없음"}
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="SelectSimple (라벨 + options 한 줄)"
          description="`label`과 `options`만 넘기면 트리거·SelectContent·SelectItem을 내부에서 구성합니다. Root의 value·defaultValue·onValueChange·disabled 등은 그대로 전달됩니다."
          code={`
const statusOptions = [
  { value: "pending", label: "대기" },
  { value: "reviewing", label: "심사중" },
  { value: "approved", label: "승인" },
];

<SelectSimple
  label="상태"
  options={statusOptions}
  placeholder="상태를 선택하세요"
  defaultValue="reviewing"
/>
        `}
        >
          <div className="max-w-xl space-y-4">
            <SelectSimple
              label="상태"
              options={statusOptions}
              placeholder="상태를 선택하세요"
              defaultValue="reviewing"
            />
            <SelectSimple
              label="우선순위"
              options={[
                { value: "low", label: "낮음" },
                { value: "mid", label: "보통" },
                { value: "high", label: "높음" },
              ]}
              placeholder="선택"
              size="sm"
            />
          </div>
        </GuideBox>

        <GuideBox
          title="Size"
          description="트리거 크기 조절과 popper 위치 지정처럼 자주 쓰는 옵션을 보여줍니다."
          code={`
<div className="grid max-w-3xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">default</div>
    <Select defaultValue="pending">
      <SelectTrigger>
        <SelectValue placeholder="우선순위를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">보통</SelectItem>
        <SelectItem value="reviewing">중요</SelectItem>
        <SelectItem value="approved">긴급</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">sm</div>
    <Select defaultValue="reviewing">
      <SelectTrigger size="sm">
        <SelectValue placeholder="우선순위를 선택하세요" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value="pending">보통</SelectItem>
        <SelectItem value="reviewing">중요</SelectItem>
        <SelectItem value="approved">긴급</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
        `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">default</div>
              <Select defaultValue="pending">
                <SelectTrigger>
                  <SelectValue placeholder="우선순위를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">보통</SelectItem>
                  <SelectItem value="reviewing">중요</SelectItem>
                  <SelectItem value="approved">긴급</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">sm</div>
              <Select defaultValue="reviewing">
                <SelectTrigger size="sm">
                  <SelectValue placeholder="우선순위를 선택하세요" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="pending">보통</SelectItem>
                  <SelectItem value="reviewing">중요</SelectItem>
                  <SelectItem value="approved">긴급</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Group and separator"
          description="레이블과 구분선을 포함한 구조화된 옵션 목록 예시입니다."
          code={`
<div className="grid max-w-3xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">with label</div>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="카테고리를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>업무 상태</SelectLabel>
          <SelectItem value="requested">접수</SelectItem>
          <SelectItem value="processing">진행중</SelectItem>
          <SelectItem value="done">완료</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>보관 상태</SelectLabel>
          <SelectItem value="archived">보관</SelectItem>
          <SelectItem value="deleted" disabled>삭제됨</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">long list</div>
    <Select defaultValue="team-3">
      <SelectTrigger>
        <SelectValue placeholder="소속 팀을 선택하세요" />
      </SelectTrigger>
      <SelectContent position="popper">
        {Array.from({ length: 12 }, (_, index) => (
          <SelectItem key={\`team-\${index + 1}\`} value={\`team-\${index + 1}\`}>
            운영팀 {index + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>
        `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">with label</div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>업무 상태</SelectLabel>
                    <SelectItem value="requested">접수</SelectItem>
                    <SelectItem value="processing">진행중</SelectItem>
                    <SelectItem value="done">완료</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>보관 상태</SelectLabel>
                    <SelectItem value="archived">보관</SelectItem>
                    <SelectItem value="deleted" disabled>
                      삭제됨
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">long list</div>
              <Select defaultValue="team-3">
                <SelectTrigger>
                  <SelectValue placeholder="소속 팀을 선택하세요" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {Array.from({ length: 12 }, (_, index) => (
                    <SelectItem
                      key={`team-${index + 1}`}
                      value={`team-${index + 1}`}
                    >
                      운영팀 {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="btnType"
          description="버튼형 트리거 스타일을 적용한 Select 사용 예시입니다."
          code={`
<div className="grid max-w-3xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">with label</div>
    <Select>
      <SelectTrigger variant="btnType">
        <SelectValue placeholder="카테고리를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">보통</SelectItem>
        <SelectItem value="reviewing">중요</SelectItem>
        <SelectItem value="approved">긴급</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">long list</div>
    <Select disabled>
      <SelectTrigger variant="btnType">
        <SelectValue placeholder="카테고리를 선택하세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">보통</SelectItem>
        <SelectItem value="reviewing">중요</SelectItem>
        <SelectItem value="approved">긴급</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
        `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">with label</div>
              <Select>
                <SelectTrigger variant="btnType">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">보통</SelectItem>
                  <SelectItem value="reviewing">중요</SelectItem>
                  <SelectItem value="approved">긴급</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">long list</div>
              <Select disabled>
                <SelectTrigger variant="btnType">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">보통</SelectItem>
                  <SelectItem value="reviewing">중요</SelectItem>
                  <SelectItem value="approved">긴급</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleSelectPage };
export default SampleSelectPage;
