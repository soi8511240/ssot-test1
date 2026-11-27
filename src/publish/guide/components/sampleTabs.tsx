import {
  Icon,
  Tabs,
  TabsContent,
  TabsList,
  TabsScrollSpyPanel,
  TabsTrigger,
  useTabActive,
} from "@/components/ui";
import { useRef, useState } from "react";
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

type TabsVariant = "default" | "btn";
type TabsSize = "default" | "sm";
type TabsOrientation = "horizontal" | "vertical";
type TabsActivationMode = "automatic" | "manual";

const PLAYGROUND_TABS = [
  { value: "tab1", label: "Tab 1", content: "Tab 1 내용입니다." },
  { value: "tab2", label: "Tab 2", content: "Tab 2 내용입니다." },
  { value: "tab3", label: "Tab 3", content: "Tab 3 내용입니다." },
];

const TAB_VALUES = PLAYGROUND_TABS.map((tab) => tab.value);

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildTabsPlaygroundCode({
  variant,
  size,
  isLineType,
  orientation,
  activationMode,
  activeValue,
  disabledValues,
}: {
  variant: TabsVariant;
  size: TabsSize;
  isLineType: boolean;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
  activeValue: string;
  disabledValues: string[];
}) {
  const isDefaultVariant = variant === "default";
  const props = [
    "value={value}",
    "onValueChange={setValue}",
    variant !== "default" ? `variant="${variant}"` : "",
    isDefaultVariant && size === "sm" ? 'size="sm"' : "",
    isDefaultVariant && isLineType ? 'type="line"' : "",
    orientation !== "horizontal" ? `orientation="${orientation}"` : "",
    activationMode !== "automatic" ? `activationMode="${activationMode}"` : "",
    'className="gap-4"',
  ]
    .filter(Boolean)
    .map((prop) => `  ${prop}`)
    .join("\n");

  const triggers = PLAYGROUND_TABS.map((tab) => {
    const disabledProp = disabledValues.includes(tab.value) ? " disabled" : "";
    return `    <TabsTrigger value="${tab.value}"${disabledProp}>${tab.label}</TabsTrigger>`;
  }).join("\n");

  const contents = PLAYGROUND_TABS.map(
    (tab) =>
      `  <TabsContent value="${tab.value}">${tab.content}</TabsContent>`,
  ).join("\n");

  return `const [value, setValue] = useState("${activeValue}");

<Tabs
${props}
>
  <TabsList>
${triggers}
  </TabsList>
${contents}
</Tabs>`;
}

/** Tabs Playground (이 페이지에서만 사용) */
function TabsPlayground() {
  const [variant, setVariant] = useState<TabsVariant>("default");
  const [size, setSize] = useState<TabsSize>("default");
  const [isLineType, setIsLineType] = useState(false);
  const [orientation, setOrientation] =
    useState<TabsOrientation>("horizontal");
  const [activationMode, setActivationMode] =
    useState<TabsActivationMode>("automatic");
  const [activeValue, setActiveValue] = useState("tab1");
  const [disabledValues, setDisabledValues] = useState<string[]>([]);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const isDefaultVariant = variant === "default";

  const handleChangeTabsValue = (nextValue: string) => {
    setActiveValue(nextValue);
    addEventLog("onValueChange", nextValue);
  };

  const handleClickReset = () => {
    setVariant("default");
    setSize("default");
    setIsLineType(false);
    setOrientation("horizontal");
    setActivationMode("automatic");
    setActiveValue("tab1");
    setDisabledValues([]);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "variant",
      type: '"default" | "btn"',
      description: "밑줄형 / 버튼형 탭",
      control: (
        <PlaygroundRadioControl
          label="variant"
          value={variant}
          options={["default", "btn"]}
          onValueChange={(next) => setVariant(next as TabsVariant)}
        />
      ),
    },
    {
      name: "size",
      type: '"sm"',
      description: '작은 글자 크기 (variant="default"에서만 적용)',
      control: (
        <PlaygroundRadioControl
          label="size"
          value={size}
          options={[{ value: "default", label: "기본" }, "sm"]}
          onValueChange={(next) => setSize(next as TabsSize)}
          disabled={!isDefaultVariant}
        />
      ),
    },
    {
      name: "type",
      type: '"line"',
      description: '탭 목록 아래 전체 구분선 (variant="default"에서만 적용)',
      control: (
        <PlaygroundSwitchControl
          label="type line"
          checked={isDefaultVariant && isLineType}
          onCheckedChange={setIsLineType}
          disabled={!isDefaultVariant}
        />
      ),
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      description: "탭 목록 방향 (세로면 목록이 왼쪽, 내용이 오른쪽)",
      control: (
        <PlaygroundRadioControl
          label="orientation"
          value={orientation}
          options={["horizontal", "vertical"]}
          onValueChange={(next) => setOrientation(next as TabsOrientation)}
        />
      ),
    },
    {
      name: "activationMode",
      type: '"automatic" | "manual"',
      description:
        "키보드 화살표로 이동할 때 바로 선택(automatic) / Enter·Space로 선택(manual)",
      control: (
        <PlaygroundRadioControl
          label="activationMode"
          value={activationMode}
          options={["automatic", "manual"]}
          onValueChange={(next) =>
            setActivationMode(next as TabsActivationMode)
          }
        />
      ),
    },
    {
      name: "value",
      type: "string",
      description: "선택된 탭 (onValueChange와 함께 제어형)",
      control: (
        <PlaygroundRadioControl
          label="value"
          value={activeValue}
          options={TAB_VALUES}
          onValueChange={setActiveValue}
        />
      ),
    },
    {
      name: "TabsTrigger disabled",
      type: "boolean",
      description: "선택할 수 없는 탭",
      control: (
        <PlaygroundCheckboxControl
          label="TabsTrigger disabled"
          value={disabledValues}
          options={TAB_VALUES}
          onValueChange={setDisabledValues}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 탭을 눌러도 Controls의 value가 함께 바뀝니다(제어형)."
      code={buildTabsPlaygroundCode({
        variant,
        size,
        isLineType,
        orientation,
        activationMode,
        activeValue,
        disabledValues,
      })}
      controls={controls}
      controlsNote='scrollSpy는 스크롤 컨테이너(ref)와 TabsScrollSpyPanel 구성이 필요해 Controls에 넣지 않았습니다(Samples 탭 참고). size="default"는 연결된 스타일이 없어 "기본"(생략)으로 표시합니다.'
      state={{
        variant,
        size: isDefaultVariant && size === "sm" ? "sm" : "(기본)",
        type: isDefaultVariant && isLineType ? "line" : "(없음)",
        orientation,
        activationMode,
        value: activeValue,
        disabledTabs: disabledValues,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <Tabs
        value={activeValue}
        onValueChange={handleChangeTabsValue}
        variant={variant}
        size={isDefaultVariant && size === "sm" ? "sm" : undefined}
        type={isDefaultVariant && isLineType ? "line" : undefined}
        orientation={orientation}
        activationMode={activationMode}
        className="gap-4"
      >
        <TabsList>
          {PLAYGROUND_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={disabledValues.includes(tab.value)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {PLAYGROUND_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="rounded-md bg-base p-4">{tab.content}</div>
          </TabsContent>
        ))}
      </Tabs>
    </GuidePlayground>
  );
}

/** scrollSpy 샘플용 섹션 id (TabsTrigger value / TabsScrollSpyPanel panelId와 동일) */
const SCROLL_SPY_DEMO_IDS = [
  "tabs-sample-spy-a",
  "tabs-sample-spy-b",
  "tabs-sample-spy-c",
] as const;

function ActiveAwareCard({ label }: { label: string }) {
  const isActive = useTabActive();
  return (
    <div
      className="rounded-md p-4 transition-all"
      style={{
        background: isActive
          ? "var(--color-primary, #3b82f6)"
          : "var(--color-base, #f1f5f9)",
        color: isActive ? "#fff" : "inherit",
      }}
    >
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className="text-xs opacity-75">
        isActive: <code>{String(isActive)}</code>
      </div>
    </div>
  );
}

/** 가이드 페이지 내 데모: 스크롤 컨테이너 + scrollSpy 연동 예시 */
function ScrollSpyTabsDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="border-line02 bg-base max-h-[min(420px,55vh)] overflow-y-auto rounded-lg border p-3 pt-0"
    >
      <Tabs
        scrollSpy={{
          scrollContainerRef: scrollRef,
          sectionIds: SCROLL_SPY_DEMO_IDS,
          scrollOffsetPx: 56,
          activeLineRatio: 0.22,
        }}
        variant="default"
        size="sm"
      >
        <TabsList className="bg-base sticky top-0 z-[1] px-1 pt-3">
          <TabsTrigger value={SCROLL_SPY_DEMO_IDS[0]}>
            <span>섹션 A</span>
          </TabsTrigger>
          <TabsTrigger value={SCROLL_SPY_DEMO_IDS[1]}>
            <span>섹션 B</span>
          </TabsTrigger>
          <TabsTrigger value={SCROLL_SPY_DEMO_IDS[2]}>
            <span>섹션 C</span>
          </TabsTrigger>
        </TabsList>

        {SCROLL_SPY_DEMO_IDS.map((id, i) => (
          <TabsScrollSpyPanel
            key={id}
            value={id}
            panelId={id}
            className="scroll-mt-14 border-line02 bg-container/40 mb-6 rounded-md border p-4 last:mb-0"
          >
            <p className="text-font-b text-sm font-semibold">
              스크롤 스파이 패널 {i + 1}
            </p>
            <p className="text-font-b/85 mt-2 text-sm leading-relaxed">
              <code className="text-font-b">TabsContent</code>와 달리 비활성
              탭도 DOM에 남습니다. 아래로 스크롤하면 활성 탭이 바뀌고, 탭을
              누르면 이 박스만 스크롤됩니다.
            </p>
            <div className="bg-line01/60 mt-4 h-28 rounded-md" aria-hidden />
          </TabsScrollSpyPanel>
        ))}
      </Tabs>
    </div>
  );
}

function SampleTabsPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Tabs Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<TabsPlayground />}>
          <GuideBox
            title="Horizontal · variant: default"
            description="가장 기본적인 가로 탭 구성입니다."
            code={`
  <Tabs defaultValue="tab1">
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Tab 1 내용</TabsContent>
  </Tabs>
          `}
          >
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="rounded-md bg-base">
                  Horizontal / default · Tab 1 내용
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="rounded-md bg-base">
                  Horizontal / default · Tab 2 내용
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="rounded-md bg-base">
                  Horizontal / default · Tab 3 내용
                </div>
              </TabsContent>
            </Tabs>
          </GuideBox>

          <GuideBox
            title="Horizontal · variant: default · size: sm · type: line"
            description="line 타입과 작은 사이즈를 함께 적용한 가로 탭 예시입니다."
            code={`
  <Tabs defaultValue="tab1" size="sm" type="line">
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
    </TabsList>
  </Tabs>
          `}
          >
            <Tabs defaultValue="tab1" size="sm" type="line">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="rounded-md bg-base">
                  Horizontal / default · Tab 1 내용
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="rounded-md bg-base">
                  Horizontal / default · Tab 2 내용
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="rounded-md bg-base">
                  Horizontal / default · Tab 3 내용
                </div>
              </TabsContent>
            </Tabs>
          </GuideBox>

          <GuideBox
            title="Horizontal · variant: btn"
            description="아이콘과 카운트를 포함한 버튼형 탭 메뉴 샘플입니다."
            code={`
  <Tabs defaultValue="tab1" variant="btn">
    <TabsList>
      <TabsTrigger value="tab1">
        <Icon name="waiting-on" className="icon" />
        <span className="text">Tab 1</span>
        <span className="value">88</span>
      </TabsTrigger>
    </TabsList>
  </Tabs>
          `}
          >
            <Tabs defaultValue="tab1" variant="btn">
              <TabsList>
                <TabsTrigger value="tab1">
                  <Icon name="waiting-on" className="icon" />
                  <span className="text">Tab 1</span>
                  <span className="value">88</span>
                </TabsTrigger>
                <TabsTrigger value="tab2">
                  <Icon name="identification-on" className="icon" />
                  <span className="text">Tab 2</span>
                  <span className="value">88</span>
                </TabsTrigger>
                <TabsTrigger value="tab3">
                  <Icon name="calculator-on" className="icon" />
                  <span className="text">Tab 3</span>
                  <span className="value">88</span>
                </TabsTrigger>
                <TabsTrigger value="tab4">
                  <Icon name="check-mark" className="icon" />
                  <span className="text">Tab 4</span>
                  <span className="value">88</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="rounded-md bg-base">
                  Horizontal / btn · Tab 1 내용
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="rounded-md bg-base">
                  Horizontal / btn · Tab 2 내용
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="rounded-md bg-base">
                  Horizontal / btn · Tab 3 내용
                </div>
              </TabsContent>
            </Tabs>
          </GuideBox>

          <GuideBox
            title="Vertical · variant: default"
            description="세로 방향으로 배치한 기본 탭 사용 예시입니다."
            code={`
  <Tabs
    defaultValue="tab1"
    orientation="vertical"
    className="flex-row gap-6"
  >
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
  </Tabs>
          `}
          >
            <Tabs
              defaultValue="tab1"
              orientation="vertical"
              className="flex-row gap-6"
            >
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="rounded-md bg-base w-64">
                  Vertical / default · Tab 1 내용
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="rounded-md bg-base w-64">
                  Vertical / default · Tab 2 내용
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="rounded-md bg-base w-64">
                  Vertical / default · Tab 3 내용
                </div>
              </TabsContent>
            </Tabs>
          </GuideBox>

          <GuideBox
            title="Vertical · variant: btn"
            description="세로 방향과 버튼형 variant를 함께 적용한 구성입니다."
            code={`
  <Tabs
    defaultValue="tab1"
    orientation="vertical"
    className="flex-row gap-6"
    variant="btn"
  >
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
  </Tabs>
          `}
          >
            <Tabs
              defaultValue="tab1"
              orientation="vertical"
              className="flex-row gap-6"
              variant="btn"
            >
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="rounded-md bg-base w-64">
                  Vertical / btn · Tab 1 내용
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="rounded-md bg-base w-64">
                  Vertical / btn · Tab 2 내용
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="rounded-md bg-base w-64">
                  Vertical / btn · Tab 3 내용
                </div>
              </TabsContent>
            </Tabs>
          </GuideBox>
          <GuideBox
            title="scrollSpy · TabsScrollSpyPanel (긴 페이지 / 앵커 네비)"
            description={
              <>
                <strong>TabsContent</strong>는 활성 탭 하나만 보이게 전환합니다.{" "}
                <strong>scrollSpy</strong> 옵션과{" "}
                <strong>TabsScrollSpyPanel</strong>을 쓰면 패널을 모두 펼쳐 두고,
                지정한 스크롤 컨테이너 안에서만 스크롤합니다. 스크롤 위치에 맞춰
                활성 탭이 바뀌고, 탭 클릭 시{" "}
                <code className="text-font-b">scrollIntoView</code> 대신 컨테이너
                <code className="text-font-b"> scrollTo</code>로 해당 섹션으로
                이동해 레이아웃이 흔들리지 않습니다.{" "}
                <code className="text-font-b">useScrollSpy</code>는 Tabs 내부에
                포함되어 있습니다. 자세한 예는{" "}
                <code className="text-font-b">/guide/page-scroll-spy</code>, Hooks
                샘플을 참고하세요.
              </>
            }
            code={`
const scrollRef = useRef<HTMLDivElement>(null);
const sectionIds = ["a", "b", "c"] as const;

<div ref={scrollRef} className="max-h-[420px] overflow-y-auto">
  <Tabs
    scrollSpy={{
      scrollContainerRef: scrollRef,
      sectionIds,
      scrollOffsetPx: 56,
      activeLineRatio: 0.22,
    }}
    variant="default"
    size="sm"
  >
    <TabsList className="sticky top-0 bg-base">
      <TabsTrigger value="a"><span>A</span></TabsTrigger>
      <TabsTrigger value="b"><span>B</span></TabsTrigger>
      <TabsTrigger value="c"><span>C</span></TabsTrigger>
    </TabsList>

    <TabsScrollSpyPanel value="a" panelId="a" className="scroll-mt-14 ...">
      패널 A (항상 DOM에 존재)
    </TabsScrollSpyPanel>
    <TabsScrollSpyPanel value="b" panelId="b" className="scroll-mt-14 ...">
      패널 B
    </TabsScrollSpyPanel>
    <TabsScrollSpyPanel value="c" panelId="c" className="scroll-mt-14 ...">
      패널 C
    </TabsScrollSpyPanel>
  </Tabs>
</div>
          `}
          >
            <ScrollSpyTabsDemo />
          </GuideBox>

          <GuideBox
            title="useTabActive 훅"
            description="TabsContent 내부 컴포넌트에서 useTabActive()를 호출하면 해당 탭이 현재 활성화됐는지 boolean으로 알 수 있습니다."
            code={`
function ActiveAwareCard({ label }: { label: string }) {
  const isActive = useTabActive();
  return (
    <div style={{ background: isActive ? "blue" : "gray" }}>
      {label} — isActive: {String(isActive)}
    </div>
  );
}

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <ActiveAwareCard label="Tab 1 카드" />
  </TabsContent>
  <TabsContent value="tab2">
    <ActiveAwareCard label="Tab 2 카드" />
  </TabsContent>
  <TabsContent value="tab3">
    <ActiveAwareCard label="Tab 3 카드" />
  </TabsContent>
</Tabs>
          `}
          >
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <ActiveAwareCard label="Tab 1 카드" />
              </TabsContent>
              <TabsContent value="tab2">
                <ActiveAwareCard label="Tab 2 카드" />
              </TabsContent>
              <TabsContent value="tab3">
                <ActiveAwareCard label="Tab 3 카드" />
              </TabsContent>
            </Tabs>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleTabsPage };
export default SampleTabsPage;
