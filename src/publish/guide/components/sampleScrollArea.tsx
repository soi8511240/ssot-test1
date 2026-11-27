import { useState } from "react";

import { ScrollArea, ScrollBar } from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  PlaygroundSwitchControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";

type ScrollAreaType = "auto" | "always" | "scroll" | "hover";

const SCROLL_AREA_TYPES: ScrollAreaType[] = ["hover", "auto", "always", "scroll"];
const DEFAULT_TYPE: ScrollAreaType = "hover";
const DEFAULT_SCROLL_HIDE_DELAY = "600";
const DEFAULT_ITEM_COUNT = "20";
const MAX_ITEM_COUNT = 100;

const loremItems = [
  "사용자 인증 및 권한 관리 시스템",
  "대시보드 데이터 시각화 모듈",
  "실시간 알림 및 메시지 처리",
  "파일 업로드 및 다운로드 기능",
  "검색 필터 및 정렬 옵션",
  "보고서 생성 및 내보내기",
  "멀티 언어 지원 (i18n)",
  "접근성(Accessibility) 준수 UI",
  "반응형 레이아웃 및 모바일 최적화",
  "API 연동 및 에러 핸들링",
  "캐시 관리 및 성능 최적화",
  "로그 분석 및 모니터링 도구",
  "배치 처리 및 스케줄러",
  "보안 감사 및 취약점 점검",
  "CI/CD 파이프라인 구성",
  "테스트 자동화 및 커버리지 관리",
  "문서화 및 API 스펙 관리",
  "클라우드 인프라 설정",
  "데이터베이스 마이그레이션 도구",
  "팀 협업 및 코드 리뷰 프로세스",
];

const loremText = `스크롤 영역(Scroll Area)은 콘텐츠가 컨테이너 크기를 초과할 때 사용자가 내용을 탐색할 수 있도록 돕는 핵심 UI 요소입니다.
Radix UI ScrollArea를 기반으로 구현되었으며, 커스텀 스크롤바 스타일링을 통해 브라우저 기본 스크롤바와 다른 일관된 디자인을 제공합니다.
수직 및 수평 스크롤 모두 지원하며, 컨테이너에 고정 높이 또는 너비를 지정하면 자동으로 스크롤이 활성화됩니다.
내부 콘텐츠가 컨테이너 범위를 넘어설 때만 스크롤바가 나타나도록 설계되어, 공간을 효율적으로 활용할 수 있습니다.
접근성 측면에서도 키보드 탐색 및 포커스 관리를 지원하여 다양한 환경에서 원활하게 동작합니다.
이 컴포넌트는 긴 목록, 긴 텍스트 블록, 데이터 테이블, 사이드바, 코드 블록 등 다양한 맥락에서 활용할 수 있습니다.`;

const LONG_ROW_SUFFIX = loremText.split("\n")[0];

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  scrollType: ScrollAreaType,
  scrollHideDelay: string,
  hasHorizontalBar: boolean,
  itemCount: number,
) {
  const isDelayUsed = scrollType === "scroll" || scrollType === "hover";
  const typeProp = scrollType !== DEFAULT_TYPE ? ` type="${scrollType}"` : "";
  const delayProp =
    isDelayUsed &&
    scrollHideDelay !== DEFAULT_SCROLL_HIDE_DELAY &&
    scrollHideDelay !== ""
      ? ` scrollHideDelay={${Number(scrollHideDelay)}}`
      : "";
  const innerClass = hasHorizontalBar ? "w-max p-4" : "p-4";
  const rowClass = hasHorizontalBar
    ? "whitespace-nowrap border-b py-2 text-sm last:border-0"
    : "border-b py-2 text-sm last:border-0";
  const rowText = hasHorizontalBar ? "{item} · {longText}" : "{item}";
  const horizontalBar = hasHorizontalBar
    ? '\n  <ScrollBar orientation="horizontal" />'
    : "";

  return `// items: 항목 ${itemCount}개
<ScrollArea${typeProp}${delayProp} className="h-64 w-full max-w-md rounded-lg border bg-base">
  <div className="${innerClass}">
    {items.map((item) => (
      <div key={item} className="${rowClass}">
        ${rowText}
      </div>
    ))}
  </div>${horizontalBar}
</ScrollArea>`;
}

/** ScrollArea Playground (이 페이지에서만 사용) */
function ScrollAreaPlayground() {
  const [scrollType, setScrollType] = useState<ScrollAreaType>(DEFAULT_TYPE);
  const [scrollHideDelay, setScrollHideDelay] = useState(
    DEFAULT_SCROLL_HIDE_DELAY,
  );
  const [hasHorizontalBar, setHasHorizontalBar] = useState(false);
  const [itemCountText, setItemCountText] = useState(DEFAULT_ITEM_COUNT);

  const isDelayUsed = scrollType === "scroll" || scrollType === "hover";
  const itemCount = Math.min(
    Math.max(Number(itemCountText) || 0, 0),
    MAX_ITEM_COUNT,
  );
  const scrollHideDelayNumber = Number(scrollHideDelay) || 0;
  const items = Array.from(
    { length: itemCount },
    (_, index) =>
      `${String(index + 1).padStart(2, "0")} ${loremItems[index % loremItems.length]}`,
  );

  const handleClickReset = () => {
    setScrollType(DEFAULT_TYPE);
    setScrollHideDelay(DEFAULT_SCROLL_HIDE_DELAY);
    setHasHorizontalBar(false);
    setItemCountText(DEFAULT_ITEM_COUNT);
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "type",
      type: '"hover" | "auto" | "always" | "scroll"',
      description:
        "스크롤바 표시 방식. hover: 마우스를 올렸을 때, auto: 넘칠 때 항상, always: 항상, scroll: 스크롤하는 동안",
      control: (
        <PlaygroundRadioControl
          label="type"
          value={scrollType}
          options={SCROLL_AREA_TYPES}
          onValueChange={(next) => setScrollType(next as ScrollAreaType)}
        />
      ),
    },
    {
      name: "scrollHideDelay",
      type: "number",
      description:
        '스크롤바가 사라지기까지 시간(ms). type="hover"·"scroll"에서만 적용, 기본 600',
      control: (
        <PlaygroundTextControl
          label="scrollHideDelay"
          type="number"
          value={scrollHideDelay}
          onValueChange={setScrollHideDelay}
          disabled={!isDelayUsed}
        />
      ),
    },
    {
      name: 'ScrollBar orientation="horizontal"',
      type: "boolean",
      description:
        "가로 스크롤바 추가 (세로 스크롤바는 ScrollArea에 기본 포함). 미리보기 행을 한 줄로 길게 바꿉니다.",
      control: (
        <PlaygroundSwitchControl
          label="horizontal ScrollBar"
          checked={hasHorizontalBar}
          onCheckedChange={setHasHorizontalBar}
        />
      ),
    },
    {
      name: "children (항목 수)",
      type: "number",
      description: `미리보기 목록 항목 수 (목업, 최대 ${MAX_ITEM_COUNT}). 영역보다 적으면 스크롤바가 생기지 않습니다.`,
      control: (
        <PlaygroundTextControl
          label="항목 수"
          type="number"
          value={itemCountText}
          onValueChange={setItemCountText}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      code={buildPlaygroundCode(
        scrollType,
        scrollHideDelay,
        hasHorizontalBar,
        itemCount,
      )}
      controls={controls}
      controlsNote="ScrollArea는 value·open 같은 상태나 이벤트 Props가 없어 이벤트 로그를 두지 않았습니다. dir(rtl)은 이 프로젝트에서 쓰지 않아 넣지 않았습니다."
      state={{
        type: scrollType,
        scrollHideDelay: isDelayUsed
          ? scrollHideDelayNumber
          : '(type="hover"·"scroll"에서만 적용)',
        horizontalScrollBar: hasHorizontalBar,
        itemCount,
      }}
      onReset={handleClickReset}
    >
      <ScrollArea
        type={scrollType}
        scrollHideDelay={scrollHideDelayNumber}
        className="h-64 w-full max-w-md rounded-lg border bg-base"
      >
        <div className={hasHorizontalBar ? "w-max p-4" : "p-4"}>
          {items.map((item) => (
            <div
              key={item}
              className={
                hasHorizontalBar
                  ? "whitespace-nowrap border-b py-2 text-sm text-font-b last:border-0"
                  : "border-b py-2 text-sm text-font-b last:border-0"
              }
            >
              {hasHorizontalBar ? `${item} · ${LONG_ROW_SUFFIX}` : item}
            </div>
          ))}
        </div>
        {hasHorizontalBar ? <ScrollBar orientation="horizontal" /> : null}
      </ScrollArea>
    </GuidePlayground>
  );
}

function SampleScrollAreaPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">ScrollArea Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<ScrollAreaPlayground />}>
        {/* 수직 스크롤 */}
        <GuideBox
          title="Vertical Scroll"
          description="컨테이너 높이를 초과하는 목록에 수직 스크롤을 적용합니다."
          code={`
  <ScrollArea className="h-64 rounded-lg border bg-base">
    <div className="p-4">
      {items.map((item, index) => (
        <div key={index} className="border-b  py-2 text-sm last:border-0">
          {item}
        </div>
      ))}
    </div>
  </ScrollArea>
          `}
        >
          <ScrollArea className="h-64 rounded-lg border bg-base">
            <div className="p-4">
              {loremItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b  py-2.5 text-sm text-slate-700 last:border-0"
                >
                  <span className="mr-2 text-xs text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </ScrollArea>
        </GuideBox>

        {/* 수평 스크롤 */}
        <GuideBox
          title="Horizontal Scroll"
          description="컨테이너 너비를 초과하는 콘텐츠에 수평 스크롤을 적용합니다."
          code={`
  <ScrollArea className="w-full rounded-lg border bg-base">
    <div className="flex gap-4 p-4" style={{ width:"max-content" }}>
      {cards.map((card) => (
        <div key={card} className="w-40 shrink-0 rounded-lg border p-4">
          {card}
        </div>
      ))}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
          `}
        >
          <ScrollArea className="w-full rounded-lg border bg-base">
            <div className="flex gap-4 p-4" style={{ width: "max-content" }}>
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="flex h-24 w-40 shrink-0 flex-col items-center justify-center rounded-lg border  bg-box p-4"
                >
                  <div className="text-xs font-medium text-slate-500">카드</div>
                  <div className="mt-1 text-lg font-semibold text-slate-800">
                    #{i + 1}
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </GuideBox>

        {/* 긴 텍스트 */}
        <GuideBox
          title="Text Content"
          description="긴 텍스트 블록을 고정 높이 영역 안에서 스크롤하여 확인합니다."
          code={`
  <ScrollArea className="h-40 rounded-lg border bg-base">
    <p className="p-4 text-sm leading-7 text-font-g whitespace-pre-line">
      {longText}
    </p>
  </ScrollArea>
          `}
        >
          <ScrollArea className="h-40 rounded-lg border bg-base">
            <p className="whitespace-pre-line p-4 text-sm leading-7 text-font-g">
              {loremText}
            </p>
          </ScrollArea>
        </GuideBox>

        {/* 수직 + 수평 동시 스크롤 */}
        <GuideBox
          title="Both Directions"
          description="수직, 수평 스크롤을 모두 사용하는 넓은 콘텐츠 영역 예시입니다."
          code={`
  <ScrollArea className="h-52 w-full rounded-lg border">
    <div className="p-4" style={{ width:"1400px" }}>
      {rows.map((row, i) => (
        <div key={i} className="flex gap-4 border-b  py-2 last:border-0">
          {cols.map((col, j) => (
            <div key={j} className="w-36 shrink-0 text-sm">{col}</div>
          ))}
        </div>
      ))}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
          `}
        >
          <ScrollArea className="h-52 w-full rounded-lg border bg-base">
            <div className="p-4" style={{ width: "1400px" }}>
              <div className="mb-2 flex gap-4 border-b  pb-2">
                {["번호", "이름", "부서", "직급", "이메일", "상태"].map(
                  (col) => (
                    <div
                      key={col}
                      className="w-32 shrink-0 text-xs font-semibold text-slate-500"
                    >
                      {col}
                    </div>
                  ),
                )}
              </div>
              {Array.from({ length: 15 }, (_, i) => (
                <div
                  key={i}
                  className="flex gap-4 border-b  py-2 last:border-0"
                >
                  <div className="w-32 shrink-0 text-sm text-font-g">
                    {String(i + 1).padStart(3, "0")}
                  </div>
                  <div className="w-32 shrink-0 text-sm text-slate-800">
                    홍길동 {i + 1}
                  </div>
                  <div className="w-32 shrink-0 text-sm text-font-g">
                    {
                      ["개발팀", "기획팀", "디자인팀", "QA팀", "인프라팀"][
                        i % 5
                      ]
                    }
                  </div>
                  <div className="w-32 shrink-0 text-sm text-font-g">
                    {["사원", "대리", "과장", "차장", "부장"][i % 5]}
                  </div>
                  <div className="w-32 shrink-0 text-sm text-slate-500">
                    user{i + 1}@company.com
                  </div>
                  <div className="w-32 shrink-0">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        i % 3 === 0
                          ? "bg-green-100 text-green-700"
                          : i % 3 === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-font-g"
                      }`}
                    >
                      {i % 3 === 0 ? "활성" : i % 3 === 1 ? "대기" : "비활성"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleScrollAreaPage };
export default SampleScrollAreaPage;
