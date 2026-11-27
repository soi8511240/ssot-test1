import { useState } from "react";

import { Icon } from "@/components/ui/Icon/Icon";
import {
  iconNames,
  sizeMap,
  type IconName,
  type SizeToken,
} from "@/components/ui/Icon/Icon.types";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";

type IconSizeMode = SizeToken | "number";

const SIZE_MODES: IconSizeMode[] = ["sm", "md", "lg", "number"];
const DEFAULT_ICON_NAME: IconName = "search";
const DEFAULT_NUMBER_SIZE = "32";

/** 숫자 크기 입력값을 px 숫자로 바꿉니다. 올바르지 않으면 undefined */
function parseNumberSize(sizeText: string) {
  const parsed = Number(sizeText);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  iconName: IconName,
  sizeMode: IconSizeMode,
  numberSize: number | undefined,
  ariaLabel: string,
) {
  let sizeProp = "";
  if (sizeMode === "number") {
    sizeProp = numberSize ? ` size={${numberSize}}` : "";
  } else if (sizeMode !== "md") {
    sizeProp = ` size="${sizeMode}"`;
  }
  const a11yProps = ariaLabel
    ? ` role="img" aria-label="${ariaLabel}"`
    : " aria-hidden";

  return `<Icon name="${iconName}"${sizeProp}${a11yProps} />`;
}

/** Icon Playground (이 페이지에서만 사용) */
function IconPlayground() {
  const [iconName, setIconName] = useState<IconName>(DEFAULT_ICON_NAME);
  const [sizeMode, setSizeMode] = useState<IconSizeMode>("md");
  const [numberSizeText, setNumberSizeText] = useState(DEFAULT_NUMBER_SIZE);
  const [ariaLabel, setAriaLabel] = useState("");

  const isNumberSize = sizeMode === "number";
  const numberSize = parseNumberSize(numberSizeText);
  const iconSize: SizeToken | number = isNumberSize
    ? (numberSize ?? "md")
    : sizeMode;
  const renderedSize =
    typeof iconSize === "number" ? iconSize : sizeMap[iconSize];

  const handleClickReset = () => {
    setIconName(DEFAULT_ICON_NAME);
    setSizeMode("md");
    setNumberSizeText(DEFAULT_NUMBER_SIZE);
    setAriaLabel("");
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "name",
      type: "IconName",
      description: "src/assets/icons/{name}.svg 파일 이름 (필수)",
      control: (
        <PlaygroundRadioControl
          label="name"
          value={iconName}
          options={iconNames}
          onValueChange={(next) => setIconName(next as IconName)}
        />
      ),
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | number',
      description: "sm(16) · md(24, 기본) · lg(48) 또는 숫자(px)",
      control: (
        <div className="flex flex-col gap-2">
          <PlaygroundRadioControl
            label="size"
            value={sizeMode}
            options={SIZE_MODES.map((mode) =>
              mode === "number" ? { value: mode, label: "숫자(px)" } : mode,
            )}
            onValueChange={(next) => setSizeMode(next as IconSizeMode)}
          />
          <PlaygroundTextControl
            label="size 숫자(px)"
            type="number"
            value={numberSizeText}
            onValueChange={setNumberSizeText}
            disabled={!isNumberSize}
          />
        </div>
      ),
    },
    {
      name: "aria-label",
      type: "string",
      description:
        '아이콘만으로 뜻을 전할 때 role="img"와 함께 붙입니다. 비우면 꾸밈 아이콘으로 보고 aria-hidden을 붙입니다.',
      control: (
        <PlaygroundTextControl
          label="aria-label"
          value={ariaLabel}
          onValueChange={setAriaLabel}
          placeholder="예: 가입가능"
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. Icon은 누를 수 있는 기능이 없어 이벤트 로그가 없습니다."
      code={buildPlaygroundCode(iconName, sizeMode, numberSize, ariaLabel)}
      controls={controls}
      controlsNote="className으로 크기·색을 바꾸는 것은 금지(docs/components/Icon.md)라 Controls에 넣지 않았습니다. 색은 svg 파일에 들어 있습니다."
      state={{
        name: iconName,
        size: iconSize,
        renderedPx: renderedSize,
        a11y: ariaLabel
          ? { role: "img", "aria-label": ariaLabel }
          : { "aria-hidden": true },
      }}
      onReset={handleClickReset}
    >
      {ariaLabel ? (
        <Icon name={iconName} size={iconSize} role="img" aria-label={ariaLabel} />
      ) : (
        <Icon name={iconName} size={iconSize} aria-hidden />
      )}
    </GuidePlayground>
  );
}

function SampleIconPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Icon Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<IconPlayground />}>
        <GuideBox
          title="전체 아이콘"
          description="src/assets/icons/ 폴더에 있는 모든 아이콘 목록입니다."
          code={`
            sm / 16, md / 24, lg / 48 
<Icon name="search" size="md" />
<Icon name="search" size={16} />
          `}
        >
          <div className="flex flex-wrap gap-6">
            {iconNames.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 border hover:border-line02"
              >
                <Icon name={name} className="hover:text-primary" />
                <span className="text-xs text-font-g font-mono">{name}</span>
              </div>
            ))}
          </div>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleIconPage };
export default SampleIconPage;
