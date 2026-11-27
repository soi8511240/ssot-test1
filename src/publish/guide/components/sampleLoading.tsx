import * as React from "react";

import { Button, Loading } from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  PlaygroundSwitchControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";

type LoadingSize = "sm" | "md" | "lg";

/** Loading 컴포넌트의 label 기본값 */
const DEFAULT_LOADING_LABEL = "로딩 중";
/** 전체 화면 로딩은 Controls까지 가리므로 이 시간 뒤 자동으로 끕니다. */
const FULLSCREEN_RELEASE_MS = 2000;

type LoadingPlaygroundValues = {
  isFullscreen: boolean;
  label: string;
  size: LoadingSize;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  isFullscreen,
  label,
  size,
}: LoadingPlaygroundValues) {
  const labelProp =
    label === "" || label === DEFAULT_LOADING_LABEL ? "" : ` label="${label}"`;
  const sizeProp = size === "md" ? "" : ` size="${size}"`;

  if (isFullscreen) {
    return `const [loading, setLoading] = useState(false);

<Button type="button" onClick={() => setLoading(true)}>
  로딩 시작
</Button>
<Loading loading={loading}${labelProp}${sizeProp} />`;
  }

  return `const [loading, setLoading] = useState(false);

<Loading fullscreen={false} loading={loading}${labelProp}${sizeProp}>
  <div className="rounded-xl border border-line02 bg-base p-4">
    <p className="font-medium text-font-b">주문 목록</p>
    <p className="mt-2 text-sm text-font-g">총 3건의 데이터가 있습니다.</p>
  </div>
</Loading>`;
}

/** Loading Playground (이 페이지에서만 사용) */
function LoadingPlayground() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [label, setLabel] = React.useState(DEFAULT_LOADING_LABEL);
  const [size, setSize] = React.useState<LoadingSize>("md");

  // 전체 화면 로딩은 화면 전체(Controls 포함)를 가리므로 잠시 뒤 자동으로 해제합니다.
  React.useEffect(() => {
    if (!isLoading || !isFullscreen) return;
    const timerId = window.setTimeout(
      () => setIsLoading(false),
      FULLSCREEN_RELEASE_MS,
    );
    return () => window.clearTimeout(timerId);
  }, [isLoading, isFullscreen]);

  const handleClickReset = () => {
    setIsLoading(false);
    setIsFullscreen(false);
    setLabel(DEFAULT_LOADING_LABEL);
    setSize("md");
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "loading",
      type: "boolean",
      description: `로딩 표시 여부. fullscreen에서는 ${FULLSCREEN_RELEASE_MS / 1000}초 뒤 자동으로 꺼집니다(데모용).`,
      control: (
        <PlaygroundSwitchControl
          label="loading"
          checked={isLoading}
          onCheckedChange={setIsLoading}
        />
      ),
    },
    {
      name: "fullscreen",
      type: "boolean",
      description: "true: 화면 전체를 가림 (기본값) / false: children 영역만 가림",
      control: (
        <PlaygroundSwitchControl
          label="fullscreen"
          checked={isFullscreen}
          onCheckedChange={setIsFullscreen}
        />
      ),
    },
    {
      name: "label",
      type: "string",
      description: `스피너 옆 문구 (비우면 기본값 "${DEFAULT_LOADING_LABEL}")`,
      control: (
        <PlaygroundTextControl
          label="label"
          value={label}
          onValueChange={setLabel}
          placeholder={DEFAULT_LOADING_LABEL}
        />
      ),
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      description: "스피너 크기",
      control: (
        <PlaygroundRadioControl
          label="size"
          value={size}
          options={["sm", "md", "lg"]}
          onValueChange={(next) => setSize(next as LoadingSize)}
        />
      ),
    },
  ];

  const loadingLabel = label === "" ? undefined : label;

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기의 버튼으로도 loading을 켜고 끌 수 있습니다."
      code={buildPlaygroundCode({ isFullscreen, label, size })}
      controls={controls}
      controlsNote="overlayClassName·className은 오버레이 모양을 덮어쓰는 용도라 Controls에 넣지 않았습니다. Loading에는 이벤트 Props가 없어 이벤트 로그를 표시하지 않습니다. 이 Playground는 fullscreen=false로 시작합니다(컴포넌트 기본값은 true)."
      state={{
        loading: isLoading,
        fullscreen: isFullscreen,
        label: loadingLabel ?? `(기본값) ${DEFAULT_LOADING_LABEL}`,
        size,
      }}
      onReset={handleClickReset}
    >
      <div className="flex w-full max-w-md flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsLoading((prev) => !prev)}
          >
            {isLoading ? "로딩 끝" : "로딩 시작"}
          </Button>
        </div>
        {isFullscreen ? (
          <Loading loading={isLoading} label={loadingLabel} size={size} />
        ) : (
          <Loading
            fullscreen={false}
            loading={isLoading}
            label={loadingLabel}
            size={size}
          >
            <div className="rounded-xl border border-line02 bg-base p-4">
              <p className="font-medium text-font-b">주문 목록</p>
              <p className="mt-2 text-sm text-font-g">
                총 3건의 데이터가 있습니다.
              </p>
            </div>
          </Loading>
        )}
      </div>
    </GuidePlayground>
  );
}

function SampleLoadingPage() {
  const [screenLoading, setScreenLoading] = React.useState(false);
  const [areaLoading, setAreaLoading] = React.useState(false);

  React.useEffect(() => {
    if (!screenLoading) return;
    const id = window.setTimeout(() => setScreenLoading(false), 1800);
    return () => window.clearTimeout(id);
  }, [screenLoading]);

  React.useEffect(() => {
    if (!areaLoading) return;
    const id = window.setTimeout(() => setAreaLoading(false), 2000);
    return () => window.clearTimeout(id);
  }, [areaLoading]);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Loading Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<LoadingPlayground />}>
          <GuideBox
            title="전체 화면 가림 로딩"
            description="페이지 전체를 가리는 오버레이 로딩입니다. 데모에서는 1.8초 뒤 자동으로 해제됩니다."
            code={`
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!loading) return;
  const id = window.setTimeout(() => setLoading(false), 1800);
  return () => window.clearTimeout(id);
}, [loading]);

<Button onClick={() => setLoading(true)}>전체 로딩 시작</Button>
<Loading loading={loading} label="전체 화면 로딩 중..." />
          `}
          >
            <div className="flex items-center gap-3">
              <Button type="button" onClick={() => setScreenLoading(true)}>
                전체 로딩 시작
              </Button>
              <span className="text-sm text-font-g">
                로딩 중에는 화면이 잠시 비활성화됩니다.
              </span>
            </div>
            <Loading loading={screenLoading} label="전체 화면 로딩 중..." />
          </GuideBox>

          <GuideBox
            title="특정 영역 로딩"
            description="카드/테이블 같은 특정 컨테이너 안에만 오버레이를 씌울 때 사용합니다."
            code={`
const [loading, setLoading] = useState(false);

<Loading fullscreen={false} loading={loading} label="목록 불러오는 중...">
  <div className="rounded-xl border border-line02 bg-base p-4">
    <p className="font-medium text-font-b">주문 목록</p>
    <p className="mt-2 text-sm text-font-g">총 3건의 데이터가 있습니다.</p>
  </div>
</Loading>
          `}
          >
            <div className="mb-3 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAreaLoading(true)}
              >
                영역 로딩 시작
              </Button>
              <span className="text-sm text-font-g">
                2초 후 자동으로 해제됩니다.
              </span>
            </div>

            <Loading
              fullscreen={false}
              loading={areaLoading}
              label="목록 불러오는 중..."
            >
              <div className="rounded-xl border border-line02 bg-base p-4">
                <p className="font-medium text-font-b">주문 목록</p>
                <p className="mt-2 text-sm text-font-g">
                  총 3건의 데이터가 있습니다.
                </p>
                <ul className="mt-3 list-disc pl-5 text-sm text-font-b">
                  <li>주문번호 #A-1024</li>
                  <li>주문번호 #A-1025</li>
                  <li>주문번호 #A-1026</li>
                </ul>
              </div>
            </Loading>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleLoadingPage };
export default SampleLoadingPage;
