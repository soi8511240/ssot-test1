import * as React from "react";

import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";

/* -------------------------------------------------------------------------- */
/* GuideSampleTabs: 샘플 페이지를 Samples / Playground 탭으로 나눕니다.         */
/* -------------------------------------------------------------------------- */

type GuideSampleTabsProps = {
  /** Playground 탭 내용 (보통 <GuidePlayground />를 쓰는 페이지 내부 컴포넌트) */
  playground: React.ReactNode;
  /** Samples 탭 내용 (기존 GuideBox 예시들) */
  children: React.ReactNode;
  defaultTab?: "samples" | "playground";
};

function GuideSampleTabs({
  playground,
  children,
  defaultTab = "samples",
}: GuideSampleTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} type="line" className="flex flex-col gap-6">
      <TabsList aria-label="샘플 보기 방식">
        <TabsTrigger value="samples">Samples</TabsTrigger>
        <TabsTrigger value="playground">Playground</TabsTrigger>
      </TabsList>
      <TabsContent value="samples" className="flex flex-col gap-6">
        {children}
      </TabsContent>
      <TabsContent value="playground" className="flex flex-col gap-6">
        {playground}
      </TabsContent>
    </Tabs>
  );
}

/* -------------------------------------------------------------------------- */
/* GuidePlayground: 미리보기 + 코드 / Controls 표 / State(상태값·이벤트 로그)  */
/* -------------------------------------------------------------------------- */

type GuidePlaygroundControl = {
  /** Prop 이름. 예: "type", "AccordionItem disabled" */
  name: string;
  /** 타입 표기. 예: "string", "boolean" */
  type?: string;
  description?: React.ReactNode;
  /** 값을 바꾸는 입력 UI. Playground*Control 사용 권장 */
  control: React.ReactNode;
};

type GuidePlaygroundProps = {
  title?: string;
  description?: React.ReactNode;
  /** 현재 컨트롤 값으로 만든 사용 코드 */
  code: string;
  /** 미리보기 (실제 컴포넌트) */
  children: React.ReactNode;
  controls: GuidePlaygroundControl[];
  /** 현재 상태값. JSON으로 보여 줍니다. */
  state: unknown;
  /** useGuideEventLog().eventLogs */
  eventLogs?: string[];
  /** Controls 아래 안내 문구 (Controls에서 뺀 Props와 이유 등) */
  controlsNote?: React.ReactNode;
  onReset?: () => void;
};

function GuidePlayground({
  title = "Playground",
  description = "Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다.",
  code,
  children,
  controls,
  state,
  eventLogs,
  controlsNote,
  onReset,
}: GuidePlaygroundProps) {
  return (
    <>
      <GuideBox title={title} description={description} code={code}>
        {children}
      </GuideBox>

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-font-b">Controls</h2>
          {onReset ? (
            <Button type="button" variant="outline" size="sm" onClick={onReset}>
              초기화
            </Button>
          ) : null}
        </div>
        <Table type="vertical">
          <colgroup>
            <col className="w-40" />
            <col />
            <col />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>설명</TableHead>
              <TableHead>Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controls.map((item) => (
              <TableRow key={item.name}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                    {item.type ? (
                      <code className="text-sm text-font-g">{item.type}</code>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.control}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {controlsNote ? (
          <p className="text-sm text-font-g">{controlsNote}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-font-b">State</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-font-b">현재 상태값</h3>
            <pre className="overflow-x-auto rounded-lg border bg-base p-4 text-sm text-font-b">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
          {eventLogs ? (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-font-b">이벤트 로그</h3>
              <pre
                className="overflow-x-auto rounded-lg border bg-base p-4 text-sm text-font-b"
                aria-live="polite"
              >
                {eventLogs.length > 0
                  ? eventLogs.join("\n")
                  : "미리보기를 조작하면 이벤트가 표시됩니다."}
              </pre>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Controls 입력 UI                                                          */
/* -------------------------------------------------------------------------- */

type PlaygroundOption = string | { value: string; label: React.ReactNode };

function toOption(option: PlaygroundOption) {
  return typeof option === "string" ? { value: option, label: option } : option;
}

type PlaygroundRadioControlProps = {
  /** 보조기기용 이름 (보통 Prop 이름) */
  label: string;
  value: string;
  options: PlaygroundOption[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

/** 여러 값 중 하나 고르기 (variant, size, type 등) */
function PlaygroundRadioControl({
  label,
  value,
  options,
  onValueChange,
  disabled,
}: PlaygroundRadioControlProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      aria-label={label}
      className="flex flex-wrap gap-4"
    >
      {options.map(toOption).map((option) => (
        <Radio key={option.value} value={option.value} label={option.label} />
      ))}
    </RadioGroup>
  );
}

type PlaygroundSwitchControlProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** boolean 켜고 끄기 */
function PlaygroundSwitchControl({
  label,
  checked,
  onCheckedChange,
  disabled,
}: PlaygroundSwitchControlProps) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={label}
    />
  );
}

type PlaygroundCheckboxControlProps = {
  label: string;
  value: string[];
  options: PlaygroundOption[];
  onValueChange: (value: string[]) => void;
};

/** 여러 값 동시에 고르기 (string[] 값, 항목별 disabled 등) */
function PlaygroundCheckboxControl({
  label,
  value,
  options,
  onValueChange,
}: PlaygroundCheckboxControlProps) {
  return (
    <CheckboxGroup
      value={value}
      onValueChange={onValueChange}
      aria-label={label}
      className="flex flex-wrap gap-4"
    >
      {options.map(toOption).map((option) => (
        <Checkbox key={option.value} value={option.value} label={option.label} />
      ))}
    </CheckboxGroup>
  );
}

type PlaygroundTextControlProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  disabled?: boolean;
};

/** 글자·숫자 입력 (children 텍스트, placeholder, max 등) */
function PlaygroundTextControl({
  label,
  value,
  onValueChange,
  type = "text",
  placeholder,
  disabled,
}: PlaygroundTextControlProps) {
  return (
    <Input
      type={type}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={label}
      className="w-full max-w-xs"
    />
  );
}

export {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundCheckboxControl,
  PlaygroundRadioControl,
  PlaygroundSwitchControl,
  PlaygroundTextControl,
};
export type { GuidePlaygroundControl, GuidePlaygroundProps };
