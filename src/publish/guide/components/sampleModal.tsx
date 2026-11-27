import {
  Button,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  type ModalSize,
} from "@/components/ui";
import { useState } from "react";
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

const MODAL_SIZES: ModalSize[] = ["alert", "small", "medium", "large", "full"];
const DEFAULT_MODAL_TITLE = "알림";
const PLAYGROUND_BODY_TEXT =
  "변경사항을 저장하시겠습니까? 저장하지 않으면 입력한 내용이 사라집니다.";

type ModalPlaygroundValues = {
  isOpen: boolean;
  size: ModalSize;
  shouldShowCloseButton: boolean;
  hasHeader: boolean;
  title: string;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  isOpen,
  size,
  shouldShowCloseButton,
  hasHeader,
  title,
}: ModalPlaygroundValues) {
  const sizeProp = size === "medium" ? "" : ` size="${size}"`;
  const closeButtonProp = shouldShowCloseButton
    ? ""
    : " showCloseButton={false}";
  const header = hasHeader
    ? `
    <ModalHeader>
      <ModalTitle>${title}</ModalTitle>
    </ModalHeader>`
    : "";

  return `const [open, setOpen] = useState(${isOpen});

<Modal open={open} onOpenChange={setOpen}>
  <ModalTrigger asChild>
    <Button variant="outline" size="md">
      Modal 열기
    </Button>
  </ModalTrigger>
  <ModalContent${sizeProp}${closeButtonProp}>${header}
    <ModalBody>
      ${PLAYGROUND_BODY_TEXT}
    </ModalBody>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="outline" color="gray">
          취소
        </Button>
      </ModalClose>
      <ModalClose asChild>
        <Button>확인</Button>
      </ModalClose>
    </ModalFooter>
  </ModalContent>
</Modal>`;
}

/** Modal Playground (이 페이지에서만 사용) */
function ModalPlayground() {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<ModalSize>("medium");
  const [shouldShowCloseButton, setShouldShowCloseButton] = useState(true);
  const [hasHeader, setHasHeader] = useState(true);
  const [title, setTitle] = useState(DEFAULT_MODAL_TITLE);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const handleChangeModalOpen = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    addEventLog("onOpenChange", nextOpen);
  };

  const handleClickReset = () => {
    setIsOpen(false);
    setSize("medium");
    setShouldShowCloseButton(true);
    setHasHeader(true);
    setTitle(DEFAULT_MODAL_TITLE);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "open",
      type: "boolean",
      description:
        "열림 상태 (onOpenChange와 함께 제어형). 열리면 Controls가 가려지므로 ESC·닫기 버튼·바깥 클릭으로 닫습니다.",
      control: (
        <PlaygroundSwitchControl
          label="open"
          checked={isOpen}
          onCheckedChange={setIsOpen}
        />
      ),
    },
    {
      name: "ModalContent size",
      type: '"alert" | "small" | "medium" | "large" | "full"',
      description: "모달 크기 (기본값 medium)",
      control: (
        <PlaygroundRadioControl
          label="ModalContent size"
          value={size}
          options={MODAL_SIZES}
          onValueChange={(next) => setSize(next as ModalSize)}
        />
      ),
    },
    {
      name: "ModalContent showCloseButton",
      type: "boolean",
      description: "오른쪽 위 닫기(X) 버튼 표시 (기본값 true)",
      control: (
        <PlaygroundSwitchControl
          label="ModalContent showCloseButton"
          checked={shouldShowCloseButton}
          onCheckedChange={setShouldShowCloseButton}
        />
      ),
    },
    {
      name: "ModalHeader",
      type: "boolean",
      description: `제목 영역 사용. 끄면 보조기기용 숨김 제목 "${DEFAULT_MODAL_TITLE}"이 자동으로 들어갑니다.`,
      control: (
        <PlaygroundSwitchControl
          label="ModalHeader"
          checked={hasHeader}
          onCheckedChange={setHasHeader}
        />
      ),
    },
    {
      name: "ModalTitle children",
      type: "ReactNode",
      description: "제목 문구 (ModalHeader를 켰을 때만 적용)",
      control: (
        <PlaygroundTextControl
          label="ModalTitle children"
          value={title}
          onValueChange={setTitle}
          disabled={!hasHeader}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 트리거 버튼·닫기 버튼·ESC·바깥 클릭으로 열고 닫으면 open 값이 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode({
        isOpen,
        size,
        shouldShowCloseButton,
        hasHeader,
        title,
      })}
      controls={controls}
      controlsNote="className은 배치용이라 Controls에 넣지 않았습니다. ModalBody·ModalFooter 내용은 예시 문구로 고정했습니다."
      state={{
        open: isOpen,
        size,
        showCloseButton: shouldShowCloseButton,
        hasHeader,
        title: hasHeader ? title : `(숨김) ${DEFAULT_MODAL_TITLE}`,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <Modal open={isOpen} onOpenChange={handleChangeModalOpen}>
        <ModalTrigger asChild>
          <Button variant="outline" size="md">
            Modal 열기
          </Button>
        </ModalTrigger>
        <ModalContent
          size={size}
          showCloseButton={shouldShowCloseButton}
          onEscapeKeyDown={() => addEventLog("onEscapeKeyDown")}
          onInteractOutside={() => addEventLog("onInteractOutside")}
        >
          {hasHeader ? (
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
          ) : null}
          <ModalBody>{PLAYGROUND_BODY_TEXT}</ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button
                variant="outline"
                color="gray"
                onClick={() => addEventLog("취소 onClick")}
              >
                취소
              </Button>
            </ModalClose>
            <ModalClose asChild>
              <Button onClick={() => addEventLog("확인 onClick")}>확인</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </GuidePlayground>
  );
}

function SampleModalPage() {
  const [alertExternalOpen, setAlertExternalOpen] = useState(false);
  const [smallExternalOpen, setSmallExternalOpen] = useState(false);
  const [mediumExternalOpen, setMediumExternalOpen] = useState(false);
  const [largeExternalOpen, setLargeExternalOpen] = useState(false);
  const [fullscreenExternalOpen, setFullscreenExternalOpen] = useState(false);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">Modal Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<ModalPlayground />}>
          {/* ── Alert ── */}
          <GuideBox
            title="Alert"
            description="단순 알림 메시지에 사용하는 최소형 다이얼로그입니다. 제목 없이 내용과 확인 버튼만 표시됩니다."
            code={`
{/* 방법 1: ModalTrigger 내부 사용 */}
<Modal>
  <ModalTrigger asChild>
    <Button variant="outline" size="md">
      Alert 열기
    </Button>
  </ModalTrigger>
  <ModalContent size="alert">
    <ModalBody>    
      이 항목을 정말로 삭제하시겠습니까?
      <br />
      삭제된 데이터는 복구할 수 없습니다.      
    </ModalBody>
    <ModalFooter>
      <ModalClose asChild>
        <Button>확인</Button>
      </ModalClose>
    </ModalFooter>
  </ModalContent>
</Modal>

{/* 방법 2: 외부 상태로 제어 */}
<Button
  variant="outline"
  size="md"
  onClick={() => setAlertExternalOpen(true)}
>
  Alert 열기 (External)
</Button>
<Modal
  open={alertExternalOpen}
  onOpenChange={setAlertExternalOpen}
>
  <ModalContent size="alert">
    <ModalBody>      
      이 항목을 정말로 삭제하시겠습니까?
      <br />
      삭제된 데이터는 복구할 수 없습니다.      
    </ModalBody>
    <ModalFooter>
      <ModalClose asChild>
        <Button>확인</Button>
      </ModalClose>
    </ModalFooter>
  </ModalContent>
</Modal>
          `}
          >
            <div className="flex flex-wrap gap-4">
              {/* 방법 1: ModalTrigger 내부 사용 */}
              <Modal>
                <ModalTrigger asChild>
                  <Button variant="outline" size="md">
                    Alert 열기
                  </Button>
                </ModalTrigger>
                <ModalContent size="alert">
                  <ModalBody>
                    이 항목을 정말로 삭제하시겠습니까?
                    <br />
                    삭제된 데이터는 복구할 수 없습니다.
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button>확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* 방법 2: 외부 상태로 제어 */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setAlertExternalOpen(true)}
              >
                Alert 열기 (External)
              </Button>
              <Modal open={alertExternalOpen} onOpenChange={setAlertExternalOpen}>
                <ModalContent size="alert">
                  <ModalBody>
                    이 항목을 정말로 삭제하시겠습니까?
                    <br />
                    삭제된 데이터는 복구할 수 없습니다.
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button>확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </GuideBox>

          {/* ── Small ── */}
          <GuideBox
            title="Small"
            description="간단한 안내 메시지나 단일 액션 확인에 사용하는 소형 다이얼로그입니다."
            code={`
 {/* 방법 1: ModalTrigger 내부 사용 */}
  <Modal>
    <ModalTrigger asChild>
      <Button variant="outline" size="md">
        Small 열기 (Trigger)
      </Button>
    </ModalTrigger>
    <ModalContent size="small">
      <ModalHeader>
        <ModalTitle>알림</ModalTitle>
      </ModalHeader>
      <ModalBody>        
        저장이 완료되었습니다. 변경사항이 적용되었습니다.        
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline">확인</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>

  {/* 방법 2: 외부 상태로 제어 */}
  <Button
    variant="outline"
    size="md"
    onClick={() => setSmallExternalOpen(true)}
  >
    Small 열기 (External)
  </Button>
  <Modal
    open={smallExternalOpen}
    onOpenChange={setSmallExternalOpen}
  >
    <ModalContent size="small">
      <ModalHeader>
        <ModalTitle>알림</ModalTitle>
      </ModalHeader>
      <ModalBody>        
        저장이 완료되었습니다. 변경사항이 적용되었습니다.        
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline">확인</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>            
          `}
          >
            <div className="flex flex-wrap gap-4">
              {/* 방법 1: ModalTrigger 내부 사용 */}
              <Modal>
                <ModalTrigger asChild>
                  <Button variant="outline" size="md">
                    Small 열기 (Trigger)
                  </Button>
                </ModalTrigger>
                <ModalContent size="small">
                  <ModalHeader>
                    <ModalTitle>알림</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    저장이 완료되었습니다. 변경사항이 적용되었습니다.
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="outline">확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* 방법 2: 외부 상태로 제어 */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setSmallExternalOpen(true)}
              >
                Small 열기 (External)
              </Button>
              <Modal open={smallExternalOpen} onOpenChange={setSmallExternalOpen}>
                <ModalContent size="small">
                  <ModalHeader>
                    <ModalTitle>알림</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    저장이 완료되었습니다. 변경사항이 적용되었습니다.
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="outline">확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </GuideBox>

          {/* ── Medium ── */}
          <GuideBox
            title="Medium"
            description="일반적인 확인/취소 액션이 필요한 기본 다이얼로그입니다. (기본값)"
            code={`
  {/* 방법 1: ModalTrigger 내부 사용 */}
  <Modal>
    <ModalTrigger asChild>
      <Button variant="outline" size="md">
        Medium 열기 (Trigger)
      </Button>
    </ModalTrigger>
    <ModalContent size="medium">
      <ModalHeader>
        <ModalTitle>Title</ModalTitle>
      </ModalHeader>
      <ModalBody>        
        변경사항을 저장하시겠습니까? 저장하지 않으면 입력한 내용이
        사라집니다.        
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline" color="gray">
            취소
          </Button>
        </ModalClose>
        <ModalClose asChild>
          <Button>확인</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>

  {/* 방법 2: 외부 상태로 제어 */}
  <Button
    variant="outline"
    size="md"
    onClick={() => setMediumExternalOpen(true)}
  >
    Medium 열기 (External)
  </Button>
  <Modal
    open={mediumExternalOpen}
    onOpenChange={setMediumExternalOpen}
  >
    <ModalContent size="medium">
      <ModalHeader>
        <ModalTitle>Title</ModalTitle>
      </ModalHeader>
      <ModalBody>        
        변경사항을 저장하시겠습니까? 저장하지 않으면 입력한 내용이 사라집니다.        
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline" color="gray">취소</Button>
        </ModalClose>
        <ModalClose asChild>
          <Button>확인</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
          `}
          >
            <div className="flex flex-wrap gap-4">
              {/* 방법 1: ModalTrigger 내부 사용 */}
              <Modal>
                <ModalTrigger asChild>
                  <Button variant="outline" size="md">
                    Medium 열기 (Trigger)
                  </Button>
                </ModalTrigger>
                <ModalContent size="medium">
                  <ModalHeader>
                    <ModalTitle>Title</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    변경사항을 저장하시겠습니까? 저장하지 않으면 입력한 내용이
                    사라집니다.
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="outline" color="gray">
                        취소
                      </Button>
                    </ModalClose>
                    <ModalClose asChild>
                      <Button>확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* 방법 2: 외부 상태로 제어 */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setMediumExternalOpen(true)}
              >
                Medium 열기 (External)
              </Button>
              <Modal
                open={mediumExternalOpen}
                onOpenChange={setMediumExternalOpen}
              >
                <ModalContent size="medium">
                  <ModalHeader>
                    <ModalTitle>Title</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    변경사항을 저장하시겠습니까? 저장하지 않으면 입력한 내용이
                    사라집니다.
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="outline" color="gray">
                        취소
                      </Button>
                    </ModalClose>
                    <ModalClose asChild>
                      <Button>확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </GuideBox>

          {/* ── Large ── */}
          <GuideBox
            title="Large"
            description="복잡한 내용을 넓게 표시할 때 사용하는 대형 다이얼로그입니다."
            code={`
  {/* 방법 1: ModalTrigger 내부 사용 */}
  <Modal>
    <ModalTrigger asChild>
      <Button variant="outline" size="md">
        Large 열기 (Trigger)
      </Button>
    </ModalTrigger>
    <ModalContent size="large">
      <ModalHeader>
        <ModalTitle>Title</ModalTitle>
      </ModalHeader>
      <ModalBody>        
        이용약관에 동의하시겠습니까? 서비스를 계속 이용하려면 아래
        내용을 확인하고 동의해 주세요.        
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline" color="gray">
            취소
          </Button>
        </ModalClose>
        <ModalClose asChild>
          <Button>확인</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>

  {/* 방법 2: 외부 상태로 제어 */}
  <Button
    variant="outline"
    size="md"
    onClick={() => setLargeExternalOpen(true)}
  >
    Large 열기 (External)
  </Button>
  <Modal
    open={largeExternalOpen}
    onOpenChange={setLargeExternalOpen}
  >
    <ModalContent size="large">
      <ModalHeader>
        <ModalTitle>Title</ModalTitle>
      </ModalHeader>
      <ModalBody>        
        이용약관에 동의하시겠습니까? 서비스를 계속 이용하려면 아래 내용을
        확인하고 동의해 주세요.        
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline" color="gray">취소</Button>
        </ModalClose>
        <ModalClose asChild>
          <Button>확인</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
          `}
          >
            <div className="flex flex-wrap gap-4">
              {/* 방법 1: ModalTrigger 내부 사용 */}
              <Modal>
                <ModalTrigger asChild>
                  <Button variant="outline" size="md">
                    Large 열기 (Trigger)
                  </Button>
                </ModalTrigger>
                <ModalContent size="large">
                  <ModalHeader>
                    <ModalTitle>Title</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    이용약관에 동의하시겠습니까? 서비스를 계속 이용하려면 아래
                    내용을 확인하고 동의해 주세요.
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="outline" color="gray">
                        취소
                      </Button>
                    </ModalClose>
                    <ModalClose asChild>
                      <Button>확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* 방법 2: 외부 상태로 제어 */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setLargeExternalOpen(true)}
              >
                Large 열기 (External)
              </Button>
              <Modal open={largeExternalOpen} onOpenChange={setLargeExternalOpen}>
                <ModalContent size="large">
                  <ModalHeader>
                    <ModalTitle>Title</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    이용약관에 동의하시겠습니까? 서비스를 계속 이용하려면 아래
                    내용을 확인하고 동의해 주세요.
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="outline" color="gray">
                        취소
                      </Button>
                    </ModalClose>
                    <ModalClose asChild>
                      <Button>확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </GuideBox>

          {/* ── Full Screen ── */}
          <GuideBox
            title="Full Screen"
            description="화면 전체를 덮는 풀스크린 다이얼로그입니다. 상세 폼이나 미리보기에 활용합니다."
            code={`
  {/* 방법 1: ModalTrigger 내부 사용 */}
  <Modal>
    <ModalTrigger asChild>
      <Button variant="outline" size="md">
        Full Screen 열기 (Trigger)
      </Button>
    </ModalTrigger>
    <ModalContent size="full">
      <ModalHeader>
        <ModalTitle>Title</ModalTitle>
      </ModalHeader>
      <ModalBody>        
        풀스크린 다이얼로그의 콘텐츠 영역입니다. 긴 내용이나 폼,
        미리보기 등 충분한 공간이 필요한 경우에 활용합니다.
        
        <div className="mt-6 grid gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline" color="gray">
            취소
          </Button>
        </ModalClose>
        <ModalClose asChild>
          <Button>확인</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>

  {/* 방법 2: 외부 상태로 제어 */}
  <Button
    variant="outline"
    size="md"
    onClick={() => setFullscreenExternalOpen(true)}
  >
    Full Screen 열기 (External)
  </Button>
  <Modal
    open={fullscreenExternalOpen}
    onOpenChange={setFullscreenExternalOpen}
  >
    <ModalContent size="full">
      <ModalHeader>
        <ModalTitle>Title</ModalTitle>
      </ModalHeader>
      <ModalBody>        
        풀스크린 다이얼로그의 콘텐츠 영역입니다. 긴 내용이나 폼,
        미리보기 등 충분한 공간이 필요한 경우에 활용합니다.
        
        <div className="mt-6 grid gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <ModalClose asChild>
          <Button variant="outline" color="gray">취소</Button>
        </ModalClose>
        <ModalClose asChild>
          <Button>확인</Button>
        </ModalClose>
      </ModalFooter>
    </ModalContent>
  </Modal>
          `}
          >
            <div className="flex flex-wrap gap-4">
              {/* 방법 1: ModalTrigger 내부 사용 */}
              <Modal>
                <ModalTrigger asChild>
                  <Button variant="outline" size="md">
                    Full Screen 열기 (Trigger)
                  </Button>
                </ModalTrigger>
                <ModalContent size="full">
                  <ModalHeader>
                    <ModalTitle>Title</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    풀스크린 다이얼로그의 콘텐츠 영역입니다. 긴 내용이나 폼,
                    미리보기 등 충분한 공간이 필요한 경우에 활용합니다.
                    <div className="mt-6 grid gap-4">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div
                          key={i}
                          className="h-12 rounded-lg bg-slate-100 animate-pulse"
                        />
                      ))}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="outline" color="gray">
                        취소
                      </Button>
                    </ModalClose>
                    <ModalClose asChild>
                      <Button>확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              {/* 방법 2: 외부 상태로 제어 */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setFullscreenExternalOpen(true)}
              >
                Full Screen 열기 (External)
              </Button>
              <Modal
                open={fullscreenExternalOpen}
                onOpenChange={setFullscreenExternalOpen}
              >
                <ModalContent size="full">
                  <ModalHeader>
                    <ModalTitle>Title</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    풀스크린 다이얼로그의 콘텐츠 영역입니다. 긴 내용이나 폼,
                    미리보기 등 충분한 공간이 필요한 경우에 활용합니다.
                    <div className="mt-6 grid gap-4">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div
                          key={i}
                          className="h-12 rounded-lg bg-slate-100 animate-pulse"
                        />
                      ))}
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <ModalClose asChild>
                      <Button variant="outline" color="gray">
                        취소
                      </Button>
                    </ModalClose>
                    <ModalClose asChild>
                      <Button>확인</Button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleModalPage };
export default SampleModalPage;
