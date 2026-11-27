import { useState } from "react";

import { TextList } from "@/components/ui";
import type { TextListMarkerType, TextListSize } from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";

const MARKER_TYPES: TextListMarkerType[] = [
  "dot",
  "star",
  "square",
  "decimal",
  "circled",
];
const DEFAULT_GAP = "__default__";
const DEFAULT_START = "1";
const DEFAULT_ITEMS_TEXT = "첫 항목, 둘째 항목, 셋째 항목";

/** 쉼표로 구분한 글자를 항목 배열로 바꿉니다. */
function parseItemsText(itemsText: string) {
  return itemsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildTextListPlaygroundCode({
  markerType,
  size,
  gap,
  start,
  items,
}: {
  markerType: TextListMarkerType;
  size: TextListSize;
  gap: string;
  start: string;
  items: string[];
}) {
  const isNumbered = markerType === "decimal" || markerType === "circled";
  const props = [
    markerType !== "dot" ? `type="${markerType}"` : "",
    size !== "md" ? `size="${size}"` : "",
    gap !== DEFAULT_GAP ? `gap={${gap}}` : "",
    isNumbered && start !== DEFAULT_START ? `start={${start}}` : "",
    `items={${JSON.stringify(items)}}`,
  ]
    .filter(Boolean)
    .map((prop) => `  ${prop}`)
    .join("\n");

  return `<TextList
${props}
/>`;
}

/** TextList Playground (이 페이지에서만 사용) */
function TextListPlayground() {
  const [markerType, setMarkerType] = useState<TextListMarkerType>("dot");
  const [size, setSize] = useState<TextListSize>("md");
  const [gap, setGap] = useState(DEFAULT_GAP);
  const [start, setStart] = useState(DEFAULT_START);
  const [itemsText, setItemsText] = useState(DEFAULT_ITEMS_TEXT);

  const items = parseItemsText(itemsText);
  const isNumbered = markerType === "decimal" || markerType === "circled";

  const handleClickReset = () => {
    setMarkerType("dot");
    setSize("md");
    setGap(DEFAULT_GAP);
    setStart(DEFAULT_START);
    setItemsText(DEFAULT_ITEMS_TEXT);
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "type",
      type: MARKER_TYPES.map((item) => `"${item}"`).join(" | "),
      description: "기본 마커 모양 (markerType과 같은 역할, type 권장)",
      control: (
        <PlaygroundRadioControl
          label="type"
          value={markerType}
          options={MARKER_TYPES}
          onValueChange={(next) => setMarkerType(next as TextListMarkerType)}
        />
      ),
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      description: "글자·마커 크기",
      control: (
        <PlaygroundRadioControl
          label="size"
          value={size}
          options={["sm", "md", "lg"]}
          onValueChange={(next) => setSize(next as TextListSize)}
        />
      ),
    },
    {
      name: "gap",
      type: "number | string",
      description: "항목 사이 세로 간격(px). 생략하면 0.5rem(8px)",
      control: (
        <PlaygroundRadioControl
          label="gap"
          value={gap}
          options={[{ value: DEFAULT_GAP, label: "생략" }, "4", "12", "16"]}
          onValueChange={setGap}
        />
      ),
    },
    {
      name: "start",
      type: "number",
      description: '시작 번호 (type="decimal" · "circled"에서만 적용)',
      control: (
        <PlaygroundRadioControl
          label="start"
          value={start}
          options={["1", "3", "10"]}
          onValueChange={setStart}
          disabled={!isNumbered}
        />
      ),
    },
    {
      name: "items",
      type: "TextListItem[]",
      description: "항목 목록 (여기서는 쉼표로 구분해 입력)",
      control: (
        <PlaygroundTextControl
          label="items"
          value={itemsText}
          onValueChange={setItemsText}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      code={buildTextListPlaygroundCode({
        markerType,
        size,
        gap,
        start,
        items,
      })}
      controls={controls}
      controlsNote="항목별 마커 덮어쓰기(items[] 객체의 type·marker·number)와 TextList.Item 합성은 Samples 탭에서 확인하세요. TextList는 사용자 조작 이벤트가 없어 이벤트 로그를 표시하지 않습니다."
      state={{
        type: markerType,
        size,
        gap: gap === DEFAULT_GAP ? "(생략: 8px)" : Number(gap),
        start: isNumbered ? Number(start) : "(decimal·circled에서만 적용)",
        items,
      }}
      onReset={handleClickReset}
    >
      <div className="w-full max-w-md">
        <TextList
          type={markerType}
          size={size}
          gap={gap === DEFAULT_GAP ? undefined : Number(gap)}
          start={Number(start)}
          items={items}
        />
      </div>
    </GuidePlayground>
  );
}

function SampleTextListPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">TextList</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<TextListPlayground />}>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            마커(•, ★, ■, 1.2.3., ①…) 타입을 `type`/`items[]` 조합으로 바꾸면서,
            `size`, `gap`, `start`까지 한 번에 제어할 수 있는 리스트
            컴포넌트입니다.
          </p>
          <GuideBox
            title="기본 · size / gap / start"
            description="dot(기본) + sm/lg 비교, decimal 시작 번호 변경 예시입니다."
            code={`
<TextList
  type="dot"
  size="sm"
  gap={12}
  start={1}
  items={["첫 항목", "둘째 항목"]}
/>

<TextList
  type="decimal"
  size="md"
  gap={8}
  start={3}
  items={["세 번째부터 시작", "다음 항목"]}
/>
          `}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-line01 bg-base p-4">
                <div className="mb-3 text-sm font-semibold text-font-b">
                  dot · sm · gap=12
                </div>
                <TextList
                  type="dot"
                  size="sm"
                  gap={12}
                  start={1}
                  items={["첫 항목", "둘째 항목", "셋째 항목"]}
                />
              </div>

              <div className="rounded-lg border border-line01 bg-base p-4">
                <div className="mb-3 text-sm font-semibold text-font-b">
                  decimal · start=3
                </div>
                <TextList
                  type="decimal"
                  size="md"
                  gap={8}
                  start={3}
                  items={["세 번째부터 시작", "다음 항목", "마지막 항목"]}
                />
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="circled(①②…) · item 복합 패턴"
            description="항목 객체를 섞어서, 리스트 내부에서 마커 타입을 다르게 적용할 수 있습니다."
            code={`
<TextList
  type="dot"
  size="md"
  gap={10}
  items={[
    "기본 dot 항목",
    { content: "decimal 항목", type: "decimal" },
    { content: "circled 항목", type: "circled" },
    { content: "커스텀 마커", marker: "→" },
  ]}
/>
          `}
          >
            <TextList
              type="dot"
              size="md"
              gap={10}
              items={[
                "기본 dot 항목",
                { content: "decimal 항목", type: "decimal" },
                { content: "circled 항목", type: "circled" },
                { content: "커스텀 마커", marker: "→" },
              ]}
            />
          </GuideBox>

          <GuideBox
            title="합성 패턴 케이스 (기본+문자열+override+marker)"
            description="리스트 전체 기본 `type`이 있어도, 특정 항목은 `items[]` 객체로 override하고, `marker`가 있으면 타입 계산을 무시합니다. 또한 `number`로 decimal/circled 표시 숫자를 강제할 수 있습니다."
            code={`
<TextList
  type="circled"
  size="md"
  gap={10}
  start={1}
  items={[
    "기본 circled(문자열 항목)",
    { content: "decimal로 override (number 강제)", type: "decimal", number: 4 },
    "문자열 항목은 기본 type 유지",
    { content: "marker 직접 지정(타입 무시)", marker: "◆" },
    { content: "square override", type: "square" },
    { content: <span>ReactNode 항목</span>, markerType: "star" },
  ]}
/>
          `}
          >
            <TextList
              type="circled"
              size="md"
              gap={10}
              start={1}
              items={[
                "기본 circled(문자열 항목)",
                {
                  content: "decimal로 override (number 강제)",
                  type: "decimal",
                  number: 4,
                },
                "문자열 항목은 기본 type 유지",
                { content: "marker 직접 지정(타입 무시)", marker: "◆" },
                { content: "square override", type: "square" },
                { content: <span>ReactNode 항목</span>, markerType: "star" },
              ]}
            />
          </GuideBox>

          <GuideBox
            title="JSX 합성 패턴: TextList.Item"
            description="배열 대신 `TextList.Item`을 중첩하는 형태입니다. 각 Item에 `type/marker/number`를 붙여 항목별로 마커를 제어할 수 있습니다."
            code={`
<TextList type="circled" size="md" gap={10} start={1}>
  <TextList.Item>기본 circled</TextList.Item>
  <TextList.Item type="decimal" number={4}>
    decimal override (number=4)
  </TextList.Item>
  <TextList.Item marker="◆">marker 직접 지정</TextList.Item>
  <TextList.Item type="square">square override</TextList.Item>
  <TextList.Item markerType="star">
    <span>ReactNode 항목</span>
  </TextList.Item>
</TextList>
          `}
          >
            <TextList type="circled" size="md" gap={10} start={1}>
              <TextList.Item>기본 circled</TextList.Item>
              <TextList.Item type="decimal" number={4}>
                decimal override (number=4)
              </TextList.Item>
              <TextList.Item marker="◆">marker 직접 지정</TextList.Item>
              <TextList.Item type="square">square override</TextList.Item>
              <TextList.Item markerType="star">
                <span>ReactNode 항목</span>
              </TextList.Item>
            </TextList>
          </GuideBox>

          <GuideBox
            title="star / square · lg"
            description="대형 마커를 사용해 리스트의 시각적 구분을 강화합니다."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-line01 bg-base p-4">
                <div className="mb-3 text-sm font-semibold text-font-b">
                  star · lg
                </div>
                <TextList
                  type="star"
                  size="lg"
                  gap={10}
                  items={["중요 1", "중요 2", "중요 3"]}
                />
              </div>
              <div className="rounded-lg border border-line01 bg-base p-4">
                <div className="mb-3 text-sm font-semibold text-font-b">
                  square · lg
                </div>
                <TextList
                  type="square"
                  size="lg"
                  gap={10}
                  items={["항목 A", "항목 B", "항목 C"]}
                />
              </div>
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleTextListPage };
export default SampleTextListPage;
