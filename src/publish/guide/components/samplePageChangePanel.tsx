import { PageChangePanel } from "@/components/ui";
import { useState } from "react";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";

const LAYOUT_OPTIONS = [
  { value: "default", label: "기본 레이아웃" },
  { value: "twoCol", label: "좌우 2분할" },
  { value: "twoCol2", label: "상하 2분할" },
  { value: "threeCol", label: "3분할" },
];

const THEME_OPTIONS = [
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
  { value: "system", label: "시스템" },
];

/** initialPos 선택지. 값은 Controls 라디오 value로 씁니다. */
const INITIAL_POS_PRESETS = {
  none: { label: "미지정 (가운데 상단)", pos: undefined },
  first: { label: "x 260 · y 160", pos: { x: 260, y: 160 } },
  second: { label: "x 260 · y 420", pos: { x: 260, y: 420 } },
} as const;

type InitialPosPreset = keyof typeof INITIAL_POS_PRESETS;
type SelectCount = "1" | "2";

const DEFAULT_INITIAL_POS_PRESET: InitialPosPreset = "first";

type PageChangePanelPlaygroundValues = {
  selectCount: SelectCount;
  layout: string;
  theme: string;
  initialPosPreset: InitialPosPreset;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  selectCount,
  layout,
  theme,
  initialPosPreset,
}: PageChangePanelPlaygroundValues) {
  const isTwoSelects = selectCount === "2";
  const { pos } = INITIAL_POS_PRESETS[initialPosPreset];
  const themeState = isTwoSelects
    ? `\nconst [theme, setTheme] = useState("${theme}");`
    : "";
  const themeSelect = isTwoSelects
    ? `
    {
      label: "테마",
      value: theme,
      onChange: setTheme,
      options: THEME_OPTIONS,
    },`
    : "";
  const initialPosProp = pos
    ? `\n  initialPos={{ x: ${pos.x}, y: ${pos.y} }}`
    : "";

  return `const [layout, setLayout] = useState("${layout}");${themeState}

<PageChangePanel
  selects={[
    {
      label: "레이아웃",
      value: layout,
      onChange: setLayout,
      options: LAYOUT_OPTIONS,
    },${themeSelect}
  ]}${initialPosProp}
/>`;
}

/** PageChangePanel Playground (이 페이지에서만 사용) */
function PageChangePanelPlayground() {
  const [selectCount, setSelectCount] = useState<SelectCount>("1");
  const [layout, setLayout] = useState("default");
  const [theme, setTheme] = useState("light");
  const [initialPosPreset, setInitialPosPreset] = useState<InitialPosPreset>(
    DEFAULT_INITIAL_POS_PRESET,
  );
  // initialPos는 처음 마운트할 때만 적용되므로, 바꾸거나 초기화할 때 key로 다시 마운트합니다.
  const [panelKey, setPanelKey] = useState(0);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const isTwoSelects = selectCount === "2";

  const handleChangeLayout = (nextValue: string) => {
    setLayout(nextValue);
    addEventLog("selects[0].onChange", nextValue);
  };

  const handleChangeTheme = (nextValue: string) => {
    setTheme(nextValue);
    addEventLog("selects[1].onChange", nextValue);
  };

  const handleChangeInitialPos = (nextPreset: string) => {
    setInitialPosPreset(nextPreset as InitialPosPreset);
    setPanelKey((prev) => prev + 1);
  };

  const handleClickReset = () => {
    setSelectCount("1");
    setLayout("default");
    setTheme("light");
    setInitialPosPreset(DEFAULT_INITIAL_POS_PRESET);
    setPanelKey((prev) => prev + 1);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "selects (개수)",
      type: "SelectConfig[]",
      description: "Select 묶음 수. 2개면 구분선으로 나뉩니다.",
      control: (
        <PlaygroundRadioControl
          label="selects 개수"
          value={selectCount}
          options={["1", "2"]}
          onValueChange={(next) => setSelectCount(next as SelectCount)}
        />
      ),
    },
    {
      name: "selects[0].value",
      type: "string",
      description: "레이아웃 Select 값 (onChange와 함께 제어형)",
      control: (
        <PlaygroundRadioControl
          label="selects[0].value"
          value={layout}
          options={LAYOUT_OPTIONS}
          onValueChange={setLayout}
        />
      ),
    },
    {
      name: "selects[1].value",
      type: "string",
      description: "테마 Select 값 (selects가 2개일 때만 적용)",
      control: (
        <PlaygroundRadioControl
          label="selects[1].value"
          value={theme}
          options={THEME_OPTIONS}
          onValueChange={setTheme}
          disabled={!isTwoSelects}
        />
      ),
    },
    {
      name: "initialPos",
      type: "{ x: number; y: number }",
      description:
        "처음 위치 (화면 기준 fixed). 바꾸면 패널을 다시 그려 위치가 적용됩니다. 드래그한 위치는 컴포넌트 내부 상태입니다.",
      control: (
        <PlaygroundRadioControl
          label="initialPos"
          value={initialPosPreset}
          options={Object.entries(INITIAL_POS_PRESETS).map(
            ([value, preset]) => ({ value, label: preset.label }),
          )}
          onValueChange={handleChangeInitialPos}
        />
      ),
    },
  ];

  const selects = [
    {
      label: "레이아웃",
      value: layout,
      onChange: handleChangeLayout,
      options: LAYOUT_OPTIONS,
    },
    ...(isTwoSelects
      ? [
          {
            label: "테마",
            value: theme,
            onChange: handleChangeTheme,
            options: THEME_OPTIONS,
          },
        ]
      : []),
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 패널은 화면에 고정(fixed)되어 떠 있으며, 패널의 Select를 바꾸면 Controls 값도 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode({
        selectCount,
        layout,
        theme,
        initialPosPreset,
      })}
      controls={controls}
      controlsNote="selects[].placeholder는 value가 항상 선택지 중 하나인 이 예시에서는 보이지 않아 Controls에 넣지 않았습니다. label·options는 예시 데이터로 고정했습니다."
      state={{
        selects: selects.map(({ label, value }) => ({ label, value })),
        initialPos: INITIAL_POS_PRESETS[initialPosPreset].pos ?? null,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <p className="text-sm text-font-g">
        패널은 화면 위에 떠 있습니다. 손잡이를 끌어 옮길 수 있습니다.
      </p>
      <PageChangePanel
        key={panelKey}
        selects={selects}
        initialPos={INITIAL_POS_PRESETS[initialPosPreset].pos}
      />
    </GuidePlayground>
  );
}

function SamplePageChangePanelPage() {
  const [layout, setLayout] = useState("default");
  const [layout2, setLayout2] = useState("default");
  const [theme, setTheme] = useState("light");

  return (
    <div className="guide-layout">
      <h1 className="guide-title">PageChangePanel Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<PageChangePanelPlayground />}>
          <GuideBox
            title="Select 1개"
            description="selects 배열에 항목 1개를 전달합니다. 패널을 드래그해서 자유롭게 이동할 수 있습니다."
            code={`
  const LAYOUT_OPTIONS = [
    { value: "default", label: "기본 레이아웃" },
    { value: "twoCol",  label: "좌우 2분할" },
    { value: "twoCol2", label: "상하 2분할" },
    { value: "threeCol",label: "3분할" },
  ];
  const [layout, setLayout] = useState("default");
  
  <PageChangePanel
    selects={[
      {
        label: "레이아웃",
        value: layout,
        onChange: setLayout,
        options: LAYOUT_OPTIONS,
      },
    ]}
  />        `}
          >
            <p className="text-sm text-slate-500">
              선택된 레이아웃:{" "}
              <strong className="text-slate-800">{layout}</strong>
            </p>
            <PageChangePanel
              selects={[
                {
                  label: "레이아웃",
                  value: layout,
                  onChange: setLayout,
                  options: LAYOUT_OPTIONS,
                },
              ]}
              initialPos={{ x: 260, y: 160 }}
            />
          </GuideBox>

          <GuideBox
            title="Select 2개 (별도 값·라벨·옵션)"
            description="selects 배열에 2개를 전달하면 구분선으로 나뉜 두 개의 Select가 렌더링됩니다."
            code={`
  <PageChangePanel
    selects={[
      {
        label: "레이아웃",
        value: layout,
        onChange: setLayout,
        options: LAYOUT_OPTIONS,
      },
      {
        label: "테마",
        value: theme,
        onChange: setTheme,
        options: THEME_OPTIONS,
      },
    ]}
  />
          `}
          >
            <p className="text-sm text-slate-500">
              레이아웃: <strong className="text-slate-800">{layout2}</strong>
              {"  /  "}
              테마: <strong className="text-slate-800">{theme}</strong>
            </p>
            <PageChangePanel
              selects={[
                {
                  label: "레이아웃",
                  value: layout2,
                  onChange: setLayout2,
                  options: LAYOUT_OPTIONS,
                },
                {
                  label: "테마",
                  value: theme,
                  onChange: setTheme,
                  options: THEME_OPTIONS,
                },
              ]}
              initialPos={{ x: 260, y: 420 }}
            />
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SamplePageChangePanelPage };
export default SamplePageChangePanelPage;
