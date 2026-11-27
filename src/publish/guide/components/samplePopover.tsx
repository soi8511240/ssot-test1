import { useState } from "react";

import {
  Button,
  POPOVER_PLACEMENTS,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  type PopoverPlacement,
} from "@/components/ui";
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

type PopoverSize = "sm" | "md" | "lg";

const POPOVER_SIZES: PopoverSize[] = ["sm", "md", "lg"];
const DEFAULT_PLACEMENT: PopoverPlacement = "bottom";
const DEFAULT_SIZE: PopoverSize = "md";
const DEFAULT_SIDE_OFFSET = "4";
const DEFAULT_TITLE = "알림";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  isModal: boolean,
  placement: PopoverPlacement,
  size: PopoverSize,
  sideOffset: string,
  title: string,
) {
  const modalProp = isModal ? " modal" : "";
  const contentProps = [
    placement !== DEFAULT_PLACEMENT ? ` placement="${placement}"` : "",
    size !== DEFAULT_SIZE ? ` size="${size}"` : "",
    sideOffset !== DEFAULT_SIDE_OFFSET && sideOffset !== ""
      ? ` sideOffset={${Number(sideOffset)}}`
      : "",
  ].join("");

  return `const [open, setOpen] = useState(false);

<Popover open={open} onOpenChange={setOpen}${modalProp}>
  <PopoverTrigger asChild>
    <Button variant="outline" type="button">
      열기
    </Button>
  </PopoverTrigger>
  <PopoverContent${contentProps}>
    <PopoverHeader>
      <PopoverTitle>${title}</PopoverTitle>
      <PopoverDescription>
        Popover 본문입니다. 바깥을 클릭하면 닫힙니다.
      </PopoverDescription>
    </PopoverHeader>
    <PopoverClose asChild>
      <Button className="mt-4" size="sm" type="button">
        닫기
      </Button>
    </PopoverClose>
  </PopoverContent>
</Popover>`;
}

/** Popover Playground (이 페이지에서만 사용) */
function PopoverPlayground() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [placement, setPlacement] =
    useState<PopoverPlacement>(DEFAULT_PLACEMENT);
  const [size, setSize] = useState<PopoverSize>(DEFAULT_SIZE);
  const [sideOffset, setSideOffset] = useState(DEFAULT_SIDE_OFFSET);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const sideOffsetNumber = Number(sideOffset) || 0;

  const handleChangePopoverOpen = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
    addEventLog("onOpenChange", nextOpen);
  };

  const handleClickReset = () => {
    setIsOpen(false);
    setIsModal(false);
    setPlacement(DEFAULT_PLACEMENT);
    setSize(DEFAULT_SIZE);
    setSideOffset(DEFAULT_SIDE_OFFSET);
    setTitle(DEFAULT_TITLE);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "open",
      type: "boolean",
      description: "열림 여부 (onOpenChange와 함께 제어형)",
      control: (
        <PlaygroundSwitchControl
          label="open"
          checked={isOpen}
          onCheckedChange={setIsOpen}
        />
      ),
    },
    {
      name: "modal",
      type: "boolean",
      description: "열려 있는 동안 바깥 요소와의 상호작용을 막고 포커스를 가둡니다.",
      control: (
        <PlaygroundSwitchControl
          label="modal"
          checked={isModal}
          onCheckedChange={setIsModal}
        />
      ),
    },
    {
      name: "PopoverContent placement",
      type: "PopoverPlacement",
      description: "트리거 기준 뜨는 방향·정렬 (side·align보다 우선)",
      control: (
        <PlaygroundRadioControl
          label="placement"
          value={placement}
          options={[...POPOVER_PLACEMENTS]}
          onValueChange={(next) => setPlacement(next as PopoverPlacement)}
        />
      ),
    },
    {
      name: "PopoverContent size",
      type: '"sm" | "md" | "lg"',
      description: "패널 너비·안쪽 여백·글자 크기",
      control: (
        <PlaygroundRadioControl
          label="size"
          value={size}
          options={POPOVER_SIZES}
          onValueChange={(next) => setSize(next as PopoverSize)}
        />
      ),
    },
    {
      name: "PopoverContent sideOffset",
      type: "number",
      description: "트리거와 패널 사이 거리(px). 기본 4",
      control: (
        <PlaygroundTextControl
          label="sideOffset"
          type="number"
          value={sideOffset}
          onValueChange={setSideOffset}
        />
      ),
    },
    {
      name: "PopoverTitle children",
      type: "ReactNode",
      description: "패널 제목 텍스트",
      control: (
        <PlaygroundTextControl
          label="PopoverTitle children"
          value={title}
          onValueChange={setTitle}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 열고 닫아도 Controls의 open이 함께 바뀝니다(제어형)."
      code={buildPlaygroundCode(isModal, placement, size, sideOffset, title)}
      controls={controls}
      controlsNote="variant는 default 하나뿐이고 연결된 스타일이 없어 Controls에 넣지 않았습니다. container는 DOM 노드·셀렉터를 넘기는 값이라 Samples 탭의 Portal container 예시를 참고하세요."
      state={{
        open: isOpen,
        modal: isModal,
        placement,
        size,
        sideOffset: sideOffsetNumber,
        title,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="flex w-full justify-center p-6">
        <Popover open={isOpen} onOpenChange={handleChangePopoverOpen} modal={isModal}>
          <PopoverTrigger asChild>
            <Button variant="outline" type="button">
              열기
            </Button>
          </PopoverTrigger>
          <PopoverContent
            placement={placement}
            size={size}
            sideOffset={sideOffsetNumber}
          >
            <PopoverHeader>
              <PopoverTitle>{title}</PopoverTitle>
              <PopoverDescription>
                Popover 본문입니다. 바깥을 클릭하면 닫힙니다.
              </PopoverDescription>
            </PopoverHeader>
            <PopoverClose asChild>
              <Button className="mt-4" size="sm" type="button">
                닫기
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
    </GuidePlayground>
  );
}

function SamplePopoverPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Popover Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<PopoverPlayground />}>
        <GuideBox
          title="기본 Popover"
          description="트리거 클릭 시 열리는 플로팅 패널입니다. `container`를 생략하면 Portal을 쓰지 않고, `PopoverTrigger` 바로 다음 형제로 DOM에 붙습니다."
          code={`
import {
  Button,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui";

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" type="button">
      열기
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>알림</PopoverTitle>
      <PopoverDescription>
        Popover 본문입니다. 바깥을 클릭하면 닫힙니다.
      </PopoverDescription>
    </PopoverHeader>
  </PopoverContent>
</Popover>
          `}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" type="button">
                열기
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>알림</PopoverTitle>
                <PopoverDescription>
                  Popover 본문입니다. 바깥을 클릭하면 닫힙니다.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </GuideBox>

        <GuideBox
          title="placement (트리거 기준 뜨는 위치)"
          description='PopoverContent에 placement="bottom-start"처럼 지정하면 트리거 기준 방향·정렬이 한 번에 설정됩니다. side·align을 직접 넘길 수도 있으며, placement가 있으면 우선합니다. (기본은 트리거 다음 DOM; 다른 노드로 Portal 하려면 아래 container 섹션)'
          code={`
import {
  Button,
  POPOVER_PLACEMENTS,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui";

<div className="flex max-w-4xl flex-wrap gap-2">
  {POPOVER_PLACEMENTS.map((placement) => (
    <Popover key={placement}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" type="button">
          {placement}
        </Button>
      </PopoverTrigger>
      <PopoverContent placement={placement} sideOffset={6}>
        <PopoverHeader>
          <PopoverTitle className="text-sm">{placement}</PopoverTitle>
          <PopoverDescription>
            placement prop으로 트리거 기준 위치를 지정했습니다.
          </PopoverDescription>
        </PopoverHeader>
        <PopoverClose asChild>
          <Button className="mt-3" size="sm" type="button">
            닫기
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  ))}
</div>

// 또는 side / align 직접
<PopoverContent side="left" align="start" sideOffset={6}>
  ...
</PopoverContent>
          `}
        >
          <div className="flex max-w-4xl flex-wrap gap-2">
            {POPOVER_PLACEMENTS.map((placement) => (
              <Popover key={placement}>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" type="button">
                    {placement}
                  </Button>
                </PopoverTrigger>
                <PopoverContent placement={placement} sideOffset={6}>
                  <PopoverHeader>
                    <PopoverTitle className="text-sm">{placement}</PopoverTitle>
                    <PopoverDescription>
                      placement prop으로 트리거 기준 위치를 지정했습니다.
                    </PopoverDescription>
                  </PopoverHeader>
                  <PopoverClose asChild>
                    <Button className="mt-3" size="sm" type="button">
                      닫기
                    </Button>
                  </PopoverClose>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </GuideBox>

        <GuideBox
          title="Portal container (선택)"
          description="기본은 Portal 없이 트리거 다음에 렌더됩니다. `container`에 노드를 넘기면 그때만 해당 요소 안으로 Portal 합니다. (예: 스크롤 박스·모달 루트·document.body)"
          code={`
import * as React from "react";
import {
  Button,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui";

<div
  className="relative min-h-48 overflow-auto rounded-xl border border-line02 bg-container p-4"
>
  <p className="mb-3 text-sm text-font-g">
    아래 버튼의 Popover는 이 박스 DOM 안에만 Portal 됩니다.
  </p>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="sm" type="button">
        이 영역 안에 열기
      </Button>
    </PopoverTrigger>
    <PopoverContent container="#aaa">
      <PopoverHeader>
        <PopoverTitle>Portal 대상 영역 내부</PopoverTitle>
        <PopoverDescription>
          container prop으로 이 회색 박스에 마운트했습니다.
        </PopoverDescription>
      </PopoverHeader>
      <PopoverClose asChild>
        <Button className="mt-3" size="sm" type="button">
          닫기
        </Button>
      </PopoverClose>
    </PopoverContent>
  </Popover>
</div>
          `}
        >
          <div className="flex max-w-4xl flex-col gap-4" id="aaa">
            <div className="relative min-h-48 overflow-auto rounded-xl border border-line02 bg-container p-4">
              <p className="mb-3 text-sm text-font-g">
                아래 버튼의 Popover는 이 박스 DOM 안에만 Portal 됩니다.
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" type="button">
                    이 영역 안에 열기
                  </Button>
                </PopoverTrigger>
                <PopoverContent container="#aaa">
                  <PopoverHeader>
                    <PopoverTitle>Portal 대상 영역 내부</PopoverTitle>
                    <PopoverDescription>
                      container prop으로 이 회색 박스에 마운트했습니다.
                    </PopoverDescription>
                  </PopoverHeader>
                  <PopoverClose asChild>
                    <Button className="mt-3" size="sm" type="button">
                      닫기
                    </Button>
                  </PopoverClose>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </GuideBox>

        <GuideBox
          title="크기 (size)"
          description="PopoverContent의 size는 sm / md / lg 입니다."
          code={`
import {
  Button,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui";

<div className="flex flex-wrap gap-4">
  {(["sm", "md", "lg"] as const).map((size) => (
    <Popover key={size}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          size: {size}
        </Button>
      </PopoverTrigger>
      <PopoverContent size={size}>
        <PopoverHeader>
          <PopoverTitle>크기 {size}</PopoverTitle>
          <PopoverDescription>
            width·padding이 사이즈별로 달라집니다.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ))}
</div>
          `}
        >
          <div className="flex flex-wrap gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
              <Popover key={size}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" type="button">
                    size: {size}
                  </Button>
                </PopoverTrigger>
                <PopoverContent size={size}>
                  <PopoverHeader>
                    <PopoverTitle>크기 {size}</PopoverTitle>
                    <PopoverDescription>
                      width·padding이 사이즈별로 달라집니다.
                    </PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SamplePopoverPage };
export default SamplePopoverPage;
