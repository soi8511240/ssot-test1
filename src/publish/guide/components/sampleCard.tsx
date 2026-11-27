import { useState } from "react";

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundSwitchControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";

const DEFAULT_TITLE = "무배당 건강보험";
const DEFAULT_DESCRIPTION = "암·뇌·심장 질환을 한 번에 보장합니다.";
const CONTENT_TEXT = "월 보험료 52,000원";
const ACTION_LABEL = "전체 보기";
const FOOTER_LABEL = "설계하기";

type CardPlaygroundValues = {
  title: string;
  description: string;
  hasDescription: boolean;
  hasAction: boolean;
  hasFooter: boolean;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  title,
  description,
  hasDescription,
  hasAction,
  hasFooter,
}: CardPlaygroundValues) {
  const descriptionLines = hasDescription
    ? `\n    <CardDescription>${description}</CardDescription>`
    : "";
  const actionLines = hasAction
    ? `\n    <CardAction>
      <Button variant="outline" size="sm" onClick={handleClickAction}>${ACTION_LABEL}</Button>
    </CardAction>`
    : "";
  const footerLines = hasFooter
    ? `\n  <CardFooter className="justify-end">
    <Button size="sm" onClick={handleClickFooter}>${FOOTER_LABEL}</Button>
  </CardFooter>`
    : "";

  return `<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>${title}</CardTitle>${descriptionLines}${actionLines}
  </CardHeader>
  <CardContent>${CONTENT_TEXT}</CardContent>${footerLines}
</Card>`;
}

/** Card Playground (이 페이지에서만 사용) */
function CardPlayground() {
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [hasDescription, setHasDescription] = useState(true);
  const [hasAction, setHasAction] = useState(false);
  const [hasFooter, setHasFooter] = useState(true);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const handleClickAction = () => {
    addEventLog("CardAction Button onClick");
  };

  const handleClickFooter = () => {
    addEventLog("CardFooter Button onClick");
  };

  const handleClickReset = () => {
    setTitle(DEFAULT_TITLE);
    setDescription(DEFAULT_DESCRIPTION);
    setHasDescription(true);
    setHasAction(false);
    setHasFooter(true);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "CardTitle",
      type: "ReactNode",
      description: "카드 제목",
      control: (
        <PlaygroundTextControl
          label="CardTitle"
          value={title}
          onValueChange={setTitle}
        />
      ),
    },
    {
      name: "CardDescription",
      type: "boolean",
      description: "제목 아래 보조 설명 사용",
      control: (
        <PlaygroundSwitchControl
          label="CardDescription"
          checked={hasDescription}
          onCheckedChange={setHasDescription}
        />
      ),
    },
    {
      name: "CardDescription children",
      type: "ReactNode",
      description: "보조 설명 글자",
      control: (
        <PlaygroundTextControl
          label="CardDescription children"
          value={description}
          onValueChange={setDescription}
          disabled={!hasDescription}
        />
      ),
    },
    {
      name: "CardAction",
      type: "boolean",
      description: "헤더 오른쪽 작은 버튼 사용 (가이드: outline · sm)",
      control: (
        <PlaygroundSwitchControl
          label="CardAction"
          checked={hasAction}
          onCheckedChange={setHasAction}
        />
      ),
    },
    {
      name: "CardFooter",
      type: "boolean",
      description: "아래 버튼 영역 사용 (가이드: sm)",
      control: (
        <PlaygroundSwitchControl
          label="CardFooter"
          checked={hasFooter}
          onCheckedChange={setHasFooter}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Card는 variant가 없는 조각 컴포넌트라, Controls에서 어떤 조각을 넣을지 고르면 미리보기와 코드가 바로 바뀝니다. 카드 안 버튼을 누르면 이벤트 로그에 남습니다."
      code={buildPlaygroundCode({
        title,
        description,
        hasDescription,
        hasAction,
        hasFooter,
      })}
      controls={controls}
      controlsNote="Card의 모든 조각은 variant·size가 없는 <div>라(docs/components/Card.md) Controls는 조각 사용 여부와 글자만 다룹니다. 테두리·배경·모서리를 바꾸는 className은 쓰지 않습니다."
      state={{
        title,
        description: hasDescription ? description : "(사용 안 함)",
        hasAction,
        hasFooter,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {hasDescription ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
          {hasAction ? (
            <CardAction>
              <Button variant="outline" size="sm" onClick={handleClickAction}>
                {ACTION_LABEL}
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent>{CONTENT_TEXT}</CardContent>
        {hasFooter ? (
          <CardFooter className="justify-end">
            <Button size="sm" onClick={handleClickFooter}>
              {FOOTER_LABEL}
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </GuidePlayground>
  );
}

function SampleCardPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Card Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<CardPlayground />}>
          <GuideBox
            title="기본 카드"
            description="제목, 설명, 본문, 푸터 영역으로 구성된 기본 카드입니다."
            code={`
<Card className="max-w-[420px]">
  <CardHeader>
    <CardTitle>프로젝트 생성</CardTitle>
    <CardDescription>새 프로젝트 기본 정보를 입력하세요.</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>...</CardFooter>
</Card>
          `}
          >
            <Card className="max-w-[420px]">
              <CardHeader>
                <CardTitle>프로젝트 생성</CardTitle>
                <CardDescription>
                  새 프로젝트 기본 정보를 입력하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Input placeholder="프로젝트명" />
                <Input placeholder="담당자 이메일" />
              </CardContent>
              <CardFooter className="justify-end">
                <Button size="sm">저장</Button>
              </CardFooter>
            </Card>
          </GuideBox>

          <GuideBox
            title="CardAction 포함 헤더"
            description="헤더 우측 액션 영역(CardAction)과 본문 목록을 함께 사용하는 예시입니다."
            code={`
<Card>
  <CardHeader>
    <CardTitle>알림</CardTitle>
    <CardAction>
      <Button variant="outline" size="sm">전체 읽음</Button>
    </CardAction>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
          `}
          >
            <Card>
              <CardHeader>
                <CardTitle>알림</CardTitle>
                <CardAction>
                  <Button variant="outline" size="sm">
                    전체 읽음
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-font-g">
                <p>신규 댓글이 등록되었습니다.</p>
                <p>배포 작업이 완료되었습니다.</p>
                <p>팀 초대 요청이 도착했습니다.</p>
              </CardContent>
            </Card>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleCardPage };
export default SampleCardPage;
