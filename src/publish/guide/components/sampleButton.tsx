import { useState, type ReactNode } from "react";

import { Button, Icon } from "@/components/ui";
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

type ButtonVariant = "default" | "outline" | "text" | "ghost";
type ButtonSize = "default" | "md" | "sm";
type ButtonShape = "default" | "square";
type ButtonColor = "default" | "black" | "gray" | "grayBg";

const VARIANT_OPTIONS: ButtonVariant[] = ["default", "outline", "text", "ghost"];
const SIZE_OPTIONS: ButtonSize[] = ["default", "md", "sm"];
const SHAPE_OPTIONS: ButtonShape[] = ["default", "square"];
const NONE_VALUE = "__none__";
const DEFAULT_LABEL = "확인";
const ICON_LABEL = "검색";

/** variant별로 쓸 수 있는 color (docs/components/Button.md "쓸 수 있는 조합") */
const COLOR_OPTIONS_BY_VARIANT: Record<ButtonVariant, ButtonColor[]> = {
  default: ["default", "black"],
  outline: ["default", "gray", "grayBg"],
  text: ["default"],
  ghost: ["default"],
};

type ButtonPlaygroundValues = {
  variant: ButtonVariant;
  color: ButtonColor;
  size: ButtonSize;
  iconSize: ButtonSize | null;
  shape: ButtonShape;
  isDisabled: boolean;
  label: string;
};

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode({
  variant,
  color,
  size,
  iconSize,
  shape,
  isDisabled,
  label,
}: ButtonPlaygroundValues) {
  const props = [
    variant !== "default" ? `variant="${variant}"` : "",
    color !== "default" ? `color="${color}"` : "",
    !iconSize && variant !== "ghost" && size !== "default"
      ? `size="${size}"`
      : "",
    iconSize ? `iconSize="${iconSize}"` : "",
    shape !== "default" ? `shape="${shape}"` : "",
    isDisabled ? "disabled" : "",
    iconSize ? `aria-label="${ICON_LABEL}"` : "",
    "onClick={handleClickButton}",
  ].filter(Boolean);

  let content = label;
  if (iconSize) {
    const iconPixel = iconSize === "sm" ? 16 : 20;
    content = `\n  <Icon name="search" size={${iconPixel}} aria-hidden />\n`;
  } else if (variant === "text") {
    content = `<span className="text">${label}</span>`;
  }

  return `<Button ${props.join(" ")}>${content}</Button>`;
}

/** Button Playground (이 페이지에서만 사용) */
function ButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>("default");
  const [color, setColor] = useState<ButtonColor>("default");
  const [size, setSize] = useState<ButtonSize>("default");
  const [iconSize, setIconSize] = useState<ButtonSize | null>(null);
  const [shape, setShape] = useState<ButtonShape>("default");
  const [isDisabled, setIsDisabled] = useState(false);
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const [clickCount, setClickCount] = useState(0);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const colorOptions = COLOR_OPTIONS_BY_VARIANT[variant];
  const isIconOnly = iconSize !== null;
  // size 스타일은 ghost에는 연결되어 있지 않고(Button.module.css), iconSize가 있으면 무시됩니다.
  const isSizeApplied = !isIconOnly && variant !== "ghost";

  const handleChangeVariant = (nextValue: string) => {
    const nextVariant = nextValue as ButtonVariant;
    setVariant(nextVariant);
    // 이 variant에서 쓸 수 없는 color면 default로 되돌립니다.
    if (!COLOR_OPTIONS_BY_VARIANT[nextVariant].includes(color)) {
      setColor("default");
    }
  };

  const handleChangeIconSize = (nextValue: string) => {
    setIconSize(nextValue === NONE_VALUE ? null : (nextValue as ButtonSize));
  };

  const handleClickButton = () => {
    setClickCount((prev) => prev + 1);
    addEventLog("onClick");
  };

  const handleClickReset = () => {
    setVariant("default");
    setColor("default");
    setSize("default");
    setIconSize(null);
    setShape("default");
    setIsDisabled(false);
    setLabel(DEFAULT_LABEL);
    setClickCount(0);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "variant",
      type: '"default" | "outline" | "text" | "ghost"',
      description: "모양",
      control: (
        <PlaygroundRadioControl
          label="variant"
          value={variant}
          options={VARIANT_OPTIONS}
          onValueChange={handleChangeVariant}
        />
      ),
    },
    {
      name: "color",
      type: '"default" | "black" | "gray" | "grayBg"',
      description:
        "색. 가이드에 있는 조합만 고를 수 있습니다 (default: black / outline: gray·grayBg / text·ghost: default만)",
      control: (
        <PlaygroundRadioControl
          label="color"
          value={color}
          options={colorOptions}
          onValueChange={(nextValue) => setColor(nextValue as ButtonColor)}
          disabled={colorOptions.length < 2}
        />
      ),
    },
    {
      name: "size",
      type: '"default" | "md" | "sm"',
      description:
        "글자 버튼 크기 (높이 48 / 40 / 32). iconSize를 지정했거나 ghost일 때는 적용되지 않습니다",
      control: (
        <PlaygroundRadioControl
          label="size"
          value={size}
          options={SIZE_OPTIONS}
          onValueChange={(nextValue) => setSize(nextValue as ButtonSize)}
          disabled={!isSizeApplied}
        />
      ),
    },
    {
      name: "iconSize",
      type: '"default" | "md" | "sm"',
      description:
        "아이콘 전용 버튼 크기 (40 / 36 / 28 정사각형). 지정하면 아이콘만 표시하고 aria-label을 붙입니다",
      control: (
        <PlaygroundRadioControl
          label="iconSize"
          value={iconSize ?? NONE_VALUE}
          options={[{ value: NONE_VALUE, label: "없음" }, ...SIZE_OPTIONS]}
          onValueChange={handleChangeIconSize}
        />
      ),
    },
    {
      name: "shape",
      type: '"default" | "square"',
      description: "둥근형 / 각진형",
      control: (
        <PlaygroundRadioControl
          label="shape"
          value={shape}
          options={SHAPE_OPTIONS}
          onValueChange={(nextValue) => setShape(nextValue as ButtonShape)}
        />
      ),
    },
    {
      name: "disabled",
      type: "boolean",
      description: "사용할 수 없는 상태",
      control: (
        <PlaygroundSwitchControl
          label="disabled"
          checked={isDisabled}
          onCheckedChange={setIsDisabled}
        />
      ),
    },
    {
      name: "children",
      type: "ReactNode",
      description: "버튼 글자 (iconSize를 지정하면 아이콘으로 바뀝니다)",
      control: (
        <PlaygroundTextControl
          label="children"
          value={label}
          onValueChange={setLabel}
          disabled={isIconOnly}
        />
      ),
    },
  ];

  let buttonContent: ReactNode = label;
  if (isIconOnly) {
    buttonContent = (
      <Icon name="search" size={iconSize === "sm" ? 16 : 20} aria-hidden />
    );
  } else if (variant === "text") {
    buttonContent = <span className="text">{label}</span>;
  }

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기 버튼을 누르면 onClick이 이벤트 로그에 남습니다."
      code={buildPlaygroundCode({
        variant,
        color,
        size,
        iconSize,
        shape,
        isDisabled,
        label,
      })}
      controls={controls}
      controlsNote="destructive·secondary·link variant는 코드에서 주석 처리되어 있어 넣지 않았습니다. type(기본 button)과 asChild는 모양이 아니라 폼 제출·링크 용도라 Controls에서 뺐습니다(docs/components/Button.md)."
      state={{
        variant,
        color,
        size: isSizeApplied ? size : "(적용 안 됨)",
        iconSize: iconSize ?? "(없음)",
        shape,
        disabled: isDisabled,
        children: isIconOnly ? '<Icon name="search" />' : label,
        clickCount,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <Button
        variant={variant}
        color={color}
        size={size}
        iconSize={iconSize}
        shape={shape}
        disabled={isDisabled}
        aria-label={isIconOnly ? ICON_LABEL : undefined}
        onClick={handleClickButton}
      >
        {buttonContent}
      </Button>
    </GuidePlayground>
  );
}

function SampleButtonPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Button Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<ButtonPlayground />}>
          <GuideBox
            title="Variants : defalut"
            description="기본 버튼의 size와 square shape 조합을 확인합니다."
            code={`
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default</div>
    <div className="gap-2 flex">
      <Button>Button</Button>
      <Button disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md</div>
    <div className="gap-2 flex">
      <Button size="md">Button</Button>
      <Button size="md" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm</div>
    <div className="gap-2 flex">
      <Button size="sm">Button</Button>
      <Button size="sm" disabled>Button</Button>
    </div>
  </div>
</div>
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default + shape: square</div>
    <div className="gap-2 flex">
      <Button shape="square">Button</Button>
      <Button shape="square" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md + shape: square</div>
    <div className="gap-2 flex">
      <Button size="md" shape="square">Button</Button>
      <Button size="md" shape="square" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm + shape: square</div>
    <div className="gap-2 flex">
      <Button size="sm" shape="square">Button</Button>
      <Button size="sm" shape="square" disabled>Button</Button>
    </div>
  </div>
</div>
        `}
          >
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">Sizes: default</div>
                <div className="gap-2 flex">
                  <Button>Button</Button>
                  <Button disabled>Button</Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: md</div>
                <div className="gap-2 flex">
                  <Button size="md">Button</Button>
                  <Button size="md" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: sm</div>
                <div className="gap-2 flex">
                  <Button size="sm">Button</Button>
                  <Button size="sm" disabled>
                    Button
                  </Button>
                </div>
              </div>
            </div>
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: default + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button shape="square">Button</Button>
                  <Button shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: md + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button size="md" shape="square">
                    Button
                  </Button>
                  <Button size="md" shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: sm + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button size="sm" shape="square">
                    Button
                  </Button>
                  <Button size="sm" shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Variants : defalut + color:black"
            description="기본 variant에 검정 색상 옵션을 적용한 케이스입니다."
            code={`
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default</div>
    <div className="gap-2 flex">
      <Button color="black">Button</Button>
      <Button color="black" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md</div>
    <div className="gap-2 flex">
      <Button color="black" size="md">Button</Button>
      <Button color="black" size="md" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm</div>
    <div className="gap-2 flex">
      <Button color="black" size="sm">Button</Button>
      <Button color="black" size="sm" disabled>Button</Button>
    </div>
  </div>
</div>
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default + shape: square</div>
    <div className="gap-2 flex">
      <Button color="black" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button color="black" shape="square" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md + shape: square</div>
    <div className="gap-2 flex">
      <Button color="black" size="md" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button color="black" size="md" shape="square" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm + shape: square</div>
    <div className="gap-2 flex">
      <Button color="black" size="sm" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button color="black" size="sm" shape="square" disabled>Button</Button>
    </div>
  </div>
</div>
        `}
          >
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">Sizes: default</div>
                <div className="gap-2 flex">
                  <Button color="black">Button</Button>
                  <Button color="black" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: md</div>
                <div className="gap-2 flex">
                  <Button color="black" size="md">
                    Button
                  </Button>
                  <Button color="black" size="md" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: sm</div>
                <div className="gap-2 flex">
                  <Button color="black" size="sm">
                    Button
                  </Button>
                  <Button color="black" size="sm" disabled>
                    Button
                  </Button>
                </div>
              </div>
            </div>
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: default + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button color="black" shape="square">
                    Button
                  </Button>
                  <Button color="black" shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: md + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button color="black" size="md" shape="square">
                    Button
                  </Button>
                  <Button color="black" size="md" shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: sm + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button color="black" size="sm" shape="square">
                    Button
                  </Button>
                  <Button color="black" size="sm" shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Variants : outline"
            description="테두리형 outline 버튼의 size와 shape 조합입니다."
            code={`
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default</div>
    <div className="gap-2 flex">
      <Button variant="outline">Button</Button>
      <Button variant="outline" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md</div>
    <div className="gap-2 flex">
      <Button variant="outline" size="md">Button</Button>
      <Button variant="outline" size="md" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm</div>
    <div className="gap-2 flex">
      <Button variant="outline" size="sm">Button</Button>
      <Button variant="outline" size="sm" disabled>Button</Button>
    </div>
  </div>
</div>
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default + shape: square</div>
    <div className="gap-2 flex">
      <Button variant="outline" shape="square">Button</Button>
      <Button variant="outline" shape="square" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md + shape: square</div>
    <div className="gap-2 flex">
      <Button variant="outline" size="md" shape="square">Button</Button>
      <Button variant="outline" size="md" shape="square" disabled>Button</Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm + shape: square</div>
    <div className="gap-2 flex">
      <Button variant="outline" size="sm" shape="square">Button</Button>
      <Button variant="outline" size="sm" shape="square" disabled>Button</Button>
    </div>
  </div>
</div>
        `}
          >
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">Sizes: default</div>
                <div className="gap-2 flex">
                  <Button variant="outline">Button</Button>
                  <Button variant="outline" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: md</div>
                <div className="gap-2 flex">
                  <Button variant="outline" size="md">
                    Button
                  </Button>
                  <Button variant="outline" size="md" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: sm</div>
                <div className="gap-2 flex">
                  <Button variant="outline" size="sm">
                    Button
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Button
                  </Button>
                </div>
              </div>
            </div>
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: default + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" shape="square">
                    Button
                  </Button>
                  <Button variant="outline" shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: md + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" size="md" shape="square">
                    Button
                  </Button>
                  <Button variant="outline" size="md" shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: sm + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" size="sm" shape="square">
                    Button
                  </Button>
                  <Button variant="outline" size="sm" shape="square" disabled>
                    Button
                  </Button>
                </div>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Variants : outline + color:gray"
            description="outline variant에 gray, grayBg 컬러를 더한 확장형 케이스입니다."
            code={`
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray">
        <Icon name="user-settings" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="gray" disabled>
        <Icon name="user-settings" />
        <span>Button</span>
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray" size="md">
        <Icon name="user-settings" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="gray" size="md" disabled>
        <Icon name="user-settings" />
        <span>Button</span>
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray" size="sm">
        <Icon name="user-settings" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="gray" size="sm" disabled>
        <Icon name="user-settings" />
        <span>Button</span>
      </Button>
    </div>
  </div>
</div>
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default + shape: square</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="gray" shape="square" disabled>
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md + shape: square</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray" size="md" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="gray" size="md" shape="square" disabled>
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm + shape: square</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray" size="sm" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="gray" size="sm" shape="square" disabled>
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
    </div>
  </div>
</div>
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default + shape: square + color:grayBg</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="grayBg" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="grayBg" shape="square" disabled>
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md + shape: square + color:grayBg</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="grayBg" size="md" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="grayBg" size="md" shape="square" disabled>
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm + shape: square + color:grayBg</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="grayBg" size="sm" shape="square">
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
      <Button variant="outline" color="grayBg" size="sm" shape="square" disabled>
        <Icon name="arrow-left-right" />
        <span>Button</span>
      </Button>
    </div>
  </div>
</div>
        `}
          >
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">Sizes: default</div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray">
                    <Icon name="user-settings" />
                    <span>Button</span>
                  </Button>
                  <Button variant="outline" color="gray" disabled>
                    <Icon name="user-settings" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: md</div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray" size="md">
                    <Icon name="user-settings" />
                    <span>Button</span>
                  </Button>
                  <Button variant="outline" color="gray" size="md" disabled>
                    <Icon name="user-settings" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: sm</div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray" size="sm">
                    <Icon name="user-settings" />
                    <span>Button</span>
                  </Button>
                  <Button variant="outline" color="gray" size="sm" disabled>
                    <Icon name="user-settings" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: default + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray" shape="square">
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                  <Button variant="outline" color="gray" shape="square" disabled>
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: md + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray" size="md" shape="square">
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                  <Button
                    variant="outline"
                    color="gray"
                    size="md"
                    shape="square"
                    disabled
                  >
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: sm + shape: square
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray" size="sm" shape="square">
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                  <Button
                    variant="outline"
                    color="gray"
                    size="sm"
                    shape="square"
                    disabled
                  >
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: default + shape: square + color:grayBg
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="grayBg" shape="square">
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                  <Button
                    variant="outline"
                    color="grayBg"
                    shape="square"
                    disabled
                  >
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: md + shape: square + color:grayBg
                </div>
                <div className="gap-2 flex">
                  <Button
                    variant="outline"
                    color="grayBg"
                    size="md"
                    shape="square"
                  >
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                  <Button
                    variant="outline"
                    color="grayBg"
                    size="md"
                    shape="square"
                    disabled
                  >
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: sm + shape: square + color:grayBg
                </div>
                <div className="gap-2 flex">
                  <Button
                    variant="outline"
                    color="grayBg"
                    size="sm"
                    shape="square"
                  >
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                  <Button
                    variant="outline"
                    color="grayBg"
                    size="sm"
                    shape="square"
                    disabled
                  >
                    <Icon name="arrow-left-right" />
                    <span>Button</span>
                  </Button>
                </div>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Variants : outline + color:gray + iconOnly"
            description="텍스트 없이 아이콘만 표시하는 사각 outline 버튼 예시입니다."
            code={`
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default + shape: square + color:gray</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray" shape="square">
        <Icon name="arrow-left-right" />
      </Button>
      <Button variant="outline" color="gray" shape="square" disabled>
        <Icon name="arrow-left-right" />
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md + shape: square + color:gray</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray" size="md" shape="square">
        <Icon name="arrow-left-right" />
      </Button>
      <Button variant="outline" color="gray" size="md" shape="square" disabled>
        <Icon name="arrow-left-right" />
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm + shape: square + color:gray</div>
    <div className="gap-2 flex">
      <Button variant="outline" color="gray" size="sm" shape="square">
        <Icon name="arrow-left-right" />
      </Button>
      <Button variant="outline" color="gray" size="sm" shape="square" disabled>
        <Icon name="arrow-left-right" />
      </Button>
    </div>
  </div>
</div>
        `}
          >
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: default + shape: square + color:gray
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray" shape="square">
                    <Icon name="arrow-left-right" />
                  </Button>
                  <Button variant="outline" color="gray" shape="square" disabled>
                    <Icon name="arrow-left-right" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: md + shape: square + color:gray
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray" size="md" shape="square">
                    <Icon name="arrow-left-right" />
                  </Button>
                  <Button
                    variant="outline"
                    color="gray"
                    size="md"
                    shape="square"
                    disabled
                  >
                    <Icon name="arrow-left-right" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">
                  Sizes: sm + shape: square + color:gray
                </div>
                <div className="gap-2 flex">
                  <Button variant="outline" color="gray" size="sm" shape="square">
                    <Icon name="arrow-left-right" />
                  </Button>
                  <Button
                    variant="outline"
                    color="gray"
                    size="sm"
                    shape="square"
                    disabled
                  >
                    <Icon name="arrow-left-right" />
                  </Button>
                </div>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Variants : text"
            description="배경 없이 텍스트 액션처럼 쓰는 버튼 스타일입니다."
            code={`
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default</div>
    <div className="gap-2 flex">
      <Button variant="text">
        <Icon name="arrow-left-right" size={16} />
        <span className="text">button</span>
      </Button>
      <Button variant="text" disabled>
        <Icon name="arrow-left-right" />
        <span className="text">button</span>
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: md</div>
    <div className="gap-2 flex">
      <Button variant="text" size="md">
        <Icon name="arrow-left-right" />
        <span className="text">button</span>
      </Button>
      <Button variant="text" size="md" disabled>
        <Icon name="arrow-left-right" />
        <span className="text">button</span>
      </Button>
    </div>
  </div>
  <div>
    <div className="mb-1.5 text-font-g">Sizes: sm</div>
    <div className="gap-2 flex">
      <Button variant="text" size="sm">
        <Icon name="arrow-left-right" />
        <span className="text">button</span>
      </Button>
      <Button variant="text" size="sm" disabled>
        <Icon name="arrow-left-right" />
        <span className="text">button</span>
      </Button>
    </div>
  </div>
</div>
        `}
          >
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">Sizes: default</div>
                <div className="gap-2 flex">
                  <Button variant="text">
                    <Icon name="arrow-left-right" size={16} />
                    <span className="text">button</span>
                  </Button>
                  <Button variant="text" disabled>
                    <Icon name="arrow-left-right" />
                    <span className="text">button</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: md</div>
                <div className="gap-2 flex">
                  <Button variant="text" size="md">
                    <Icon name="arrow-left-right" />
                    <span className="text">button</span>
                  </Button>
                  <Button variant="text" size="md" disabled>
                    <Icon name="arrow-left-right" />
                    <span className="text">button</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-font-g">Sizes: sm</div>
                <div className="gap-2 flex">
                  <Button variant="text" size="sm">
                    <Icon name="arrow-left-right" />
                    <span className="text">button</span>
                  </Button>
                  <Button variant="text" size="sm" disabled>
                    <Icon name="arrow-left-right" />
                    <span className="text">button</span>
                  </Button>
                </div>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="Variants : ghost"
            description="아이콘 액션에 어울리는 원형 ghost 버튼 케이스입니다."
            code={`
<div className="gap-12 flex">
  <div>
    <div className="mb-1.5 text-font-g">Sizes: default</div>
    <div className="gap-2 flex">
      <Button
        variant="ghost"
        className="size-12 rounded-full hover:bg-box"
      >
        <Icon name="arrow-left-right" size={24} />
      </Button>
    </div>
  </div>
</div>
        `}
          >
            <div className="gap-12 flex">
              <div>
                <div className="mb-1.5 text-font-g">Sizes: default</div>
                <div className="gap-2 flex">
                  <Button
                    variant="ghost"
                    className="size-12 rounded-full hover:bg-box"
                  >
                    <Icon name="arrow-left-right" size={24} />
                  </Button>
                </div>
              </div>
            </div>
          </GuideBox>

          <GuideBox
            title="iconSize : 아이콘 전용 버튼"
            description="아이콘만 있는 정사각형 버튼 크기입니다. 글자 버튼 크기(size)와 별도 Props이며, iconSize를 지정하면 size는 적용되지 않습니다. aria-label은 필수입니다."
            code={`
<div className="gap-2 flex items-center">
  <Button variant="outline" color="gray" iconSize="default" aria-label="검색">
    <Icon name="search" size={20} aria-hidden />
  </Button>
  <Button variant="outline" color="gray" iconSize="md" aria-label="검색">
    <Icon name="search" size={20} aria-hidden />
  </Button>
  <Button variant="outline" color="gray" iconSize="sm" aria-label="검색">
    <Icon name="search" size={16} aria-hidden />
  </Button>
</div>
        `}
          >
            <div className="gap-2 flex items-center">
              <Button variant="outline" color="gray" iconSize="default" aria-label="검색">
                <Icon name="search" size={20} aria-hidden />
              </Button>
              <Button variant="outline" color="gray" iconSize="md" aria-label="검색">
                <Icon name="search" size={20} aria-hidden />
              </Button>
              <Button variant="outline" color="gray" iconSize="sm" aria-label="검색">
                <Icon name="search" size={16} aria-hidden />
              </Button>
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleButtonPage };
export default SampleButtonPage;
