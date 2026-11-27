import { useId, useState, type ChangeEvent } from "react";

import {
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
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

type InputType = "text" | "password" | "email" | "tel";

const INPUT_TYPES: InputType[] = ["text", "password", "email", "tel"];
const DEFAULT_PLACEHOLDER = "이름을 입력하세요";
const RESET_LABEL = "입력값 지우기";

type InputPlaygroundOptions = {
  inputType: InputType;
  inputValue: string;
  placeholder: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
  isResetEnabled: boolean;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  inputType,
  inputValue,
  placeholder,
  isDisabled,
  isReadOnly,
  isInvalid,
  isResetEnabled,
}: InputPlaygroundOptions) {
  const props = [
    "id={inputId}",
    inputType === "text" ? "" : `type="${inputType}"`,
    "value={value}",
    "onChange={(e) => setValue(e.target.value)}",
    placeholder ? `placeholder="${placeholder}"` : "",
    isDisabled ? "disabled" : "",
    isReadOnly ? "readOnly" : "",
    isInvalid ? 'aria-invalid="true"' : "",
    isResetEnabled ? "resetEnabled" : "",
    isResetEnabled ? `resetLabel="${RESET_LABEL}"` : "",
    isResetEnabled ? "onResetValue={setValue}" : "",
    'className="w-full max-w-md"',
  ]
    .filter(Boolean)
    .map((prop) => `  ${prop}`)
    .join("\n");

  return `const inputId = useId();
const [value, setValue] = useState(${JSON.stringify(inputValue)});

<label htmlFor={inputId}>이름</label>
<Input
${props}
/>`;
}

/** Input Playground (이 페이지에서만 사용) */
function InputPlayground() {
  const inputId = useId();
  const [inputType, setInputType] = useState<InputType>("text");
  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isResetEnabled, setIsResetEnabled] = useState(true);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    addEventLog("onChange", event.target.value);
  };

  // 제어형에서는 리셋 버튼이 onChange를 부르지 않을 수 있어 onResetValue에서도 값을 맞춥니다.
  const handleResetInputValue = (nextValue: string) => {
    setInputValue(nextValue);
    addEventLog("onResetValue", nextValue);
  };

  const handleClickReset = () => {
    setInputType("text");
    setInputValue("");
    setPlaceholder(DEFAULT_PLACEHOLDER);
    setIsDisabled(false);
    setIsReadOnly(false);
    setIsInvalid(false);
    setIsResetEnabled(true);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "value",
      type: "string",
      description: "입력값 (onChange와 함께 제어형)",
      control: (
        <PlaygroundTextControl
          label="value"
          value={inputValue}
          onValueChange={setInputValue}
        />
      ),
    },
    {
      name: "type",
      type: '"text" | "password" | "email" | "tel" …',
      description: "<input> type (날짜는 DatePicker를 씁니다)",
      control: (
        <PlaygroundRadioControl
          label="type"
          value={inputType}
          options={INPUT_TYPES}
          onValueChange={(next) => setInputType(next as InputType)}
        />
      ),
    },
    {
      name: "placeholder",
      type: "string",
      description: "비었을 때 보이는 글자 (라벨 대신 쓰지 않음)",
      control: (
        <PlaygroundTextControl
          label="placeholder"
          value={placeholder}
          onValueChange={setPlaceholder}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "입력 불가",
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
      description: "읽기 전용 (계산된 결과처럼 읽을 수 있어야 할 때)",
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
      description:
        "값이 있을 때 지우기(×) 버튼 표시 (disabled·readOnly이면 숨김)",
      control: (
        <PlaygroundSwitchControl
          label="resetEnabled"
          checked={isResetEnabled}
          onCheckedChange={setIsResetEnabled}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에 입력해도 Controls의 value가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode({
        inputType,
        inputValue,
        placeholder,
        isDisabled,
        isReadOnly,
        isInvalid,
        isResetEnabled,
      })}
      controls={controls}
      controlsNote="InputGroup(type·InputGroupAddon align)은 앞뒤에 글자·버튼을 붙이는 구성이라 Samples 탭의 예시를 참고하세요. className으로 높이·테두리·글자를 바꾸는 것은 금지(docs/components/Input.md)라 넣지 않았습니다."
      state={{
        value: inputValue,
        type: inputType,
        placeholder,
        disabled: isDisabled,
        readOnly: isReadOnly,
        "aria-invalid": isInvalid,
        resetEnabled: isResetEnabled,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="flex w-full max-w-md flex-col gap-2">
        <label htmlFor={inputId} className="text-sm text-font-g">
          이름
        </label>
        <Input
          id={inputId}
          type={inputType}
          value={inputValue}
          onChange={handleChangeInput}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={isInvalid ? "true" : undefined}
          resetEnabled={isResetEnabled}
          resetLabel={RESET_LABEL}
          onResetValue={handleResetInputValue}
          className="w-full max-w-md"
        />
      </div>
    </GuidePlayground>
  );
}

function SampleInputPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Input Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<InputPlayground />}>
        <GuideBox
          title="Basic input"
          description="기본 입력창, disabled, password, invalid 상태 예시입니다."
          code={`
<div className="grid max-w-3xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">default</div>
    <Input placeholder="이름을 입력하세요" />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">disabled</div>
    <Input
      placeholder="비활성화 상태"
      disabled
      defaultValue={"비활성화 상태값"}
    />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">password + resetEnabled</div>
    <Input type="password" resetEnabled defaultValue="password123!" />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">password + resetEnabled (empty)</div>
    <Input
      type="password"
      resetEnabled
      placeholder="비밀번호를 입력하세요"
    />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">invalid</div>
    <Input
      aria-invalid="true"
      defaultValue="wrong-email-format"
      placeholder="이메일을 입력하세요"
    />
  </div>
</div>
          `}
        >
          <div className="grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">default</div>
              <Input placeholder="이름을 입력하세요" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">disabled</div>
              <Input
                placeholder="비활성화 상태"
                disabled
                defaultValue={"비활성화 상태값"}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">password + resetEnabled</div>
              <Input type="password" resetEnabled defaultValue="password123!" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">
                password + resetEnabled (empty)
              </div>
              <Input
                type="password"
                resetEnabled
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">invalid</div>
              <Input
                aria-invalid="true"
                defaultValue="wrong-email-format"
                placeholder="이메일을 입력하세요"
              />
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Input group · inline addons"
          description="prefix/suffix 텍스트나 아이콘을 입력창 양옆에 붙이는 패턴입니다."
          code={`
<div className="grid max-w-4xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">prefix text</div>
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">suffix text</div>
    <InputGroup>
      <InputGroupInput placeholder="금액" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>KRW</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">icon + text</div>
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <Icon name="user-settings" />
          담당자
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="홍길동" />
    </InputGroup>
  </div>
</div>
          `}
        >
          <div className="grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">prefix text</div>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="example.com" />
              </InputGroup>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">suffix text</div>
              <InputGroup>
                <InputGroupInput placeholder="금액" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>KRW</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">icon + text</div>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <Icon name="user-settings" />
                    담당자
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="홍길동" />
              </InputGroup>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="Input group · block addons"
          description="가이드 텍스트를 위아래 블록으로 붙이는 레이아웃 예시입니다."
          code={`
<div className="grid max-w-4xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">block-start</div>
    <InputGroup>
      <InputGroupAddon align="block-start">
        <InputGroupText>
          파일 설명
          <kbd>required</kbd>
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="제목을 입력하세요" />
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">block-end</div>
    <InputGroup>
      <InputGroupInput placeholder="메모를 입력하세요" />
      <InputGroupAddon align="block-end">
        <InputGroupText>
          최대 100자까지 입력할 수 있습니다.
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
</div>
          `}
        >
          <div className="grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">block-start</div>
              <InputGroup>
                <InputGroupAddon align="block-start">
                  <InputGroupText>
                    파일 설명
                    <kbd>required</kbd>
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="제목을 입력하세요" />
              </InputGroup>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">block-end</div>
              <InputGroup>
                <InputGroupInput placeholder="메모를 입력하세요" />
                <InputGroupAddon align="block-end">
                  <InputGroupText>
                    최대 100자까지 입력할 수 있습니다.
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="search"
          description="우측 검색 버튼을 인라인으로 붙인 검색형 InputGroup 예시입니다."
          code={`
<div className="grid max-w-4xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <InputGroup>
      <InputGroupInput placeholder="검색어를 입력하세요" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="ghost">
          <Icon name="search" size={16} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <InputGroup>
      <InputGroupInput placeholder="검색어를 입력하세요" disabled />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="ghost">
          <Icon name="search" size={16} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <InputGroup>
      <InputGroupInput
        placeholder="검색어를 입력하세요"
        aria-invalid="true"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="ghost">
          <Icon name="search" size={16} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
</div>
          `}
        >
          <div className="grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <InputGroup>
                <InputGroupInput placeholder="검색어를 입력하세요" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton variant="ghost">
                    <Icon name="search" size={16} />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-2">
              <InputGroup>
                <InputGroupInput placeholder="검색어를 입력하세요" disabled />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton variant="ghost">
                    <Icon name="search" size={16} />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="flex flex-col gap-2">
              <InputGroup>
                <InputGroupInput
                  placeholder="검색어를 입력하세요"
                  aria-invalid="true"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton variant="ghost">
                    <Icon name="search" size={16} />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </GuideBox>
        <GuideBox
          title="search-btnType"
          description="검색 버튼을 outline 버튼 타입으로 분리한 변형 예시입니다."
          code={`
<div className="grid max-w-4xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <InputGroup type="btnType">
      <InputGroupInput placeholder="검색어를 입력하세요" />
      <InputGroupAddon align="inline-end" className="p-0!">
        <InputGroupButton
          variant="outline"
          size="sm"
          shape="square"
          color="gray"
        >
          <Icon name="search" size={16} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <InputGroup type="btnType">
      <InputGroupInput placeholder="검색어를 입력하세요" disabled />
      <InputGroupAddon align="inline-end" className="p-0!">
        <InputGroupButton
          variant="outline"
          size="sm"
          shape="square"
          color="gray"
          disabled
        >
          <Icon name="search" size={16} />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <InputGroup type="btnType">
      <InputGroupInput
        placeholder="검색어를 입력하세요"
        aria-invalid="true"
        defaultValue="Filled Value"
      />
      <InputGroupAddon align="inline-end">
        <Icon name="error-warning" size={16} />
      </InputGroupAddon>
    </InputGroup>
  </div>
</div>
          `}
        >
          <div className="grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <InputGroup type="btnType">
                <InputGroupInput placeholder="검색어를 입력하세요" />
                <InputGroupAddon align="inline-end" className="p-0!">
                  <InputGroupButton
                    variant="outline"
                    size="sm"
                    shape="square"
                    color="gray"
                  >
                    <Icon name="search" size={16} />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-2">
              <InputGroup type="btnType">
                <InputGroupInput placeholder="검색어를 입력하세요" disabled />
                <InputGroupAddon align="inline-end" className="p-0!">
                  <InputGroupButton
                    variant="outline"
                    size="sm"
                    shape="square"
                    color="gray"
                    disabled
                  >
                    <Icon name="search" size={16} />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-2">
              <InputGroup type="btnType">
                <InputGroupInput
                  placeholder="검색어를 입력하세요"
                  aria-invalid="true"
                  defaultValue="Filled Value"
                />
                <InputGroupAddon align="inline-end">
                  <Icon name="error-warning" size={16} />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="resetEnabled"
          description="값이 있을 때만 보이는 리셋 버튼 예시입니다. (suffix가 있으면 suffix 바로 앞)"
          code={`
<div className="grid max-w-4xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">reset shown when value exists</div>
    <Input resetEnabled defaultValue="입력해보세요" placeholder="리셋을 눌러 초기화" />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">reset hidden when empty</div>
    <Input resetEnabled placeholder="값이 없으면 리셋이 숨겨집니다" />
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">reset + suffix</div>
    <InputGroup>
      <InputGroupInput resetEnabled defaultValue="1000" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>KRW</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">suffix + reset hidden</div>
    <InputGroup>
      <InputGroupInput resetEnabled placeholder="금액" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>KRW</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
</div>
          `}
        >
          <div className="grid max-w-4xl gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">
                reset shown when value exists
              </div>
              <Input
                resetEnabled
                defaultValue="입력해보세요"
                placeholder="리셋을 눌러 초기화"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">reset hidden when empty</div>
              <Input resetEnabled placeholder="값이 없으면 리셋이 숨겨집니다" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">reset + suffix</div>
              <InputGroup>
                <InputGroupInput resetEnabled defaultValue="1000" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>KRW</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-font-g">suffix + reset hidden</div>
              <InputGroup>
                <InputGroupInput resetEnabled placeholder="금액" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>KRW</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleInputPage };
export default SampleInputPage;
