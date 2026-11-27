import { useState, type ReactNode } from "react";

import {
  ChartArea,
  ChartBar,
  ChartLine,
  ChartPie,
  ChartRadar,
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

const monthlyData = [
  { month: "Jan", sales: 120, revenue: 180 },
  { month: "Feb", sales: 98, revenue: 150 },
  { month: "Mar", sales: 140, revenue: 210 },
  { month: "Apr", sales: 110, revenue: 170 },
  { month: "May", sales: 170, revenue: 260 },
  { month: "Jun", sales: 155, revenue: 230 },
];

const pieData = [
  { name: "검색", value: 36 },
  { name: "광고", value: 24 },
  { name: "직접유입", value: 20 },
  { name: "소셜", value: 20 },
];

const radarData = [
  { subject: "성능", current: 84, target: 90 },
  { subject: "접근성", current: 72, target: 88 },
  { subject: "SEO", current: 80, target: 85 },
  { subject: "유지보수", current: 78, target: 87 },
  { subject: "테스트", current: 69, target: 82 },
];

type ChartKind = "line" | "area" | "bar" | "pie" | "radar";
type YDomainOption = "none" | "auto" | "fixed";

const CHART_KIND_OPTIONS = [
  { value: "line", label: "ChartLine" },
  { value: "area", label: "ChartArea" },
  { value: "bar", label: "ChartBar" },
  { value: "pie", label: "ChartPie" },
  { value: "radar", label: "ChartRadar" },
];

const CHART_COMPONENT_NAME: Record<ChartKind, string> = {
  line: "ChartLine",
  area: "ChartArea",
  bar: "ChartBar",
  pie: "ChartPie",
  radar: "ChartRadar",
};

/** 가로축 차트(Line·Area·Bar)에서 고를 수 있는 series (가이드에 쓰인 색) */
const XY_SERIES = [
  { dataKey: "sales", name: "Sales", color: "#00997a" },
  { dataKey: "revenue", name: "Revenue", color: "#2b7bd6" },
];

/** ChartRadar에서 고를 수 있는 series */
const RADAR_SERIES = [
  { dataKey: "current", name: "현재", color: "#00997a" },
  { dataKey: "target", name: "목표", color: "#2b7bd6" },
];

const Y_DOMAIN_OPTIONS = [
  { value: "none", label: "지정 안 함" },
  { value: "auto", label: '["auto", "auto"]' },
  { value: "fixed", label: "[0, 300]" },
];

const Y_DOMAIN_VALUE: Record<YDomainOption, [number, number] | ["auto", "auto"] | undefined> = {
  none: undefined,
  auto: ["auto", "auto"],
  fixed: [0, 300],
};

const Y_DOMAIN_CODE: Record<YDomainOption, string> = {
  none: "",
  auto: '\n  yDomain={["auto", "auto"]}',
  fixed: "\n  yDomain={[0, 300]}",
};

const DEFAULT_INNER_RADIUS = "0";

type ChartPlaygroundValues = {
  chartKind: ChartKind;
  xySeriesKeys: string[];
  radarSeriesKeys: string[];
  isGridShown: boolean;
  yDomainOption: YDomainOption;
  innerRadius: string;
};

function buildSeriesCode(
  seriesList: typeof XY_SERIES,
  selectedKeys: string[],
) {
  const items = seriesList
    .filter((item) => selectedKeys.includes(item.dataKey))
    .map(
      (item) =>
        `    { dataKey: "${item.dataKey}", name: "${item.name}", color: "${item.color}" },`,
    )
    .join("\n");
  return `  series={[\n${items}\n  ]}`;
}

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  chartKind,
  xySeriesKeys,
  radarSeriesKeys,
  isGridShown,
  yDomainOption,
  innerRadius,
}: ChartPlaygroundValues) {
  const componentName = CHART_COMPONENT_NAME[chartKind];

  if (chartKind === "pie") {
    const innerRadiusProp =
      innerRadius !== DEFAULT_INNER_RADIUS ? `, innerRadius: ${innerRadius}` : "";
    return `<ChartPie
  data={pieData}
  series={{ dataKey: "value", nameKey: "name"${innerRadiusProp} }}
/>`;
  }

  if (chartKind === "radar") {
    return `<ChartRadar
  data={radarData}
  angleKey="subject"
${buildSeriesCode(RADAR_SERIES, radarSeriesKeys)}
/>`;
  }

  const gridProp = isGridShown ? "" : "\n  showGrid={false}";
  const yDomainProp = chartKind === "bar" ? "" : Y_DOMAIN_CODE[yDomainOption];

  return `<${componentName}
  data={monthlyData}
  xKey="month"
${buildSeriesCode(XY_SERIES, xySeriesKeys)}${gridProp}${yDomainProp}
/>`;
}

/** Chart Playground (이 페이지에서만 사용) */
function ChartPlayground() {
  const [chartKind, setChartKind] = useState<ChartKind>("line");
  const [xySeriesKeys, setXySeriesKeys] = useState<string[]>(["sales", "revenue"]);
  const [radarSeriesKeys, setRadarSeriesKeys] = useState<string[]>(["current", "target"]);
  const [isGridShown, setIsGridShown] = useState(true);
  const [yDomainOption, setYDomainOption] = useState<YDomainOption>("none");
  const [innerRadius, setInnerRadius] = useState(DEFAULT_INNER_RADIUS);

  const isXyChart = chartKind === "line" || chartKind === "area" || chartKind === "bar";
  const isYDomainSupported = chartKind === "line" || chartKind === "area";
  const isPie = chartKind === "pie";
  const isRadar = chartKind === "radar";

  const xySeries = XY_SERIES.filter((item) => xySeriesKeys.includes(item.dataKey));
  const radarSeries = RADAR_SERIES.filter((item) =>
    radarSeriesKeys.includes(item.dataKey),
  );
  const yDomain = Y_DOMAIN_VALUE[yDomainOption];
  const innerRadiusNumber = Number(innerRadius) || undefined;

  // series는 하나 이상 남겨 둡니다 (모두 끄면 빈 차트가 됩니다).
  const handleChangeSeries = (nextKeys: string[]) => {
    if (nextKeys.length === 0) return;
    if (isRadar) {
      setRadarSeriesKeys(nextKeys);
    } else {
      setXySeriesKeys(nextKeys);
    }
  };

  const handleClickReset = () => {
    setChartKind("line");
    setXySeriesKeys(["sales", "revenue"]);
    setRadarSeriesKeys(["current", "target"]);
    setIsGridShown(true);
    setYDomainOption("none");
    setInnerRadius(DEFAULT_INNER_RADIUS);
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "차트 종류",
      type: "ChartLine | ChartArea | ChartBar | ChartPie | ChartRadar",
      description: "용도에 맞는 차트 컴포넌트",
      control: (
        <PlaygroundRadioControl
          label="차트 종류"
          value={chartKind}
          options={CHART_KIND_OPTIONS}
          onValueChange={(nextValue) => setChartKind(nextValue as ChartKind)}
        />
      ),
    },
    {
      name: "series",
      type: "ChartSeries[]",
      description: "그릴 값 목록 (하나 이상). ChartPie는 series가 객체 하나라 고를 수 없습니다",
      control: isPie ? (
        <span className="text-sm text-font-g">
          {'{ dataKey: "value", nameKey: "name" } (고정)'}
        </span>
      ) : (
        <PlaygroundCheckboxControl
          label="series"
          value={isRadar ? radarSeriesKeys : xySeriesKeys}
          options={(isRadar ? RADAR_SERIES : XY_SERIES).map((item) => ({
            value: item.dataKey,
            label: item.name,
          }))}
          onValueChange={handleChangeSeries}
        />
      ),
    },
    {
      name: "showGrid",
      type: "boolean",
      description: "배경 격자선 (ChartLine·ChartArea·ChartBar만)",
      control: (
        <PlaygroundSwitchControl
          label="showGrid"
          checked={isXyChart && isGridShown}
          onCheckedChange={setIsGridShown}
          disabled={!isXyChart}
        />
      ),
    },
    {
      name: "yDomain",
      type: '[number, number] | ["auto", "auto"]',
      description: "세로축 범위 (ChartLine·ChartArea만)",
      control: (
        <PlaygroundRadioControl
          label="yDomain"
          value={yDomainOption}
          options={Y_DOMAIN_OPTIONS}
          onValueChange={(nextValue) => setYDomainOption(nextValue as YDomainOption)}
          disabled={!isYDomainSupported}
        />
      ),
    },
    {
      name: "series.innerRadius",
      type: "number",
      description: "ChartPie 안쪽 반지름. 0보다 크면 도넛형 (ChartPie만)",
      control: (
        <PlaygroundRadioControl
          label="series.innerRadius"
          value={innerRadius}
          options={[
            { value: "0", label: "지정 안 함 (파이)" },
            { value: "60", label: "60 (도넛)" },
          ]}
          onValueChange={setInnerRadius}
          disabled={!isPie}
        />
      ),
    },
  ];

  let chart: ReactNode = null;
  if (chartKind === "line") {
    chart = (
      <ChartLine
        data={monthlyData}
        xKey="month"
        series={xySeries}
        showGrid={isGridShown}
        yDomain={yDomain}
      />
    );
  } else if (chartKind === "area") {
    chart = (
      <ChartArea
        data={monthlyData}
        xKey="month"
        series={xySeries}
        showGrid={isGridShown}
        yDomain={yDomain}
      />
    );
  } else if (chartKind === "bar") {
    chart = (
      <ChartBar
        data={monthlyData}
        xKey="month"
        series={xySeries}
        showGrid={isGridShown}
      />
    );
  } else if (chartKind === "pie") {
    chart = (
      <ChartPie
        data={pieData}
        series={{ dataKey: "value", nameKey: "name", innerRadius: innerRadiusNumber }}
      />
    );
  } else {
    chart = <ChartRadar data={radarData} angleKey="subject" series={radarSeries} />;
  }

  return (
    <GuidePlayground
      description="Controls에서 차트 종류와 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 차트 컴포넌트는 이벤트 Props가 없어 이벤트 로그는 표시하지 않습니다."
      code={buildPlaygroundCode({
        chartKind,
        xySeriesKeys,
        radarSeriesKeys,
        isGridShown,
        yDomainOption,
        innerRadius,
      })}
      controls={controls}
      controlsNote="height는 기본값(280, Radar 320)을 쓰도록 정해져 있고, showLegend는 끄지 않는 것이 규칙이며, series color·colors는 가이드에 쓰인 색만 쓰도록 되어 있어(docs/components/Chart.md) Controls에 넣지 않았습니다."
      state={{
        component: CHART_COMPONENT_NAME[chartKind],
        series: isPie
          ? { dataKey: "value", nameKey: "name", innerRadius: innerRadiusNumber ?? null }
          : (isRadar ? radarSeries : xySeries).map((item) => item.dataKey),
        showGrid: isXyChart ? isGridShown : "(적용 안 됨)",
        yDomain: isYDomainSupported ? (yDomain ?? null) : "(적용 안 됨)",
      }}
      onReset={handleClickReset}
    >
      <div className="w-full">{chart}</div>
    </GuidePlayground>
  );
}

function SampleChartPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Chart</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<ChartPlayground />}>
          <GuideBox
            title="Line Chart"
            description="시계열 추세를 선형으로 표시합니다."
            code={`
<ChartLine
  data={monthlyData}
  xKey="month"
  series={[
    { dataKey: "sales", name: "Sales", color: "#00997a" },
    { dataKey: "revenue", name: "Revenue", color: "#2b7bd6" },
  ]}
/>
          `}
          >
            <ChartLine
              data={monthlyData}
              xKey="month"
              series={[
                { dataKey: "sales", name: "Sales", color: "#00997a" },
                { dataKey: "revenue", name: "Revenue", color: "#2b7bd6" },
              ]}
            />
          </GuideBox>

          <GuideBox
            title="Area Chart"
            description="누적 느낌의 변화량을 면적으로 보여줍니다."
            code={`
<ChartArea
  data={monthlyData}
  xKey="month"
  series={[{ dataKey: "revenue", name: "Revenue", color: "#a63ac0" }]}
/>
          `}
          >
            <ChartArea
              data={monthlyData}
              xKey="month"
              series={[{ dataKey: "revenue", name: "Revenue", color: "#a63ac0" }]}
            />
          </GuideBox>

          <GuideBox
            title="Bar Chart"
            description="항목별 값을 막대로 비교할 때 사용합니다."
            code={`
<ChartBar
  data={monthlyData}
  xKey="month"
  series={[{ dataKey: "sales", name: "Sales", color: "#00997a" }]}
/>
          `}
          >
            <ChartBar
              data={monthlyData}
              xKey="month"
              series={[{ dataKey: "sales", name: "Sales", color: "#00997a" }]}
            />
          </GuideBox>

          <GuideBox
            title="Pie Chart"
            description="구성 비율을 한눈에 보여줍니다."
            code={`
<ChartPie data={pieData} series={{ dataKey: "value", nameKey: "name" }} />
          `}
          >
            <ChartPie data={pieData} series={{ dataKey: "value", nameKey: "name" }} />
          </GuideBox>

          <GuideBox
            title="Radar Chart"
            description="다중 지표를 방사형으로 비교할 때 사용합니다."
            code={`
<ChartRadar
  data={radarData}
  angleKey="subject"
  series={[
    { dataKey: "current", name: "현재", color: "#00997a" },
    { dataKey: "target", name: "목표", color: "#2b7bd6" },
  ]}
/>
          `}
          >
            <ChartRadar
              data={radarData}
              angleKey="subject"
              series={[
                { dataKey: "current", name: "현재", color: "#00997a" },
                { dataKey: "target", name: "목표", color: "#2b7bd6" },
              ]}
            />
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export default SampleChartPage;
