import * as React from "react";
import { Button, Skeleton } from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";

type SkeletonVariant = "default" | "muted";
type SkeletonRounded = "sm" | "md" | "lg" | "full";

const DEFAULT_VARIANT: SkeletonVariant = "default";
const DEFAULT_ROUNDED: SkeletonRounded = "md";

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(
  variant: SkeletonVariant,
  rounded: SkeletonRounded,
) {
  const variantProp =
    variant !== DEFAULT_VARIANT ? ` variant="${variant}"` : "";
  const roundedProp =
    rounded !== DEFAULT_ROUNDED ? ` rounded="${rounded}"` : "";

  return `<Skeleton${variantProp}${roundedProp} className="h-12 w-full" />`;
}

/** Skeleton Playground (이 페이지에서만 사용) */
function SkeletonPlayground() {
  const [variant, setVariant] =
    React.useState<SkeletonVariant>(DEFAULT_VARIANT);
  const [rounded, setRounded] =
    React.useState<SkeletonRounded>(DEFAULT_ROUNDED);

  const handleClickReset = () => {
    setVariant(DEFAULT_VARIANT);
    setRounded(DEFAULT_ROUNDED);
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "variant",
      type: '"default" | "muted"',
      description: "배경 톤 (muted는 다른 톤의 배경)",
      control: (
        <PlaygroundRadioControl
          label="variant"
          value={variant}
          options={["default", "muted"]}
          onValueChange={(next) => setVariant(next as SkeletonVariant)}
        />
      ),
    },
    {
      name: "rounded",
      type: '"sm" | "md" | "lg" | "full"',
      description: "모서리 둥글기",
      control: (
        <PlaygroundRadioControl
          label="rounded"
          value={rounded}
          options={["sm", "md", "lg", "full"]}
          onValueChange={(next) => setRounded(next as SkeletonRounded)}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      code={buildPlaygroundCode(variant, rounded)}
      controls={controls}
      controlsNote="Skeleton은 이벤트가 없는 표시용 컴포넌트라 이벤트 로그를 두지 않았습니다. 높이·너비는 Props가 아니라 배치용 className(h-*, w-*)으로 정합니다."
      state={{ variant, rounded }}
      onReset={handleClickReset}
    >
      <div className="w-full max-w-md">
        <Skeleton variant={variant} rounded={rounded} className="h-12 w-full" />
      </div>
    </GuidePlayground>
  );
}

/** 로딩/본문 전환 시 카드 높이가 크게 변하지 않도록 행 높이를 맞춤 */
function SkeletonFourSecondDemo() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 4000);
    return () => window.clearTimeout(id);
  }, [loading]);

  return (
    <div className="w-full max-w-md rounded-xl border border-line02 bg-base p-4">
      <p className="mb-3 min-h-10 text-sm leading-snug text-font-g">
        {loading
          ? "4초 후 스켈레톤이 사라지고 본문이 표시됩니다."
          : "로딩이 끝났습니다."}
      </p>

      <div className="flex min-h-[188px] flex-col gap-3">
        {loading ? (
          <>
            <Skeleton className="h-7 w-2/3 shrink-0" rounded="md" />
            <div className="flex min-h-18 flex-col justify-center gap-2">
              <Skeleton className="h-4 w-full shrink-0" />
              <Skeleton className="h-4 w-5/6 shrink-0" />
            </div>
            <div className="mt-auto flex h-9 shrink-0 items-center gap-2">
              <Skeleton className="h-9 w-20 shrink-0" rounded="full" />
              <Skeleton className="h-9 w-20 shrink-0" rounded="md" />
            </div>
          </>
        ) : (
          <>
            <p className="h-7 shrink-0 font-semibold leading-7 text-font-b">
              제목이 여기에 표시됩니다
            </p>
            <div className="flex min-h-18 flex-col justify-center gap-2 text-sm">
              <p className="leading-snug text-font-b">
                데이터를 불러온 뒤에는 스켈레톤 대신 실제 콘텐츠로 바꿉니다.
              </p>
              <p className="leading-snug text-font-g">
                레이아웃은 위 스켈레톤과 같은 행 높이를 유지합니다.
              </p>
            </div>
            <div className="mt-auto flex h-9 shrink-0 items-center gap-2">
              <Button
                type="button"
                size="sm"
                className="h-9 min-w-20 shrink-0 px-4"
                onClick={() => setLoading(true)}
              >
                다시 로딩
              </Button>
              <span className="inline-block h-9 w-20 shrink-0" aria-hidden />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SampleSkeletonPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Skeleton Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<SkeletonPlayground />}>
          <GuideBox
            title="기본 Skeleton"
            description="펄스 애니메이션과 variant·rounded로 톤·모서리를 조절합니다."
            code={`
import { Skeleton } from "@/components/ui";

<Skeleton className="h-4 w-full" />
<Skeleton className="h-10 w-10" rounded="full" />
<Skeleton variant="muted" className="h-4 w-3/4" />
            `}
          >
            <div className="flex w-full max-w-md flex-col gap-3">
              <Skeleton className="h-4 w-full shrink-0" />
              <Skeleton className="h-4 w-3/4 shrink-0" />
              <div className="flex min-h-10 items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0" rounded="full" />
                <div className="flex min-h-10 min-w-0 flex-1 flex-col justify-center gap-2">
                  <Skeleton className="h-4 w-full shrink-0" />
                  <Skeleton className="h-3 w-2/3 shrink-0" rounded="sm" />
                </div>
              </div>
              <Skeleton
                variant="muted"
                className="h-4 w-3/4 shrink-0"
                rounded="md"
              />
            </div>
          </GuideBox>

          <GuideBox
            title="4초 후 스켈레톤 제거"
            description="setTimeout(4000)으로 로딩을 끄고, 스켈레톤과 본문의 행·최소 높이를 맞춰 레이아웃이 덜 흔들리게 했습니다."
            code={`
const [loading, setLoading] = useState(true);

useEffect(() => {
  const id = window.setTimeout(() => setLoading(false), 4000);
  return () => window.clearTimeout(id);
}, []);

<div className="flex min-h-[188px] flex-col gap-3">
  {loading ? (
    <>
      <Skeleton className="h-7 w-2/3 shrink-0" rounded="md" />
      <div className="flex min-h-18 flex-col justify-center gap-2">
        <Skeleton className="h-4 w-full shrink-0" />
        <Skeleton className="h-4 w-5/6 shrink-0" />
      </div>
      <div className="mt-auto flex h-9 shrink-0 items-center gap-2">
        <Skeleton className="h-9 w-20 shrink-0" rounded="full" />
        <Skeleton className="h-9 w-20 shrink-0" rounded="md" />
      </div>
    </>
  ) : (
    <>
      <p className="h-7 shrink-0 font-semibold leading-7 text-font-b">
        제목이 여기에 표시됩니다
      </p>
      <div className="flex min-h-18 flex-col justify-center gap-2 text-sm">
        <p className="leading-snug text-font-b">
          데이터를 불러온 뒤에는 스켈레톤 대신 실제 콘텐츠로 바꿉니다.
        </p>
        <p className="leading-snug text-font-g">
          레이아웃은 위 스켈레톤과 같은 행 높이를 유지합니다.
        </p>
      </div>
      <div className="mt-auto flex h-9 shrink-0 items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="h-9 min-w-20 shrink-0 px-4"
          onClick={() => setLoading(true)}
        >
          다시 로딩
        </Button>
        <span className="inline-block h-9 w-20 shrink-0" aria-hidden />
      </div>
    </>
  )}
</div>
            `}
          >
            <SkeletonFourSecondDemo />
          </GuideBox>

          <GuideBox
            title="카드형 레이아웃"
            description="아바타·텍스트·이미지 영역을 고정 높이·min-w-0으로 잡아 넘침을 줄입니다."
            code={`
<div className="flex max-w-md flex-col gap-4 rounded-xl border p-4">
  <div className="flex gap-3">
    <Skeleton className="h-12 w-12 shrink-0" rounded="lg" />
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
  <Skeleton className="h-32 w-full shrink-0" rounded="lg" />
</div>
            `}
          >
            <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-line02 bg-base p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 shrink-0" rounded="lg" />
                <div className="flex min-h-13 min-w-0 flex-1 flex-col justify-center gap-2">
                  <Skeleton className="h-4 w-1/3 max-w-full shrink-0" />
                  <Skeleton className="h-3 w-full shrink-0" />
                  <Skeleton className="h-3 w-2/3 shrink-0" />
                </div>
              </div>
              <Skeleton className="h-32 w-full shrink-0" rounded="lg" />
            </div>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleSkeletonPage };
export default SampleSkeletonPage;
