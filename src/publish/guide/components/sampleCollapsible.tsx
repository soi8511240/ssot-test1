import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleTrigger,
  collapsibleChevronClassName,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundSwitchControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";

const DEFAULT_TRIGGER_TEXT = "암진단 특약 상세";
const PLAYGROUND_CONTENT_TEXT = "보장 내용, 면책 기간 등 특약의 상세 내용입니다.";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  isOpen: boolean,
  isDisabled: boolean,
  triggerText: string,
) {
  const disabledProp = isDisabled ? "\n  disabled" : "";

  return `const [open, setOpen] = useState(${isOpen});

<Collapsible
  open={open}
  onOpenChange={setOpen}${disabledProp}
  className="w-full max-w-md"
>
  <CollapsibleTrigger>
    <span>${triggerText}</span>
    <ChevronDownIcon className={collapsibleChevronClassName} aria-hidden />
  </CollapsibleTrigger>
  <CollapsibleContent>${PLAYGROUND_CONTENT_TEXT}</CollapsibleContent>
</Collapsible>`;
}

/** Collapsible Playground (이 페이지에서만 사용) */
function CollapsiblePlayground() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [triggerText, setTriggerText] = React.useState(DEFAULT_TRIGGER_TEXT);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const handleChangeCollapsibleOpen = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    addEventLog("onOpenChange", nextOpen);
  };

  const handleClickReset = () => {
    setIsOpen(false);
    setIsDisabled(false);
    setTriggerText(DEFAULT_TRIGGER_TEXT);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "open",
      type: "boolean",
      description: "펼침 여부 (onOpenChange와 함께 제어형)",
      control: (
        <PlaygroundSwitchControl
          label="open"
          checked={isOpen}
          onCheckedChange={setIsOpen}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "접기·펼치기를 막음 (트리거가 눌리지 않음)",
      control: (
        <PlaygroundSwitchControl
          label="disabled"
          checked={isDisabled}
          onCheckedChange={setIsDisabled}
        />
      ),
    },
    {
      name: "CollapsibleTrigger children",
      type: "ReactNode",
      description: "트리거 글자 (무엇이 펼쳐지는지 알 수 있게)",
      control: (
        <PlaygroundTextControl
          label="CollapsibleTrigger children"
          value={triggerText}
          onValueChange={setTriggerText}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기의 트리거를 눌러도 Controls의 open이 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode(isOpen, isDisabled, triggerText)}
      controls={controls}
      controlsNote="defaultOpen은 처음 값만 정하는 비제어형 Prop이라 제어형 open으로 대신합니다. 여러 항목을 묶는 CollapsibleGroup(type·value·collapsible)은 Samples 탭의 예시를 참고하세요."
      state={{
        open: isOpen,
        disabled: isDisabled,
        triggerText,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={handleChangeCollapsibleOpen}
        disabled={isDisabled}
        className="w-full max-w-md"
      >
        <CollapsibleTrigger>
          <span>{triggerText}</span>
          <ChevronDownIcon
            className={collapsibleChevronClassName}
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent>{PLAYGROUND_CONTENT_TEXT}</CollapsibleContent>
      </Collapsible>
    </GuidePlayground>
  );
}

function SampleCollapsiblePage() {
  const [controlledOpen, setControlledOpen] = React.useState(false);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Collapsible Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<CollapsiblePlayground />}>
        <GuideBox
          title="기본 Collapsible"
          description="루트·트리거·콘텐츠에 Collapsible.module.scss 기본 스타일이 적용됩니다. 아이콘에는 collapsibleChevronClassName을 쓰면 열림 상태에서 회전합니다."
          code={`
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  collapsibleChevronClassName,
} from "@/components/ui";

<Collapsible className="w-full max-w-md">
  <CollapsibleTrigger>
    <span>자세히 보기</span>
    <ChevronDownIcon className={collapsibleChevronClassName} aria-hidden />
  </CollapsibleTrigger>
  <CollapsibleContent>
    접었다 펼칠 수 있는 본문입니다.
  </CollapsibleContent>
</Collapsible>
          `}
        >
          <Collapsible className="w-full max-w-md">
            <CollapsibleTrigger>
              <span>자세히 보기</span>
              <ChevronDownIcon
                className={collapsibleChevronClassName}
                aria-hidden
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              접었다 펼칠 수 있는 본문입니다. 필터 패널, FAQ 한 줄, 부가 설명
              등에 쓰기 좋습니다.
            </CollapsibleContent>
          </Collapsible>
        </GuideBox>

        <GuideBox
          title="CollapsibleGroup — 한 번에 하나만 열림 (single)"
          description='Accordion의 type="single"과 같습니다. 다른 패널을 열면 이전 패널은 닫힙니다. collapsible={false}이면 열린 항목을 다시 눌러도 닫히지 않습니다.'
          code={`
<CollapsibleGroup type="single" defaultValue="a" className="w-full max-w-md">
  <Collapsible value="a">
    <CollapsibleTrigger>첫 번째</CollapsibleTrigger>
    <CollapsibleContent>내용 A</CollapsibleContent>
  </Collapsible>
  <Collapsible value="b">
    <CollapsibleTrigger>두 번째</CollapsibleTrigger>
    <CollapsibleContent>내용 B</CollapsibleContent>
  </Collapsible>
</CollapsibleGroup>
          `}
        >
          <CollapsibleGroup
            type="single"
            defaultValue="a"
            className="w-full max-w-md"
          >
            <Collapsible value="a">
              <CollapsibleTrigger>
                <span>첫 번째 패널</span>
                <ChevronDownIcon
                  className={collapsibleChevronClassName}
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                한 번에 하나만 열립니다. 다른 트리거를 누르면 이 패널은
                닫힙니다.
              </CollapsibleContent>
            </Collapsible>
            <Collapsible value="b">
              <CollapsibleTrigger>
                <span>두 번째 패널</span>
                <ChevronDownIcon
                  className={collapsibleChevronClassName}
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>두 번째 패널 본문입니다.</CollapsibleContent>
            </Collapsible>
            <Collapsible value="c">
              <CollapsibleTrigger>
                <span>세 번째 패널</span>
                <ChevronDownIcon
                  className={collapsibleChevronClassName}
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>세 번째 패널 본문입니다.</CollapsibleContent>
            </Collapsible>
          </CollapsibleGroup>
        </GuideBox>

        <GuideBox
          title="CollapsibleGroup — 여러 개 동시에 열림 (multiple)"
          description='Accordion의 type="multiple"과 같습니다. 각 패널의 열림 상태가 독립적으로 유지됩니다.'
          code={`
<CollapsibleGroup type="multiple" defaultValue={["x"]} className="w-full max-w-md">
  <Collapsible value="x">...</Collapsible>
  <Collapsible value="y">...</Collapsible>
</CollapsibleGroup>
          `}
        >
          <CollapsibleGroup
            type="multiple"
            defaultValue={["x"]}
            className="w-full max-w-md"
          >
            <Collapsible value="x">
              <CollapsibleTrigger>
                <span>패널 X</span>
                <ChevronDownIcon
                  className={collapsibleChevronClassName}
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                X와 Y를 동시에 열 수 있습니다.
              </CollapsibleContent>
            </Collapsible>
            <Collapsible value="y">
              <CollapsibleTrigger>
                <span>패널 Y</span>
                <ChevronDownIcon
                  className={collapsibleChevronClassName}
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>패널 Y 본문입니다.</CollapsibleContent>
            </Collapsible>
          </CollapsibleGroup>
        </GuideBox>

        <GuideBox
          title="기본으로 열린 상태"
          description="defaultOpen으로 마운트 시 펼쳐진 상태로 시작합니다."
          code={`
<Collapsible className="w-full max-w-md" defaultOpen>
  <CollapsibleTrigger>
    <span>기본 열림</span>
    <ChevronDownIcon className={collapsibleChevronClassName} aria-hidden />
  </CollapsibleTrigger>
  <CollapsibleContent>처음부터 보이는 내용입니다.</CollapsibleContent>
</Collapsible>
          `}
        >
          <Collapsible className="w-full max-w-md" defaultOpen>
            <CollapsibleTrigger>
              <span>기본 열림</span>
              <ChevronDownIcon
                className={collapsibleChevronClassName}
                aria-hidden
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              처음부터 보이는 내용입니다. 사용자가 먼저 봐야 하는 안내나 약관
              요약에 활용할 수 있습니다.
            </CollapsibleContent>
          </Collapsible>
        </GuideBox>

        <GuideBox
          title="제어형(open)과 외부 버튼"
          description="open·onOpenChange로 상태를 부모에서 제어하고, 다른 UI와 연동할 수 있습니다."
          code={`
const [open, setOpen] = React.useState(false);

<div className="flex flex-col gap-3 w-full max-w-md">
  <div className="flex gap-2">
    <Button type="button" size="sm" onClick={() => setOpen(true)}>펼치기</Button>
    <Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>접기</Button>
  </div>
  <Collapsible open={open} onOpenChange={setOpen} className="w-full">
    ...
  </Collapsible>
</div>
          `}
        >
          <div className="flex w-full max-w-md flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => setControlledOpen(true)}
              >
                펼치기
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setControlledOpen(false)}
              >
                접기
              </Button>
              <span className="self-center text-xs text-font-g">
                현재: {controlledOpen ? "열림" : "닫힘"}
              </span>
            </div>
            <Collapsible
              open={controlledOpen}
              onOpenChange={setControlledOpen}
              className="w-full"
            >
              <CollapsibleTrigger>
                <span>패널 (트리거로도 토글 가능)</span>
                <ChevronDownIcon
                  className={collapsibleChevronClassName}
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                외부 버튼과 트리거 모두 같은 open 상태를 공유합니다.
              </CollapsibleContent>
            </Collapsible>
          </div>
        </GuideBox>

        <GuideBox
          title="비활성화된 트리거"
          description="CollapsibleTrigger에 disabled를 주면 접근은 막고 레이아웃은 유지할 수 있습니다."
          code={`
<Collapsible className="w-full max-w-md" defaultOpen>
  <CollapsibleTrigger disabled className="cursor-not-allowed opacity-70">
    <span>비활성 (열린 상태 유지)</span>
    <ChevronDownIcon className={cn(collapsibleChevronClassName, "opacity-50")} aria-hidden />
  </CollapsibleTrigger>
  <CollapsibleContent>트리거는 눌리지 않습니다.</CollapsibleContent>
</Collapsible>
          `}
        >
          <Collapsible className="w-full max-w-md" defaultOpen>
            <CollapsibleTrigger
              disabled
              className="cursor-not-allowed opacity-70"
            >
              <span>비활성 (열린 상태 유지)</span>
              <ChevronDownIcon
                className={cn(collapsibleChevronClassName, "opacity-50")}
                aria-hidden
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              준비 중인 기능 등으로 접기를 막을 때 사용할 수 있습니다.
            </CollapsibleContent>
          </Collapsible>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleCollapsiblePage };
export default SampleCollapsiblePage;
