import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components/ui";
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

const DEFAULT_DESCRIPTION = "이 설계안으로 가입을 진행하시겠습니까?";
const DEFAULT_ACTION_LABEL = "가입 진행";
const DEFAULT_CANCEL_LABEL = "취소";
const DIALOG_TITLE = "가입 진행 확인";

type AlertDialogPlaygroundValues = {
  hasCancel: boolean;
  isCloseButtonShown: boolean;
  description: string;
  actionLabel: string;
  cancelLabel: string;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  hasCancel,
  isCloseButtonShown,
  description,
  actionLabel,
  cancelLabel,
}: AlertDialogPlaygroundValues) {
  const contentProps = isCloseButtonShown ? "" : " showCloseButton={false}";
  const cancelLine = hasCancel
    ? `\n      <AlertDialogCancel onClick={handleClickCancel}>${cancelLabel}</AlertDialogCancel>`
    : "";

  return `const [isOpen, setIsOpen] = useState(false);

<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogTrigger asChild>
    <Button variant="outline" size="md">알림 열기</Button>
  </AlertDialogTrigger>
  <AlertDialogContent${contentProps}>
    <AlertDialogHeader>
      <AlertDialogTitle>${DIALOG_TITLE}</AlertDialogTitle>
      <AlertDialogDescription>${description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>${cancelLine}
      <AlertDialogAction onClick={handleClickAction}>${actionLabel}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;
}

/** AlertDialog Playground (이 페이지에서만 사용) */
function AlertDialogPlayground() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCancel, setHasCancel] = useState(true);
  const [isCloseButtonShown, setIsCloseButtonShown] = useState(true);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [actionLabel, setActionLabel] = useState(DEFAULT_ACTION_LABEL);
  const [cancelLabel, setCancelLabel] = useState(DEFAULT_CANCEL_LABEL);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const handleChangeOpen = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    addEventLog("onOpenChange", nextOpen);
  };

  const handleClickAction = () => {
    addEventLog("AlertDialogAction onClick");
  };

  const handleClickCancel = () => {
    addEventLog("AlertDialogCancel onClick");
  };

  const handleClickReset = () => {
    setIsOpen(false);
    setHasCancel(true);
    setIsCloseButtonShown(true);
    setDescription(DEFAULT_DESCRIPTION);
    setActionLabel(DEFAULT_ACTION_LABEL);
    setCancelLabel(DEFAULT_CANCEL_LABEL);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "open",
      type: "boolean",
      description:
        "열림 상태 (onOpenChange와 함께 제어형). 켜면 바로 창이 열리고, 창의 버튼으로 닫으면 함께 꺼집니다",
      control: (
        <PlaygroundSwitchControl
          label="open"
          checked={isOpen}
          onCheckedChange={setIsOpen}
        />
      ),
    },
    {
      name: "AlertDialogCancel",
      type: "boolean",
      description: "취소 버튼 사용 (끄면 확인 버튼 1개짜리 알림, 켜면 버튼 2개짜리 확인)",
      control: (
        <PlaygroundSwitchControl
          label="AlertDialogCancel"
          checked={hasCancel}
          onCheckedChange={setHasCancel}
        />
      ),
    },
    {
      name: "AlertDialogContent showCloseButton",
      type: "boolean",
      description: "오른쪽 위 닫기(×) 버튼",
      control: (
        <PlaygroundSwitchControl
          label="showCloseButton"
          checked={isCloseButtonShown}
          onCheckedChange={setIsCloseButtonShown}
        />
      ),
    },
    {
      name: "AlertDialogDescription",
      type: "ReactNode",
      description: "화면에 보이는 본문",
      control: (
        <PlaygroundTextControl
          label="AlertDialogDescription"
          value={description}
          onValueChange={setDescription}
        />
      ),
    },
    {
      name: "AlertDialogAction children",
      type: "ReactNode",
      description: "확인 버튼 글자 (누르면 닫힘)",
      control: (
        <PlaygroundTextControl
          label="AlertDialogAction children"
          value={actionLabel}
          onValueChange={setActionLabel}
        />
      ),
    },
    {
      name: "AlertDialogCancel children",
      type: "ReactNode",
      description: "취소 버튼 글자 (누르면 닫힘)",
      control: (
        <PlaygroundTextControl
          label="AlertDialogCancel children"
          value={cancelLabel}
          onValueChange={setCancelLabel}
          disabled={!hasCancel}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 열기 버튼이나 open 컨트롤로 창을 열고, 창의 버튼·Esc로 닫으면 open과 이벤트 로그가 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode({
        hasCancel,
        isCloseButtonShown,
        description,
        actionLabel,
        cancelLabel,
      })}
      controls={controls}
      controlsNote={`AlertDialogContent size="sm"은 현재 스타일이 없어 모양이 같으므로(docs/components/AlertDialog.md) 넣지 않았습니다. AlertDialogTitle은 화면에 보이지 않는(sr-only) 필수 제목이라 "${DIALOG_TITLE}"로 고정했고, AlertDialogAction·AlertDialogCancel의 variant·size는 Button 가이드에서 확인합니다.`}
      state={{
        open: isOpen,
        hasCancel,
        showCloseButton: isCloseButtonShown,
        description,
        actionLabel,
        cancelLabel: hasCancel ? cancelLabel : "(사용 안 함)",
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <AlertDialog open={isOpen} onOpenChange={handleChangeOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="md">
            알림 열기
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent showCloseButton={isCloseButtonShown}>
          <AlertDialogHeader>
            <AlertDialogTitle>{DIALOG_TITLE}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {hasCancel ? (
              <AlertDialogCancel onClick={handleClickCancel}>
                {cancelLabel}
              </AlertDialogCancel>
            ) : null}
            <AlertDialogAction onClick={handleClickAction}>
              {actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </GuidePlayground>
  );
}

function SampleAlertDialogPage() {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Alert Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<AlertDialogPlayground />}>
          {/* ── Alert ── */}
          <GuideBox
            title="Alert"
            description="단순 알림 메시지에 사용하는 최소형 다이얼로그입니다. 제목 없이 내용과 확인 버튼만 표시됩니다."
            code={`
{/* 방법 1: Trigger로 제어 */}
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline" size="md">
      Alert 열기 (Trigger)
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>알림</AlertDialogTitle>
      <AlertDialogDescription>
        수정시 AI 재추론 과정을 진행합니다.
        <br /> 재추론에는 5~10분가량 소요됩니다.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>확인</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

{/* 방법 2: 외부 상태로 제어 */}
<Button
  variant="outline"
  size="md"
  onClick={() => setAlertOpen(true)}
>
  Alert 열기 (External)
</Button>
<AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>알림</AlertDialogTitle>
      <AlertDialogDescription>
        이 항목을 정말로 삭제하시겠습니까?
        <br />
        삭제된 데이터는 복구할 수 없습니다.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>취소</AlertDialogCancel>
      <AlertDialogAction>확인</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
          `}
          >
            <div className="flex flex-wrap gap-4">
              {/* 방법 1: Trigger로 제어 */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="md">
                    Alert 열기 (Trigger)
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>알림</AlertDialogTitle>
                    <AlertDialogDescription>
                      수정시 AI 재추론 과정을 진행합니다.
                      <br /> 재추론에는 5~10분가량 소요됩니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>확인</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* 방법 2: 외부 상태로 제어 */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setAlertOpen(true)}
              >
                Alert 열기 (External)
              </Button>
              <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>알림</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 항목을 정말로 삭제하시겠습니까?
                      <br />
                      삭제된 데이터는 복구할 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction>확인</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleAlertDialogPage };
export default SampleAlertDialogPage;
