import { useState } from "react";

import { Chip, Icon } from "@/components/ui";
import type { IconName } from "@/components/ui/Icon/Icon.types";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  PlaygroundTextControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";

const colors = ["blue", "green", "yellow", "red", "purple", "gray"] as const;

type ChipVariant = "tint" | "solid" | "stateYes" | "stateNo" | "iconData";
type ChipColor = (typeof colors)[number];

const CHIP_VARIANTS: ChipVariant[] = [
  "tint",
  "solid",
  "stateYes",
  "stateNo",
  "iconData",
];

/** variant별로 함께 쓰는 아이콘 (docs/components/Chip.md "쓸 수 있는 조합") */
const VARIANT_ICON: Partial<Record<ChipVariant, IconName>> = {
  stateYes: "checkbox-circle-fill",
  stateNo: "error-warning-fill",
  iconData: "attachment",
};

const DEFAULT_CHIP_TEXT = "신상품";

/** color는 tint·solid에서만 씁니다. */
function hasChipColor(variant: ChipVariant) {
  return variant === "tint" || variant === "solid";
}

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  variant: ChipVariant,
  color: ChipColor,
  chipText: string,
) {
  const variantProp = variant === "tint" ? "" : ` variant="${variant}"`;
  const colorProp = hasChipColor(variant) ? ` color="${color}"` : "";
  const iconName = VARIANT_ICON[variant];

  if (!iconName) {
    return `<Chip${variantProp}${colorProp}>${chipText}</Chip>`;
  }

  return `<Chip${variantProp}${colorProp}>
  <Icon name="${iconName}" aria-hidden />
  <span>${chipText}</span>
</Chip>`;
}

/** Chip Playground (이 페이지에서만 사용) */
function ChipPlayground() {
  const [variant, setVariant] = useState<ChipVariant>("tint");
  const [color, setColor] = useState<ChipColor>("blue");
  const [chipText, setChipText] = useState(DEFAULT_CHIP_TEXT);

  const isColorEnabled = hasChipColor(variant);
  const iconName = VARIANT_ICON[variant];

  const handleClickReset = () => {
    setVariant("tint");
    setColor("blue");
    setChipText(DEFAULT_CHIP_TEXT);
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "variant",
      type: '"tint" | "solid" | "stateYes" | "stateNo" | "iconData"',
      description:
        "모양. stateYes·stateNo·iconData는 정해진 아이콘과 함께 씁니다.",
      control: (
        <PlaygroundRadioControl
          label="variant"
          value={variant}
          options={CHIP_VARIANTS}
          onValueChange={(next) => setVariant(next as ChipVariant)}
        />
      ),
    },
    {
      name: "color",
      type: '"blue" | "green" | "yellow" | "red" | "purple" | "gray"',
      description: "색 (tint·solid에서만 적용)",
      control: (
        <PlaygroundRadioControl
          label="color"
          value={color}
          options={[...colors]}
          onValueChange={(next) => setColor(next as ChipColor)}
          disabled={!isColorEnabled}
        />
      ),
    },
    {
      name: "children",
      type: "ReactNode",
      description: "칩 글자 (짧은 낱말만, 줄바꿈되지 않음)",
      control: (
        <PlaygroundTextControl
          label="children"
          value={chipText}
          onValueChange={setChipText}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. Chip은 누를 수 있는 기능이 없어 이벤트 로그가 없습니다."
      code={buildPlaygroundCode(variant, color, chipText)}
      controls={controls}
      controlsNote="asChild는 자식 마크업(예: 링크)을 바꾸는 Prop이라 Controls에 넣지 않았습니다. Samples 탭의 '다른 마크업으로 사용하기' 예시를 참고하세요. stateYes·stateNo·iconData에 color를 함께 쓰는 조합은 docs/components/Chip.md에서 금지하므로 color를 비활성화합니다."
      state={{
        variant,
        color: isColorEnabled ? color : "(tint·solid에서만 적용)",
        children: chipText,
      }}
      onReset={handleClickReset}
    >
      {iconName ? (
        <Chip variant={variant}>
          <Icon name={iconName} aria-hidden />
          <span>{chipText}</span>
        </Chip>
      ) : (
        <Chip variant={variant} color={color}>
          {chipText}
        </Chip>
      )}
    </GuidePlayground>
  );
}

function SampleChipPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Chip Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<ChipPlayground />}>
        <GuideBox
          title="variant: tint × color"
          description="톤이 약한 tint 스타일에서 색상별 Chip 표현을 확인합니다."
          code={`
{colors.map((color) => (
  <Chip key={color} variant="tint" color={color}>
    tint / {color}
  </Chip>
))}
        `}
        >
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <Chip key={color} variant="tint" color={color}>
                tint / {color}
              </Chip>
            ))}
          </div>
        </GuideBox>

        <GuideBox
          title="variant: solid × color"
          description="배경색이 꽉 찬 solid 스타일의 색상별 사용 예시입니다."
          code={`
{colors.map((color) => (
  <Chip key={color} variant="solid" color={color}>
    solid / {color}
  </Chip>
))}
        `}
        >
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <Chip key={color} variant="solid" color={color}>
                solid / {color}
              </Chip>
            ))}
          </div>
        </GuideBox>

        <GuideBox
          title="기타 variants"
          description="상태형 Chip, 아이콘 데이터형 Chip, `asChild` 조합을 함께 확인합니다."
          code={`
<Chip variant="stateYes">
  <Icon name="checkbox-circle-fill" />
  <span>stateYes</span>
</Chip>

<Chip variant="stateNo">
  <Icon name="error-warning-fill" />
  <span>stateNo</span>
</Chip>

<Chip asChild variant="iconData">
  <a href="https://example.com" target="_blank" rel="noreferrer">
    <Icon name="attachment" />
    <span>RQ_kumhoresort_2025.pdf</span>
  </a>
</Chip>
        `}
        >
          <div className="flex flex-wrap gap-2">
            <Chip variant="stateYes">
              <Icon name="checkbox-circle-fill" />
              <span>stateYes</span>
            </Chip>
            <Chip variant="stateNo">
              <Icon name="error-warning-fill" />
              <span>stateNo</span>
            </Chip>
            <Chip variant="iconData" className="gap-0!">
              <Icon name="attachment" />
              <span>2</span>
            </Chip>
          </div>
          <h2 className="text-lg font-semibold">다른 마크업으로 사용하기</h2>
          <div className="flex flex-wrap gap-2">
            <Chip asChild variant="iconData">
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className="underline!"
              >
                <Icon name="attachment" />
                <span>RQ_kumhoresort_2025.pdf</span>
              </a>
            </Chip>
          </div>
        </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleChipPage };
export default SampleChipPage;
