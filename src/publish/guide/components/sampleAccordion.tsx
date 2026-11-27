import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
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

type AccordionType = "single" | "multiple";

const PLAYGROUND_ITEMS = [
  {
    value: "item-1",
    title: "첫 번째 섹션",
    content: "첫 번째 섹션의 내용입니다.",
  },
  {
    value: "item-2",
    title: "두 번째 섹션",
    content: "두 번째 섹션의 내용입니다.",
  },
  {
    value: "item-3",
    title: "세 번째 섹션",
    content: "세 번째 섹션의 내용입니다.",
  },
];

const ITEM_VALUES = PLAYGROUND_ITEMS.map((item) => item.value);
const NONE_VALUE = "__none__";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  accordionType: AccordionType,
  isCollapsible: boolean,
  openValues: string[],
  disabledValues: string[],
) {
  const isSingle = accordionType === "single";
  const initialValue = isSingle
    ? `"${openValues[0] ?? ""}"`
    : JSON.stringify(openValues);
  const collapsibleProp = isSingle && isCollapsible ? "\n  collapsible" : "";

  const items = PLAYGROUND_ITEMS.map((item) => {
    const disabledProp = disabledValues.includes(item.value) ? " disabled" : "";
    return `  <AccordionItem value="${item.value}"${disabledProp}>
    <AccordionTrigger>${item.title}</AccordionTrigger>
    <AccordionContent>${item.content}</AccordionContent>
  </AccordionItem>`;
  }).join("\n");

  return `const [value, setValue] = useState(${initialValue});

<Accordion
  type="${accordionType}"${collapsibleProp}
  value={value}
  onValueChange={setValue}
  className="w-full max-w-md"
>
${items}
</Accordion>`;
}

/** Accordion Playground (이 페이지에서만 사용) */
function AccordionPlayground() {
  const [accordionType, setAccordionType] = useState<AccordionType>("single");
  const [isCollapsible, setIsCollapsible] = useState(true);
  const [openValues, setOpenValues] = useState<string[]>([]);
  const [disabledValues, setDisabledValues] = useState<string[]>([]);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const isSingle = accordionType === "single";

  const handleChangeAccordionSingle = (nextValue: string) => {
    setOpenValues(nextValue ? [nextValue] : []);
    addEventLog("onValueChange", nextValue);
  };

  const handleChangeAccordionMultiple = (nextValue: string[]) => {
    setOpenValues(nextValue);
    addEventLog("onValueChange", nextValue);
  };

  const handleChangeType = (nextType: string) => {
    const typedValue = nextType as AccordionType;
    setAccordionType(typedValue);
    // single로 바꾸면 열린 항목은 하나만 남깁니다.
    if (typedValue === "single") {
      setOpenValues((prev) => prev.slice(0, 1));
    }
  };

  const handleChangeSingleValue = (nextValue: string) => {
    setOpenValues(nextValue === NONE_VALUE ? [] : [nextValue]);
  };

  const handleClickReset = () => {
    setAccordionType("single");
    setIsCollapsible(true);
    setOpenValues([]);
    setDisabledValues([]);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "type",
      type: '"single" | "multiple"',
      description: "하나만 열림 / 여러 개 동시에 열림",
      control: (
        <PlaygroundRadioControl
          label="type"
          value={accordionType}
          options={["single", "multiple"]}
          onValueChange={handleChangeType}
        />
      ),
    },
    {
      name: "collapsible",
      type: "boolean",
      description: '열린 항목을 다시 눌러 닫기 (type="single"에서만 적용)',
      control: (
        <PlaygroundSwitchControl
          label="collapsible"
          checked={isSingle && isCollapsible}
          onCheckedChange={setIsCollapsible}
          disabled={!isSingle}
        />
      ),
    },
    {
      name: "value",
      type: isSingle ? "string" : "string[]",
      description: "열린 항목 (onValueChange와 함께 제어형)",
      control: isSingle ? (
        <PlaygroundRadioControl
          label="value"
          value={openValues[0] ?? NONE_VALUE}
          options={[{ value: NONE_VALUE, label: "없음" }, ...ITEM_VALUES]}
          onValueChange={handleChangeSingleValue}
        />
      ) : (
        <PlaygroundCheckboxControl
          label="value"
          value={openValues}
          options={ITEM_VALUES}
          onValueChange={setOpenValues}
        />
      ),
    },
    {
      name: "AccordionItem disabled",
      type: "boolean",
      description: "열 수 없는 항목",
      control: (
        <PlaygroundCheckboxControl
          label="AccordionItem disabled"
          value={disabledValues}
          options={ITEM_VALUES}
          onValueChange={setDisabledValues}
        />
      ),
    },
  ];

  const accordionItems = PLAYGROUND_ITEMS.map((item) => (
    <AccordionItem
      key={item.value}
      value={item.value}
      disabled={disabledValues.includes(item.value)}
    >
      <AccordionTrigger>{item.title}</AccordionTrigger>
      <AccordionContent>{item.content}</AccordionContent>
    </AccordionItem>
  ));

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 항목을 눌러도 Controls의 value가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode(
        accordionType,
        isCollapsible,
        openValues,
        disabledValues,
      )}
      controls={controls}
      controlsNote="variant·size는 현재 스타일이 연결되어 있지 않아(docs/components/Accordion.md) Controls에 넣지 않았습니다."
      state={{
        type: accordionType,
        collapsible: isSingle ? isCollapsible : "(single에서만 적용)",
        value: isSingle ? (openValues[0] ?? "") : openValues,
        disabledItems: disabledValues,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      {isSingle ? (
        <Accordion
          type="single"
          collapsible={isCollapsible}
          value={openValues[0] ?? ""}
          onValueChange={handleChangeAccordionSingle}
          className="w-full max-w-md"
        >
          {accordionItems}
        </Accordion>
      ) : (
        <Accordion
          type="multiple"
          value={openValues}
          onValueChange={handleChangeAccordionMultiple}
          className="w-full max-w-md"
        >
          {accordionItems}
        </Accordion>
      )}
    </GuidePlayground>
  );
}

function SampleAccordionPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Accordion Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<AccordionPlayground />}>
          <GuideBox
            title="기본 Accordion"
            description="기본 Accordion 컴포넌트 사용 예시입니다."
            code={`
<Accordion type="single" collapsible className="w-full max-w-md">
  <AccordionItem value="item-1">
    <AccordionTrigger>첫 번째 섹션</AccordionTrigger>
    <AccordionContent>
      첫 번째 섹션의 내용입니다. 여기에 자세한 설명이나 콘텐츠를 추가할 수 있습니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>두 번째 섹션</AccordionTrigger>
    <AccordionContent>
      두 번째 섹션의 내용입니다. 여러 줄의 텍스트나 컴포넌트를 포함할 수 있습니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>세 번째 섹션</AccordionTrigger>
    <AccordionContent>
      세 번째 섹션의 내용입니다. 다양한 유형의 콘텐츠를 표시할 수 있습니다.
    </AccordionContent>
  </AccordionItem>
</Accordion>
            `}
          >
            <Accordion type="single" collapsible className="w-full max-w-md">
              <AccordionItem value="item-1">
                <AccordionTrigger>첫 번째 섹션</AccordionTrigger>
                <AccordionContent>
                  첫 번째 섹션의 내용입니다. 여기에 자세한 설명이나 콘텐츠를
                  추가할 수 있습니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>두 번째 섹션</AccordionTrigger>
                <AccordionContent>
                  두 번째 섹션의 내용입니다. 여러 줄의 텍스트나 컴포넌트를 포함할
                  수 있습니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>세 번째 섹션</AccordionTrigger>
                <AccordionContent>
                  세 번째 섹션의 내용입니다. 다양한 유형의 콘텐츠를 표시할 수
                  있습니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </GuideBox>

          <GuideBox
            title="여러 항목 확장 가능한 Accordion"
            description="type='multiple'을 사용하여 여러 항목을 동시에 확장할 수 있는 Accordion 예시입니다."
            code={`
<Accordion type="multiple" className="w-full max-w-md">
  <AccordionItem value="item-1">
    <AccordionTrigger>프로젝트 개요</AccordionTrigger>
    <AccordionContent>
      이 프로젝트는 React와 TypeScript를 사용하여 구축된 웹 애플리케이션입니다.
      주요 기능으로는 사용자 인증, 데이터 시각화, 실시간 업데이트 등이 포함됩니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>기술 스택</AccordionTrigger>
    <AccordionContent>
      • React 18<br />
      • TypeScript 5<br />
      • Tailwind CSS<br />
      • Radix UI<br />
      • Vite
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>설치 및 실행 방법</AccordionTrigger>
    <AccordionContent>
      1. 저장소 클론<br />
      2. npm install<br />
      3. npm run dev
    </AccordionContent>
  </AccordionItem>
</Accordion>
            `}
          >
            <Accordion type="multiple" className="w-full max-w-md">
              <AccordionItem value="item-1">
                <AccordionTrigger>프로젝트 개요</AccordionTrigger>
                <AccordionContent>
                  이 프로젝트는 React와 TypeScript를 사용하여 구축된 웹
                  애플리케이션입니다. 주요 기능으로는 사용자 인증, 데이터 시각화,
                  실시간 업데이트 등이 포함됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>기술 스택</AccordionTrigger>
                <AccordionContent>
                  • React 18
                  <br />
                  • TypeScript 5<br />
                  • Tailwind CSS
                  <br />
                  • Radix UI
                  <br />• Vite
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>설치 및 실행 방법</AccordionTrigger>
                <AccordionContent>
                  1. 저장소 클론
                  <br />
                  2. npm install
                  <br />
                  3. npm run dev
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </GuideBox>

          <GuideBox
            title="비활성화된 Accordion 항목"
            description="disabled 속성을 사용하여 특정 항목을 비활성화할 수 있습니다."
            code={`
<Accordion type="single" collapsible className="w-full max-w-md">
  <AccordionItem value="item-1" disabled>
    <AccordionTrigger>비활성화된 섹션</AccordionTrigger>
    <AccordionContent>
      이 섹션은 비활성화되어 있어 클릭할 수 없습니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>활성화된 섹션</AccordionTrigger>
    <AccordionContent>
      이 섹션은 정상적으로 작동합니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>다른 활성화된 섹션</AccordionTrigger>
    <AccordionContent>
      이 섹션도 정상적으로 작동합니다.
    </AccordionContent>
  </AccordionItem>
</Accordion>
            `}
          >
            <Accordion type="single" collapsible className="w-full max-w-md">
              <AccordionItem value="item-1" disabled>
                <AccordionTrigger>비활성화된 섹션</AccordionTrigger>
                <AccordionContent>
                  이 섹션은 비활성화되어 있어 클릭할 수 없습니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>활성화된 섹션</AccordionTrigger>
                <AccordionContent>
                  이 섹션은 정상적으로 작동합니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>다른 활성화된 섹션</AccordionTrigger>
                <AccordionContent>
                  이 섹션도 정상적으로 작동합니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </GuideBox>

          <GuideBox
            title="기본값이 열린 Accordion"
            description="defaultValue를 사용하여 특정 항목을 기본적으로 열린 상태로 설정할 수 있습니다."
            code={`
<Accordion type="single" defaultValue="item-2" collapsible className="w-full max-w-md">
  <AccordionItem value="item-1">
    <AccordionTrigger>첫 번째 섹션</AccordionTrigger>
    <AccordionContent>
      이 섹션은 기본적으로 닫혀 있습니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>두 번째 섹션 (기본 열림)</AccordionTrigger>
    <AccordionContent>
      이 섹션은 defaultValue로 인해 기본적으로 열려 있습니다.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>세 번째 섹션</AccordionTrigger>
    <AccordionContent>
      이 섹션도 기본적으로 닫혀 있습니다.
    </AccordionContent>
  </AccordionItem>
</Accordion>
            `}
          >
            <Accordion
              type="single"
              defaultValue="item-2"
              collapsible
              className="w-full max-w-md"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>첫 번째 섹션</AccordionTrigger>
                <AccordionContent>
                  이 섹션은 기본적으로 닫혀 있습니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>두 번째 섹션 (기본 열림)</AccordionTrigger>
                <AccordionContent>
                  이 섹션은 defaultValue로 인해 기본적으로 열려 있습니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>세 번째 섹션</AccordionTrigger>
                <AccordionContent>
                  이 섹션도 기본적으로 닫혀 있습니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </GuideBox>

          <GuideBox
            title="커스텀 스타일이 적용된 Accordion"
            description="className을 사용하여 커스텀 스타일을 적용한 Accordion 예시입니다."
            code={`
<div className="space-y-4">
  <div>
    <h3 className="text-sm font-medium mb-2">컴팩트 스타일</h3>
    <Accordion type="single" collapsible className="w-full max-w-md border-none">
      <AccordionItem value="item-1" className="border-b border-line02 last:border-b-0">
        <AccordionTrigger className="py-2 text-sm hover:no-underline">
          컴팩트 헤더
        </AccordionTrigger>
        <AccordionContent className="text-sm py-2">
          컴팩트한 스타일의 내용입니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-b border-line02 last:border-b-0">
        <AccordionTrigger className="py-2 text-sm hover:no-underline">
          또 다른 컴팩트 헤더
        </AccordionTrigger>
        <AccordionContent className="text-sm py-2">
          두 번째 컴팩트한 내용입니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>

  <div>
    <h3 className="text-sm font-medium mb-2">강조 스타일</h3>
    <Accordion type="single" collapsible className="w-full max-w-md bg-bg-box rounded-lg p-2">
      <AccordionItem value="item-1" className="bg-bg-base rounded-lg mb-2 last:mb-0">
        <AccordionTrigger className="px-4 py-3 hover:bg-bg-box rounded-lg">
          강조된 헤더
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-3">
          배경색이 강조된 내용 영역입니다.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="bg-bg-base rounded-lg mb-2 last:mb-0">
        <AccordionTrigger className="px-4 py-3 hover:bg-bg-box rounded-lg">
          두 번째 강조 헤더
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-3">
          두 번째 강조된 내용 영역입니다.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</div>
            `}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">컴팩트 스타일</h3>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full max-w-md border-none"
                >
                  <AccordionItem
                    value="item-1"
                    className="border-b border-line02 last:border-b-0"
                  >
                    <AccordionTrigger className="py-2 text-sm hover:no-underline">
                      컴팩트 헤더
                    </AccordionTrigger>
                    <AccordionContent className="text-sm py-2">
                      컴팩트한 스타일의 내용입니다.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-2"
                    className="border-b border-line02 last:border-b-0"
                  >
                    <AccordionTrigger className="py-2 text-sm hover:no-underline">
                      또 다른 컴팩트 헤더
                    </AccordionTrigger>
                    <AccordionContent className="text-sm py-2">
                      두 번째 컴팩트한 내용입니다.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">강조 스타일</h3>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full max-w-md bg-bg-box rounded-lg p-2"
                >
                  <AccordionItem
                    value="item-1"
                    className="bg-bg-base rounded-lg mb-2 last:mb-0"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-bg-box rounded-lg">
                      강조된 헤더
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      배경색이 강조된 내용 영역입니다.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="item-2"
                    className="bg-bg-base rounded-lg mb-2 last:mb-0"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-bg-box rounded-lg">
                      두 번째 강조 헤더
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      두 번째 강조된 내용 영역입니다.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleAccordionPage };
export default SampleAccordionPage;
