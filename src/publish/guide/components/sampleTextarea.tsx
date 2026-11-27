import * as React from "react";
import {
  Icon,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
  Textarea,
} from "@/components/ui";
import { cn } from "@/lib/utils";
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

const SUGGESTED_MAX = 500;

const DEFAULT_PLACEHOLDER = "내용을 입력하세요";
const DEFAULT_ROWS = "4";
const NONE_VALUE = "__none__";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildTextareaPlaygroundCode({
  value,
  placeholder,
  rows,
  maxLength,
  isDisabled,
  isReadOnly,
  isInvalid,
}: {
  value: string;
  placeholder: string;
  rows: string;
  maxLength: string;
  isDisabled: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
}) {
  const props = [
    "value={value}",
    "onChange={(e) => setValue(e.target.value)}",
    placeholder ? `placeholder="${placeholder}"` : "",
    `rows={${rows}}`,
    maxLength !== NONE_VALUE ? `maxLength={${maxLength}}` : "",
    isDisabled ? "disabled" : "",
    isReadOnly ? "readOnly" : "",
    isInvalid ? 'aria-invalid="true"' : "",
    'aria-label="텍스트 영역"',
  ]
    .filter(Boolean)
    .map((prop) => `  ${prop}`)
    .join("\n");

  return `const [value, setValue] = useState(${JSON.stringify(value)});

<Textarea
${props}
/>`;
}

/** Textarea Playground (이 페이지에서만 사용) */
function TextareaPlayground() {
  const [value, setValue] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState(DEFAULT_PLACEHOLDER);
  const [rows, setRows] = React.useState(DEFAULT_ROWS);
  const [maxLength, setMaxLength] = React.useState(NONE_VALUE);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [isReadOnly, setIsReadOnly] = React.useState(false);
  const [isInvalid, setIsInvalid] = React.useState(false);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const handleChangeTextarea = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setValue(event.target.value);
    addEventLog("onChange", event.target.value);
  };

  const handleChangeMaxLength = (nextMaxLength: string) => {
    setMaxLength(nextMaxLength);
    // maxLength보다 긴 값은 잘라서 미리보기와 맞춥니다.
    if (nextMaxLength !== NONE_VALUE) {
      setValue((prev) => prev.slice(0, Number(nextMaxLength)));
    }
  };

  const handleChangeValue = (nextValue: string) => {
    setValue(
      maxLength === NONE_VALUE
        ? nextValue
        : nextValue.slice(0, Number(maxLength)),
    );
  };

  const handleClickReset = () => {
    setValue("");
    setPlaceholder(DEFAULT_PLACEHOLDER);
    setRows(DEFAULT_ROWS);
    setMaxLength(NONE_VALUE);
    setIsDisabled(false);
    setIsReadOnly(false);
    setIsInvalid(false);
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
          value={value}
          onValueChange={handleChangeValue}
          placeholder="값 입력"
        />
      ),
    },
    {
      name: "placeholder",
      type: "string",
      description: "값이 없을 때 보이는 안내 문구",
      control: (
        <PlaygroundTextControl
          label="placeholder"
          value={placeholder}
          onValueChange={setPlaceholder}
        />
      ),
    },
    {
      name: "rows",
      type: "number",
      description: "처음 보이는 줄 수 (세로 크기 조절은 사용자가 직접 가능)",
      control: (
        <PlaygroundRadioControl
          label="rows"
          value={rows}
          options={["2", "4", "6"]}
          onValueChange={setRows}
        />
      ),
    },
    {
      name: "maxLength",
      type: "number",
      description: "입력할 수 있는 최대 글자 수",
      control: (
        <PlaygroundRadioControl
          label="maxLength"
          value={maxLength}
          options={[{ value: NONE_VALUE, label: "없음" }, "20", "100"]}
          onValueChange={handleChangeMaxLength}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "입력 불가 (흐리게 표시)",
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
      description: "읽기 전용 (포커스·선택은 가능, 수정 불가)",
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
      description: "오류 상태 (빨간 테두리)",
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
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에 입력해도 Controls의 value가 함께 바뀝니다(제어형)."
      code={buildTextareaPlaygroundCode({
        value,
        placeholder,
        rows,
        maxLength,
        isDisabled,
        isReadOnly,
        isInvalid,
      })}
      controls={controls}
      controlsNote="Textarea는 variant·size가 없는 기본 textarea 래퍼라, 모양 관련 Props는 없습니다. 상·하단 안내·버튼이 필요하면 InputGroupTextarea를 씁니다(Samples 탭 참고)."
      state={{
        value,
        length: value.length,
        placeholder,
        rows: Number(rows),
        maxLength: maxLength === NONE_VALUE ? "(없음)" : Number(maxLength),
        disabled: isDisabled,
        readOnly: isReadOnly,
        "aria-invalid": isInvalid,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="w-full max-w-2xl">
        <Textarea
          value={value}
          onChange={handleChangeTextarea}
          onFocus={() => addEventLog("onFocus")}
          onBlur={() => addEventLog("onBlur")}
          placeholder={placeholder || undefined}
          rows={Number(rows)}
          maxLength={maxLength === NONE_VALUE ? undefined : Number(maxLength)}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={isInvalid || undefined}
          aria-label="텍스트 영역"
        />
      </div>
    </GuidePlayground>
  );
}

function SampleTextareaPage() {
  const [basicCount, setBasicCount] = React.useState("");
  const [groupCount, setGroupCount] = React.useState("");

  const basicLen = basicCount.length;
  const groupLen = groupCount.length;

  const nearLimit = (len: number, max: number) => len >= max * 0.9;

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Textarea Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<TextareaPlayground />}>
          <GuideBox
            title="기본 Textarea"
            description="단독 Textarea 컴포넌트로 여러 줄 입력을 받는 기본 예시입니다."
            code={`
<Textarea
  placeholder="내용을 입력하세요"
  rows={4}
  aria-label="기본 텍스트 영역"
/>
          `}
          >
            <div className="max-w-2xl">
              <Textarea
                placeholder="내용을 입력하세요"
                rows={4}
                aria-label="기본 텍스트 영역"
              />
            </div>
          </GuideBox>

          <GuideBox
            title="최대 글자 수 제안 · 카운터"
            description="권장 최대 글자 수를 안내하고, 현재 입력 글자 수를 실시간으로 보여 줍니다. maxLength로 초과 입력을 막을 수 있습니다."
            code={`
const MAX = 500;
const [value, setValue] = useState("");
const len = value.length;

<div className="flex max-w-2xl flex-col gap-2">
  <Textarea
    value={value}
    onChange={(e) => setValue(e.target.value)}
    maxLength={MAX}
    rows={5}
    placeholder="최대 500자까지 입력할 수 있습니다."
    aria-describedby="textarea-hint textarea-count"
  />
  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
    <span id="textarea-hint" className="text-font-g">
      제목·본문 요약 등은 최대 {MAX}자를 넘기지 않도록 해 주세요.
    </span>
    <span
      id="textarea-count"
      className={len >= MAX * 0.9 ? "font-medium text-red" : "text-font-g"}
      aria-live="polite"
    >
      {len} / {MAX}
    </span>
  </div>
</div>
          `}
          >
            <div className="flex max-w-2xl flex-col gap-2">
              <Textarea
                value={basicCount}
                onChange={(e) => setBasicCount(e.target.value)}
                maxLength={SUGGESTED_MAX}
                rows={5}
                placeholder="최대 500자까지 입력할 수 있습니다."
                aria-describedby="textarea-hint textarea-count"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span id="textarea-hint" className="text-font-g">
                  제목·본문 요약 등은 최대 {SUGGESTED_MAX}자를 넘기지 않도록 해
                  주세요.
                </span>
                <span
                  id="textarea-count"
                  className={cn(
                    nearLimit(basicLen, SUGGESTED_MAX)
                      ? "font-medium text-red"
                      : "text-font-g",
                  )}
                  aria-live="polite"
                >
                  {basicLen} / {SUGGESTED_MAX}
                </span>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Input group · Textarea"
            description="Textarea와 상·하단 가이드·액션을 InputGroup으로 묶는 패턴입니다."
            code={`
<div className="grid max-w-4xl gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">with top guide</div>
    <InputGroup>
      <InputGroupAddon align="block-start">
        <InputGroupText>상세 설명</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="계약 관련 요청사항을 입력하세요" />
    </InputGroup>
  </div>
  <div className="flex flex-col gap-2">
    <div className="text-sm text-font-g">with bottom action</div>
    <InputGroup>
      <InputGroupTextarea placeholder="첨부파일과 함께 메모를 남겨보세요" />
      <InputGroupAddon align="block-end">
        <InputGroupText>
          <Icon name="attachment" />
          첨부 2건
        </InputGroupText>
        <InputGroupButton
          variant="outline"
          size="sm"
          shape="square"
          color="gray"
        >
          업로드
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
</div>
          `}
          >
            <div className="grid max-w-4xl gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="text-sm text-font-g">with top guide</div>
                <InputGroup>
                  <InputGroupAddon align="block-start">
                    <InputGroupText>상세 설명</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupTextarea placeholder="계약 관련 요청사항을 입력하세요" />
                </InputGroup>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-sm text-font-g">with bottom action</div>
                <InputGroup>
                  <InputGroupTextarea placeholder="첨부파일과 함께 메모를 남겨보세요" />
                  <InputGroupAddon align="block-end">
                    <InputGroupText>
                      <Icon name="attachment" />
                      첨부 2건
                    </InputGroupText>
                    <InputGroupButton
                      variant="outline"
                      size="sm"
                      shape="square"
                      color="gray"
                    >
                      업로드
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Input group + 하단 글자 수"
            description="block-end 영역에 최대 글자 안내와 카운터를 함께 두는 폼 패턴입니다."
            code={`
const MAX = 300;
const [value, setValue] = useState("");
const len = value.length;

<InputGroup>
  <InputGroupAddon align="block-start">
    <InputGroupText>메모</InputGroupText>
  </InputGroupAddon>
  <InputGroupTextarea
    value={value}
    onChange={(e) => setValue(e.target.value)}
    maxLength={MAX}
    rows={4}
    placeholder="최대 300자"
    aria-describedby="group-count"
  />
  <InputGroupAddon align="block-end">
    <InputGroupText className="flex w-full flex-wrap justify-between gap-2">
      <span className="text-font-g">내부 공유용 (최대 {MAX}자)</span>
      <span
        id="group-count"
        className={len >= MAX * 0.9 ? "font-medium text-red" : ""}
      >
        {len} / {MAX}
      </span>
    </InputGroupText>
  </InputGroupAddon>
</InputGroup>
          `}
          >
            <div className="max-w-2xl">
              <InputGroup>
                <InputGroupAddon align="block-start">
                  <InputGroupText>메모</InputGroupText>
                </InputGroupAddon>
                <InputGroupTextarea
                  value={groupCount}
                  onChange={(e) => setGroupCount(e.target.value)}
                  maxLength={300}
                  rows={4}
                  placeholder="최대 300자"
                  aria-describedby="group-count"
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="flex w-full flex-wrap justify-between gap-2">
                    <span className="text-font-g">
                      내부 공유용 (최대 300자 권장)
                    </span>
                    <span
                      id="group-count"
                      className={cn(
                        nearLimit(groupLen, 300) ? "font-medium text-red" : "",
                      )}
                      aria-live="polite"
                    >
                      {groupLen} / 300
                    </span>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleTextareaPage };
export default SampleTextareaPage;
