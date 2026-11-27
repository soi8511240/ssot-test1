import { Pagination } from "@/components/ui";
import { useState } from "react";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundSwitchControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";

/** Pagination 컴포넌트의 max 기본값 */
const DEFAULT_PAGINATION_MAX = 10;
/** ellipsis=true일 때 첫·마지막 페이지와 가운데 1개를 보여 주려면 max가 3 이상이어야 합니다. */
const MIN_ELLIPSIS_MAX = 3;
/** 버튼이 지나치게 많이 그려지지 않도록 Playground의 total 상한을 둡니다. */
const MAX_PLAYGROUND_TOTAL = 200;

const PLAYGROUND_INITIAL = {
  total: "20",
  current: "5",
  max: "5",
  isEllipsis: false,
};

/** 입력 문자열을 min 이상 정수로 바꿉니다. 숫자가 아니면 fallback을 씁니다. */
function toPositiveInt(text: string, fallback: number, min = 1) {
  const parsed = Math.floor(Number(text));
  return Number.isFinite(parsed) && text !== "" ? Math.max(min, parsed) : fallback;
}

type PaginationPlaygroundValues = {
  total: number;
  current: number;
  max: number;
  isEllipsis: boolean;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  total,
  current,
  max,
  isEllipsis,
}: PaginationPlaygroundValues) {
  const maxProp = max === DEFAULT_PAGINATION_MAX ? "" : `\n  max={${max}}`;
  const ellipsisProp = isEllipsis ? "\n  ellipsis" : "";

  return `const [page, setPage] = useState(${current});

<Pagination
  total={${total}}
  current={page}${maxProp}${ellipsisProp}
  onPageChange={setPage}
/>`;
}

/** Pagination Playground (이 페이지에서만 사용) */
function PaginationPlayground() {
  const [totalText, setTotalText] = useState(PLAYGROUND_INITIAL.total);
  const [currentText, setCurrentText] = useState(PLAYGROUND_INITIAL.current);
  const [maxText, setMaxText] = useState(PLAYGROUND_INITIAL.max);
  const [isEllipsis, setIsEllipsis] = useState(PLAYGROUND_INITIAL.isEllipsis);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  // 입력 중 빈 값·범위 밖 값이 있어도 미리보기가 깨지지 않도록 보정한 값을 씁니다.
  const total = Math.min(MAX_PLAYGROUND_TOTAL, toPositiveInt(totalText, 1));
  const current = Math.min(total, toPositiveInt(currentText, 1));
  const max = toPositiveInt(
    maxText,
    DEFAULT_PAGINATION_MAX,
    isEllipsis ? MIN_ELLIPSIS_MAX : 1,
  );

  const handleChangePage = (nextPage: number) => {
    setCurrentText(String(nextPage));
    addEventLog("onPageChange", nextPage);
  };

  const handleClickReset = () => {
    setTotalText(PLAYGROUND_INITIAL.total);
    setCurrentText(PLAYGROUND_INITIAL.current);
    setMaxText(PLAYGROUND_INITIAL.max);
    setIsEllipsis(PLAYGROUND_INITIAL.isEllipsis);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "total",
      type: "number",
      description: `전체 페이지 수 (Playground에서는 1 ~ ${MAX_PLAYGROUND_TOTAL}로 보정)`,
      control: (
        <PlaygroundTextControl
          label="total"
          type="number"
          value={totalText}
          onValueChange={setTotalText}
        />
      ),
    },
    {
      name: "current",
      type: "number",
      description:
        "현재 페이지 (onPageChange와 함께 제어형, 1 ~ total 범위로 보정)",
      control: (
        <PlaygroundTextControl
          label="current"
          type="number"
          value={currentText}
          onValueChange={setCurrentText}
        />
      ),
    },
    {
      name: "max",
      type: "number",
      description: `표시할 페이지 번호 수이자 << / >> 이동 거리 (기본값 ${DEFAULT_PAGINATION_MAX}). ellipsis일 때 ${MIN_ELLIPSIS_MAX} 이상으로 보정`,
      control: (
        <PlaygroundTextControl
          label="max"
          type="number"
          value={maxText}
          onValueChange={setMaxText}
        />
      ),
    },
    {
      name: "ellipsis",
      type: "boolean",
      description: "첫·마지막 페이지를 고정하고 사이를 줄임표(…)로 표시",
      control: (
        <PlaygroundSwitchControl
          label="ellipsis"
          checked={isEllipsis}
          onCheckedChange={setIsEllipsis}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 페이지를 눌러도 Controls의 current가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode({ total, current, max, isEllipsis })}
      controls={controls}
      controlsNote="getHref는 실제 주소(href)로 이동하는 링크를 만들어 가이드 화면을 벗어날 수 있어 Controls에 넣지 않았습니다(Samples 탭 'getHref' 예시 참고). className은 배치용이라 넣지 않았습니다."
      state={{ total, current, max, ellipsis: isEllipsis }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-sm text-font-g">
          현재 페이지:{" "}
          <span className="font-semibold text-font-b">{current}</span> /{" "}
          {total}
        </p>
        <Pagination
          total={total}
          current={current}
          max={max}
          ellipsis={isEllipsis}
          onPageChange={handleChangePage}
        />
      </div>
    </GuidePlayground>
  );
}

function SamplePaginationPage() {
  // 1. Basic
  const [page1, setPage1] = useState(1);
  // 2. ellipsis on / off
  const [page2, setPage2] = useState(5);
  // 3. max – 점프 거리
  const [page3, setPage3] = useState(5);
  // 4. ellipsis + max 비교
  const [page4, setPage4] = useState(5);
  // 5. 경계 위치 (각 행 독립 상태)
  const [page5a, setPage5a] = useState(2);
  const [page5b, setPage5b] = useState(5);
  const [page5c, setPage5c] = useState(9);
  // 6. Controlled – ellipsis 토글
  const [page6, setPage6] = useState(5);
  const [ellipsis6, setEllipsis6] = useState(false);
  // 7. Jump – total=50
  const [page7, setPage7] = useState(1);
  // 8. getHref
  const [page8, setPage8] = useState(5);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Pagination Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<PaginationPlayground />}>
          {/* 1. Basic */}
          <GuideBox
            title="Basic"
            description="total / current / onPageChange 만으로 렌더링합니다. ellipsis=false(기본), max=10(기본)이며 << >> 는 항상 표시됩니다."
            code={`
  <Pagination total={10} current={page} onPageChange={setPage} />
          `}
          >
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-font-g">
                현재 페이지:{" "}
                <span className="font-semibold text-font-b">{page1}</span> / 10
              </p>
              <Pagination total={10} current={page1} onPageChange={setPage1} />
            </div>
          </GuideBox>

          {/* 2. ellipsis on / off */}
          <GuideBox
            title="ellipsis on / off"
            description="ellipsis=true 시 max 기준으로 페이지를 그룹화하고 줄임표를 표시합니다. false(기본)는 max 개수만큼 표시합니다."
            code={`
  // ellipsis on: max 기준 그룹 + 줄임표
  <Pagination total={10} current={page} ellipsis max={5} onPageChange={setPage} />
  
  // ellipsis off (기본값): max 개수만큼 표시
  <Pagination total={10} current={page} max={5} onPageChange={setPage} />
          `}
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm text-font-g text-center">
                현재 페이지:{" "}
                <span className="font-semibold text-font-b">{page2}</span> / 10
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-font-g">
                    ellipsis=true, max=5
                  </span>
                  <Pagination
                    total={10}
                    current={page2}
                    ellipsis
                    max={5}
                    onPageChange={setPage2}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-font-g">
                    ellipsis=false (기본), max=5
                  </span>
                  <Pagination
                    total={10}
                    current={page2}
                    max={5}
                    onPageChange={setPage2}
                  />
                </div>
              </div>
            </div>
          </GuideBox>

          {/* 3. max – 점프 거리 */}
          <GuideBox
            title="max – 점프 거리 (ellipsis 무관)"
            description="max는 ellipsis on/off 모두에서 << / >> 점프 거리로 사용됩니다."
            code={`
  // ellipsis=false, max=3 → << >> 3페이지 이동
  <Pagination total={10} current={page} max={3} onPageChange={setPage} />
  
  // ellipsis=false, max=5 → << >> 5페이지 이동
  <Pagination total={10} current={page} max={5} onPageChange={setPage} />
  
  // ellipsis=true, max=5 → 그룹화 + << >> 5페이지 이동
  <Pagination total={10} current={page} ellipsis max={5} onPageChange={setPage} />
          `}
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm text-font-g text-center">
                현재 페이지:{" "}
                <span className="font-semibold text-font-b">{page3}</span> / 10
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-font-g">
                    ellipsis=false, max=3 (점프 3)
                  </span>
                  <Pagination
                    total={10}
                    current={page3}
                    max={3}
                    onPageChange={setPage3}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-font-g">
                    ellipsis=false, max=5 (점프 5)
                  </span>
                  <Pagination
                    total={10}
                    current={page3}
                    max={5}
                    onPageChange={setPage3}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-font-g">
                    ellipsis=true, max=5 (그룹화 + 점프 5)
                  </span>
                  <Pagination
                    total={10}
                    current={page3}
                    ellipsis
                    max={5}
                    onPageChange={setPage3}
                  />
                </div>
              </div>
            </div>
          </GuideBox>

          {/* 4. ellipsis + max 크기 비교 */}
          <GuideBox
            title="ellipsis + max 비교"
            description="ellipsis=true 일 때 max 값에 따라 표시되는 페이지 번호 버튼 수와 점프 거리가 함께 달라집니다."
            code={`
  <Pagination total={10} current={page} ellipsis max={3} onPageChange={setPage} />
  <Pagination total={10} current={page} ellipsis max={5} onPageChange={setPage} />
  <Pagination total={10} current={page} ellipsis max={7} onPageChange={setPage} />
          `}
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm text-font-g text-center">
                현재 페이지:{" "}
                <span className="font-semibold text-font-b">{page4}</span> / 10
              </p>
              <div className="flex flex-col gap-4">
                {([3, 5, 7] as const).map((m) => (
                  <div key={m} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-font-g">
                      max={m}
                    </span>
                    <Pagination
                      total={10}
                      current={page4}
                      ellipsis
                      max={m}
                      onPageChange={setPage4}
                    />
                  </div>
                ))}
              </div>
            </div>
          </GuideBox>

          {/* 5. 경계 위치 */}
          <GuideBox
            title="경계 위치 (ellipsis=true, max=5, total=10)"
            description="현재 페이지가 앞·중간·끝에 위치할 때 ellipsis 위치 변화를 확인합니다. 각 행은 독립적으로 동작합니다."
            code={`
  <Pagination total={10} current={page} ellipsis max={5} onPageChange={setPage} />
          `}
          >
            <div className="flex flex-col gap-4">
              {(
                [
                  { label: "시작 근처", page: page5a, setPage: setPage5a },
                  { label: "중간", page: page5b, setPage: setPage5b },
                  { label: "끝 근처", page: page5c, setPage: setPage5c },
                ] as const
              ).map(({ label, page, setPage }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-font-g">
                    {label} (current={page})
                  </span>
                  <Pagination
                    total={10}
                    current={page}
                    ellipsis
                    max={5}
                    onPageChange={setPage}
                  />
                </div>
              ))}
            </div>
          </GuideBox>

          {/* 6. Controlled – ellipsis 토글 */}
          <GuideBox
            title="Controlled – ellipsis 토글"
            description="버튼으로 ellipsis를 켜고 끄며 페이지를 이동하는 예시입니다. max=5는 양쪽 모두 점프 거리로 동작합니다."
            code={`
  const [page, setPage] = useState(5);
  const [showEllipsis, setShowEllipsis] = useState(false);
  
  <Pagination
    total={10}
    current={page}
    max={5}
    ellipsis={showEllipsis}
    onPageChange={setPage}
  />
          `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm text-font-g">
                  현재 페이지:{" "}
                  <span className="font-semibold text-font-b">{page6}</span> / 10
                </p>
                <button
                  type="button"
                  className="rounded border border-line02 px-3 py-1 text-xs text-font-g transition-colors hover:bg-box"
                  onClick={() => setEllipsis6((v) => !v)}
                >
                  ellipsis: {ellipsis6 ? "ON" : "OFF"}
                </button>
              </div>
              <Pagination
                total={10}
                current={page6}
                max={5}
                ellipsis={ellipsis6}
                onPageChange={setPage6}
              />
            </div>
          </GuideBox>

          {/* 7. Jump – total=50 */}
          <GuideBox
            title="Jump – max 단위 이동 (total=50)"
            description="<< / >> 버튼은 max 크기만큼 이동합니다. ellipsis on/off 모두 동일하게 동작합니다."
            code={`
  // ellipsis=true + max=5: 그룹화 및 << >> 5페이지 이동
  <Pagination total={50} current={page} ellipsis max={5} onPageChange={setPage} />
  
  // ellipsis=false + max=5: max 개수 표시, << >> 5페이지 이동
  <Pagination total={50} current={page} max={5} onPageChange={setPage} />
          `}
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm text-font-g text-center">
                현재 페이지:{" "}
                <span className="font-semibold text-font-b">{page7}</span> / 50
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-font-g">
                    ellipsis=true, max=5 (그룹화 + 점프 5)
                  </span>
                  <Pagination
                    total={50}
                    current={page7}
                    ellipsis
                    max={5}
                    onPageChange={setPage7}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-font-g">
                    ellipsis=false, max=5 (5개 표시 + 점프 5)
                  </span>
                  <Pagination
                    total={50}
                    current={page7}
                    max={5}
                    onPageChange={setPage7}
                  />
                </div>
              </div>
            </div>
          </GuideBox>

          {/* 8. getHref – URL 기반 */}
          <GuideBox
            title="getHref – URL 기반 페이지네이션"
            description="getHref prop으로 각 페이지에 실제 href를 생성하는 예시입니다."
            code={`
  <Pagination
    total={10}
    current={page}
    getHref={(page) => \`?page=\${page}\`}
    onPageChange={setPage}
  />
          `}
          >
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-font-g">
                현재 페이지:{" "}
                <span className="font-semibold text-font-b">{page8}</span> / 10
              </p>
              <Pagination
                total={10}
                current={page8}
                getHref={(page) => `?page=${page}`}
                onPageChange={setPage8}
              />
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SamplePaginationPage };
export default SamplePaginationPage;
