import { Button, Portal, usePortalContainer } from "@/components/ui";
import { useEffect, useRef, useState } from "react";
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

const BODY_CONTAINER = "document.body";
const PLAYGROUND_TARGET_ID = "portal-playground-target";
const PLAYGROUND_TARGET_SELECTOR = `#${PLAYGROUND_TARGET_ID}`;
const DEFAULT_PORTAL_TEXT = "Portal로 렌더링된 콘텐츠입니다.";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  isEnabled: boolean,
  container: string,
  portalText: string,
) {
  const isBody = container === BODY_CONTAINER;
  const containerProp = isBody ? "" : ` container="${container}"`;
  const targetMarkup = isBody
    ? ""
    : `\n{/* Portal 대상: 화면에 미리 있어야 합니다 */}\n<div id="${PLAYGROUND_TARGET_ID}" />\n`;

  return `const [isEnabled, setIsEnabled] = useState(${isEnabled});
${targetMarkup}
<Portal${containerProp} enabled={isEnabled}>
  <div>
    <p>${portalText}</p>
    <Button size="sm" type="button" onClick={() => setIsEnabled(false)}>
      닫기
    </Button>
  </div>
</Portal>`;
}

/** Portal Playground (이 페이지에서만 사용) */
function PortalPlayground() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [container, setContainer] = useState(PLAYGROUND_TARGET_SELECTOR);
  const [portalText, setPortalText] = useState(DEFAULT_PORTAL_TEXT);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const isBody = container === BODY_CONTAINER;

  const handleClickToggle = () => {
    setIsEnabled((prev) => !prev);
    addEventLog("Button onClick", isEnabled ? "숨기기" : "보이기");
  };

  const handleClickClose = () => {
    setIsEnabled(false);
    addEventLog("Portal 안 Button onClick", "닫기");
  };

  const handleClickReset = () => {
    setIsEnabled(false);
    setContainer(PLAYGROUND_TARGET_SELECTOR);
    setPortalText(DEFAULT_PORTAL_TEXT);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "enabled",
      type: "boolean",
      description: "false이면 Portal을 렌더링하지 않습니다. (기본 true)",
      control: (
        <PlaygroundSwitchControl
          label="enabled"
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
        />
      ),
    },
    {
      name: "container",
      type: "string | Element | DocumentFragment | null",
      description:
        "마운트할 DOM. 생략하면 document.body, 셀렉터 문자열이면 해당 요소 안에 렌더링합니다.",
      control: (
        <PlaygroundRadioControl
          label="container"
          value={container}
          options={[
            { value: BODY_CONTAINER, label: "생략 (document.body)" },
            PLAYGROUND_TARGET_SELECTOR,
          ]}
          onValueChange={setContainer}
        />
      ),
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Portal로 옮겨 렌더링할 내용",
      control: (
        <PlaygroundTextControl
          label="children"
          value={portalText}
          onValueChange={setPortalText}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. document.body를 고르면 콘텐츠가 화면 오른쪽 아래에 고정으로 표시됩니다."
      code={buildPlaygroundCode(isEnabled, container, portalText)}
      controls={controls}
      controlsNote="Portal 자체에는 이벤트 Props가 없어, 이벤트 로그에는 미리보기 버튼의 onClick을 기록합니다. container에 DOM 노드를 직접 넘기는 방식은 Samples 탭의 usePortalContainer 예시를 참고하세요."
      state={{
        enabled: isEnabled,
        container: isBody ? "(생략) document.body" : container,
        children: portalText,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="flex w-full max-w-xl flex-col gap-4">
        <div>
          <Button variant="outline" type="button" onClick={handleClickToggle}>
            {isEnabled ? "숨기기" : "보이기"}
          </Button>
        </div>
        <div
          id={PLAYGROUND_TARGET_ID}
          className="min-h-24 rounded-lg border border-dashed p-4 text-sm text-font-g"
        >
          id="{PLAYGROUND_TARGET_ID}" 컨테이너
        </div>
        <Portal container={isBody ? undefined : container} enabled={isEnabled}>
          <div
            className={
              isBody
                ? "fixed right-6 bottom-6 z-50 flex flex-col gap-2 rounded-lg border bg-base p-4 text-font-b"
                : "mt-2 flex flex-col gap-2 rounded-lg border bg-base p-4 text-font-b"
            }
          >
            <p>{portalText}</p>
            <div>
              <Button size="sm" type="button" onClick={handleClickClose}>
                닫기
              </Button>
            </div>
          </div>
        </Portal>
      </div>
    </GuidePlayground>
  );
}

function SamplePortalPage() {
  const [showDefault, setShowDefault] = useState(false);
  const [showById, setShowById] = useState(false);
  const [showByClass, setShowByClass] = useState(false);
  const [showHook, setShowHook] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  const byClassContainerRef = useRef<HTMLDivElement>(null);

  /* usePortalContainer 훅: "hook-portal-root" id를 가진 div를 body에 자동 생성 */
  const hookContainer = usePortalContainer("hook-portal-root");

  /* class 셀렉터 데모용: 고유 클래스 부여 후 미리 마운트 */
  useEffect(() => {
    if (byClassContainerRef.current) {
      byClassContainerRef.current.classList.add("sample-portal-class-target");
    }
  }, []);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Portal Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<PortalPlayground />}>
        {/* ── 기본 (document.body) ── */}
        <GuideBox
          title="기본 사용 (document.body)"
          description="container를 지정하지 않으면 document.body에 렌더링됩니다."
          code={`
<Portal>
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)" }}>
    <p>document.body에 마운트된 포탈 콘텐츠</p>
    <button onClick={() => setShow(false)}>닫기</button>
  </div>
</Portal>
          `}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowDefault(true)}
            >
              기본 포탈 열기
            </Button>
            <Portal enabled={showDefault}>
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                }}
                onClick={() => setShowDefault(false)}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "2rem 3rem",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-font-b font-semibold mb-4">
                    document.body에 마운트된 포탈 콘텐츠입니다.
                  </p>
                  <Button onClick={() => setShowDefault(false)}>닫기</Button>
                </div>
              </div>
            </Portal>
          </div>
        </GuideBox>

        {/* ── #id 셀렉터 ── */}
        <GuideBox
          title="id 셀렉터 (#id)"
          description='container="#portal-target-id" 처럼 # 접두사로 id를 가진 요소를 지정합니다.'
          code={`
{/* HTML에 <div id="portal-target-id" /> 가 있어야 합니다 */}
<Portal container="#portal-target-id">
  <span>id 컨테이너 안에 렌더링됩니다</span>
</Portal>
          `}
        >
          <div className="flex flex-wrap items-start gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowById((v) => !v)}
            >
              {showById ? "숨기기" : "#id 포탈 보이기"}
            </Button>

            {/* 포탈 타깃 영역 */}
            <div
              id="portal-target-id"
              className="min-h-10 flex-1 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-3 text-sm text-blue-500"
            >
              ← id="portal-target-id" 컨테이너 (여기에 렌더링됩니다)
              <Portal container="#portal-target-id" enabled={showById}>
                <span className="ml-2 rounded bg-blue-500 px-2 py-0.5 text-xs text-white">
                  #id 포탈 콘텐츠 ✓
                </span>
              </Portal>
            </div>
          </div>
        </GuideBox>

        {/* ── .class 셀렉터 ── */}
        <GuideBox
          title="class 셀렉터 (.className)"
          description='container=".my-class" 처럼 . 접두사로 class를 가진 요소를 지정합니다.'
          code={`
{/* HTML에 <div class="portal-layer" /> 가 있어야 합니다 */}
<Portal container=".portal-layer">
  <span>class 컨테이너 안에 렌더링됩니다</span>
</Portal>
          `}
        >
          <div className="flex flex-wrap items-start gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowByClass((v) => !v)}
            >
              {showByClass ? "숨기기" : ".class 포탈 보이기"}
            </Button>

            {/* 포탈 타깃 영역 */}
            <div
              ref={byClassContainerRef}
              className="sample-portal-class-target min-h-10 flex-1 rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-3 text-sm text-green-600"
            >
              ← class="sample-portal-class-target" 컨테이너 (여기에
              렌더링됩니다)
              <Portal
                container=".sample-portal-class-target"
                enabled={showByClass}
              >
                <span className="ml-2 rounded bg-green-500 px-2 py-0.5 text-xs text-white">
                  .class 포탈 콘텐츠 ✓
                </span>
              </Portal>
            </div>
          </div>
        </GuideBox>

        {/* ── usePortalContainer 훅 ── */}
        <GuideBox
          title="usePortalContainer 훅"
          description="지정한 id의 컨테이너를 body에 자동 생성·제거합니다. 컴포넌트 언마운트 시 자동으로 정리됩니다."
          code={`
const container = usePortalContainer("my-portal-root");

<Portal container={container}>
  <div>동적으로 생성된 #my-portal-root 안에 렌더링됩니다</div>
</Portal>
          `}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowHook((v) => !v)}
            >
              {showHook ? "숨기기" : "훅 포탈 보이기"}
            </Button>
            <Portal container={hookContainer} enabled={showHook}>
              <div
                style={{
                  position: "fixed",
                  bottom: 24,
                  right: 24,
                  background: "#1e293b",
                  color: "#f1f5f9",
                  borderRadius: 10,
                  padding: "12px 20px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>#hook-portal-root 에 마운트된 토스트 메시지</span>
                <button
                  style={{ color: "#94a3b8", cursor: "pointer" }}
                  onClick={() => setShowHook(false)}
                >
                  ✕
                </button>
              </div>
            </Portal>
          </div>
        </GuideBox>

        {/* ── enabled 조건부 렌더링 ── */}
        <GuideBox
          title="enabled prop (조건부 렌더링)"
          description="enabled={false} 이면 Portal 자체가 렌더링되지 않습니다."
          code={`
const [isOpen, setIsOpen] = useState(false);

<Portal enabled={isOpen}>
  <div>isOpen이 true일 때만 포탈이 렌더링됩니다</div>
</Portal>
          `}
        >
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowDisabled((v) => !v)}
            >
              {showDisabled
                ? "비활성화 (enabled=false)"
                : "활성화 (enabled=true)"}
            </Button>
            <span className="text-sm text-font-g">
              현재 상태: enabled=
              <strong
                className={showDisabled ? "text-green-600" : "text-red-500"}
              >
                {String(showDisabled)}
              </strong>
            </span>
            <Portal enabled={showDisabled}>
              <div
                style={{
                  position: "fixed",
                  top: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#22c55e",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  zIndex: 9999,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                enabled=true — 포탈이 렌더링 중입니다
              </div>
            </Portal>
          </div>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SamplePortalPage };
export default SamplePortalPage;
