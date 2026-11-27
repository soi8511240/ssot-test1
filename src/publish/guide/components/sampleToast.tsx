import * as React from "react";
import { Button, Toast, toast } from "@/components/ui";
import type { ToastProps } from "@/components/ui";
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

type ToastType = "default" | "success" | "info" | "warning" | "error";
type ToastId = string | number;

const TOAST_TYPES: ToastType[] = [
  "default",
  "success",
  "info",
  "warning",
  "error",
];
const TOASTER_DEFAULT_VALUE = "__toaster__";
const DEFAULT_DURATION = "4000";
const DEFAULT_MESSAGE = "저장되었습니다.";

/** 현재 컨트롤 값으로 toast 옵션 코드 줄을 만듭니다. */
function buildToastOptionLines({
  description,
  position,
  duration,
  hasCloseButton,
}: {
  description: string;
  position: string;
  duration: string;
  hasCloseButton: boolean;
}) {
  return [
    description ? `description: ${JSON.stringify(description)},` : "",
    position !== TOASTER_DEFAULT_VALUE ? `position: "${position}",` : "",
    duration !== DEFAULT_DURATION ? `duration: ${duration},` : "",
    hasCloseButton ? "closeButton: true," : "",
  ].filter(Boolean);
}

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildToastPlaygroundCode(
  toastType: ToastType,
  message: string,
  optionLines: string[],
) {
  const toastCall = toastType === "default" ? "toast" : `toast.${toastType}`;
  const optionCode =
    optionLines.length > 0
      ? `, {\n${optionLines.map((line) => `      ${line}`).join("\n")}\n    }`
      : "";

  return `import { Toast, toast } from "@/components/ui";

// 레이아웃 루트 등 한 곳에 한 번만
<Toast />

<Button
  type="button"
  onClick={() =>
    ${toastCall}(${JSON.stringify(message)}${optionCode})
  }
>
  토스트 띄우기
</Button>`;
}

/** Toast Playground (이 페이지에서만 사용) */
function ToastPlayground() {
  const [toastType, setToastType] = React.useState<ToastType>("default");
  const [message, setMessage] = React.useState(DEFAULT_MESSAGE);
  const [description, setDescription] = React.useState("");
  const [position, setPosition] = React.useState(TOASTER_DEFAULT_VALUE);
  const [duration, setDuration] = React.useState(DEFAULT_DURATION);
  const [hasCloseButton, setHasCloseButton] = React.useState(false);
  const [visibleToastIds, setVisibleToastIds] = React.useState<ToastId[]>([]);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const removeVisibleToastId = (id: ToastId) => {
    setVisibleToastIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClickShowToast = () => {
    const toastOptions = {
      description: description || undefined,
      position:
        position === TOASTER_DEFAULT_VALUE
          ? undefined
          : (position as NonNullable<ToastProps["position"]>),
      duration: Number(duration),
      closeButton: hasCloseButton,
      onDismiss: (item: { id: ToastId }) => {
        removeVisibleToastId(item.id);
        addEventLog("onDismiss", item.id);
      },
      onAutoClose: (item: { id: ToastId }) => {
        removeVisibleToastId(item.id);
        addEventLog("onAutoClose", item.id);
      },
    };
    const toastId =
      toastType === "default"
        ? toast(message, toastOptions)
        : toast[toastType](message, toastOptions);
    setVisibleToastIds((prev) => [...prev, toastId]);
    addEventLog(toastType === "default" ? "toast" : `toast.${toastType}`, toastId);
  };

  const handleClickDismissAll = () => {
    toast.dismiss();
    setVisibleToastIds([]);
    addEventLog("toast.dismiss");
  };

  const handleClickReset = () => {
    toast.dismiss();
    setToastType("default");
    setMessage(DEFAULT_MESSAGE);
    setDescription("");
    setPosition(TOASTER_DEFAULT_VALUE);
    setDuration(DEFAULT_DURATION);
    setHasCloseButton(false);
    setVisibleToastIds([]);
    clearEventLogs();
  };

  const optionLines = buildToastOptionLines({
    description,
    position,
    duration,
    hasCloseButton,
  });

  const controls: GuidePlaygroundControl[] = [
    {
      name: "toast 종류",
      type: 'toast() | toast.success() | toast.info() | toast.warning() | toast.error()',
      description: "호출 함수에 따라 아이콘이 달라집니다.",
      control: (
        <PlaygroundRadioControl
          label="toast 종류"
          value={toastType}
          options={TOAST_TYPES}
          onValueChange={(next) => setToastType(next as ToastType)}
        />
      ),
    },
    {
      name: "message",
      type: "ReactNode",
      description: "토스트 제목 (첫 번째 인자)",
      control: (
        <PlaygroundTextControl
          label="message"
          value={message}
          onValueChange={setMessage}
        />
      ),
    },
    {
      name: "description",
      type: "ReactNode",
      description: "제목 아래 보조 문구 (비우면 생략)",
      control: (
        <PlaygroundTextControl
          label="description"
          value={description}
          onValueChange={setDescription}
          placeholder="예: 변경 내용이 반영되었습니다."
        />
      ),
    },
    {
      name: "position",
      type: '"top-left" | "top-center" | ... | "bottom-right"',
      description:
        "이 토스트만 표시할 위치. 생략하면 <Toast position>(이 페이지는 Samples 탭에서 정한 값, 기본 bottom-right)을 따릅니다.",
      control: (
        <PlaygroundRadioControl
          label="position"
          value={position}
          options={[
            { value: TOASTER_DEFAULT_VALUE, label: "생략" },
            ...TOASTER_POSITIONS,
          ]}
          onValueChange={setPosition}
        />
      ),
    },
    {
      name: "duration",
      type: "number",
      description: "자동으로 닫히기까지 시간(ms). Infinity면 자동으로 닫히지 않습니다.",
      control: (
        <PlaygroundRadioControl
          label="duration"
          value={duration}
          options={[
            "2000",
            { value: DEFAULT_DURATION, label: "4000 (기본)" },
            "Infinity",
          ]}
          onValueChange={setDuration}
        />
      ),
    },
    {
      name: "closeButton",
      type: "boolean",
      description: "토스트에 닫기(X) 버튼 표시",
      control: (
        <PlaygroundSwitchControl
          label="closeButton"
          checked={hasCloseButton}
          onCheckedChange={setHasCloseButton}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 옵션을 고른 뒤 「토스트 띄우기」를 누르면 그 옵션으로 토스트가 뜹니다. 토스트는 열림 상태를 Props로 제어하지 않고 toast() 호출로 띄우므로, 현재 떠 있는 토스트 id를 State에 보여 줍니다."
      code={buildToastPlaygroundCode(toastType, message, optionLines)}
      controls={controls}
      controlsNote="richColors·action·cancel 등 sonner의 다른 옵션은 이 프로젝트 샘플·디자인 토큰에 맞춰 확인되지 않아 Controls에 넣지 않았습니다. <Toast>(Toaster)는 페이지에 하나만 두어야 해서, Toaster 자체 Props 대신 toast() 옵션만 바꿉니다."
      state={{
        type: toastType,
        message,
        description: description || "(없음)",
        position:
          position === TOASTER_DEFAULT_VALUE ? "(Toaster 기본)" : position,
        duration,
        closeButton: hasCloseButton,
        visibleToastIds,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleClickShowToast}>
          토스트 띄우기
        </Button>
        <Button type="button" variant="outline" onClick={handleClickDismissAll}>
          모두 닫기
        </Button>
      </div>
    </GuidePlayground>
  );
}

const TOASTER_POSITIONS: NonNullable<ToastProps["position"]>[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function SampleToastPage() {
  const [toasterPosition, setToasterPosition] =
    React.useState<NonNullable<ToastProps["position"]>>("bottom-right");

  return (
    <div className="guide-layout">
      <Toast position={toasterPosition} />
      <h1 className="guide-title">Toast Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<ToastPlayground />}>
          <GuideBox
            title="기본 toast (sonner)"
            description="앱 루트에 Toast를 한 번 마운트하고, toast()로 메시지를 띄웁니다. 이 페이지는 샘플용으로 하단에 Toast를 포함합니다."
            code={`
import { Toast, toast } from "@/components/ui";

// 레이아웃 루트 등 한 곳에
<Toast />

// 이벤트에서
toast("저장되었습니다.");
toast.success("성공");
toast.error("오류가 발생했습니다.");
          `}
          >
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => toast("기본 메시지입니다.")}
              >
                Default
              </Button>
              <Button
                type="button"
                onClick={() => toast.success("처리가 완료되었습니다.")}
              >
                Success
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  toast.info("참고용 안내 문구입니다.", { duration: 4000 })
                }
              >
                Info
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.warning("확인이 필요합니다.")}
              >
                Warning
              </Button>
              <Button
                type="button"
                variant="outline"
                color="gray"
                onClick={() => toast.error("요청을 처리하지 못했습니다.")}
              >
                Error
              </Button>
            </div>
          </GuideBox>

          <GuideBox
            title="Toaster 기본 position"
            description="<Toast position={...} /> 로 토스트 컨테이너의 기본 위치를 정합니다. 아래에서 위치를 바꾼 뒤 「이 위치로 표시」를 눌러 확인하세요."
            code={`
const [toasterPosition, setToasterPosition] = useState("bottom-right");

<Toast position={toasterPosition} />

// position을 생략한 toast()는 위 Toaster 위치를 따릅니다.
toast("기본 위치에 표시됩니다.");
          `}
          >
            <div className="flex max-w-3xl flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {TOASTER_POSITIONS.map((pos) => (
                  <Button
                    key={pos}
                    type="button"
                    size="sm"
                    variant={toasterPosition === pos ? "default" : "outline"}
                    onClick={() => setToasterPosition(pos)}
                  >
                    {pos}
                  </Button>
                ))}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    toast.success(`Toaster 기본 위치: ${toasterPosition}`)
                  }
                >
                  이 위치로 표시
                </Button>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="toast()별 position"
            description='개별 호출에 { position: "top-left" } 등을 넘기면 Toaster 기본값과 관계없이 해당 모서리·중앙에만 표시됩니다.'
            code={`
toast("우측 상단", { position: "top-right" });
toast.info("하단 중앙", { position: "bottom-center" });
          `}
          >
            <div className="grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-3">
              {TOASTER_POSITIONS.map((pos) => (
                <Button
                  key={`per-${pos}`}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toast(`position: ${pos}`, {
                      position: pos,
                      duration: 3500,
                    })
                  }
                >
                  {pos}
                </Button>
              ))}
            </div>
          </GuideBox>

          <GuideBox
            title="Promise · 로딩"
            description="toast.promise로 비동기 작업 진행 상태를 표시합니다."
            code={`
toast.promise(
  new Promise((resolve) => setTimeout(() => resolve("done"), 2000)),
  {
    loading: "저장 중…",
    success: "저장됨",
    error: "실패",
  }
);
          `}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                toast.promise(
                  new Promise<string>((resolve) =>
                    setTimeout(() => resolve("done"), 2000),
                  ),
                  {
                    loading: "저장 중…",
                    success: "저장되었습니다.",
                    error: "저장에 실패했습니다.",
                  },
                )
              }
            >
              Promise toast
            </Button>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleToastPage };
export default SampleToastPage;
