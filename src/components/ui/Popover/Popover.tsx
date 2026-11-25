import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import styles from "./Popover.module.scss";
import { popoverContentVariants, placementToSideAlign, type PopoverPlacement } from "./Popover.variants";

type PopoverPortalProps = React.ComponentProps<typeof PopoverPrimitive.Portal>;

export type PopoverContentProps = Omit<
  React.ComponentProps<typeof PopoverPrimitive.Content>,
  "side" | "align"
> &
  VariantProps<typeof popoverContentVariants> & {
    /**
     * 트리거 기준 뜨는 방향·정렬. 지정 시 `side`·`align`보다 우선합니다.
     * (Portal이 붙는 DOM은 `container`로 따로 지정)
     */
    placement?: PopoverPlacement;
    side?: React.ComponentProps<typeof PopoverPrimitive.Content>["side"];
    align?: React.ComponentProps<typeof PopoverPrimitive.Content>["align"];
    /**
     * 생략 시 Portal을 쓰지 않고, `PopoverTrigger` 바로 다음 형제로 DOM에 붙습니다.
     * 특정 노드(스크롤 영역·모달 루트 등)에만 붙이려면 해당 요소를 넘기거나,
     * `"#aaa"` 같은 셀렉터 문자열로 넘길 수 있습니다. (예: `document.body`)
     */
    container?: PopoverPortalProps["container"] | string;
  };

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      container,
      placement,
      side: sideProp,
      align: alignProp,
      sideOffset = 4,
      variant,
      size,
      ...props
    },
    ref,
  ) => {
    const resolved = placement
      ? placementToSideAlign(placement)
      : {
          side: sideProp ?? "bottom",
          align: alignProp ?? "center",
        };

    const resolvedContainer =
      typeof container === "string"
        ? typeof document !== "undefined"
          ? document.querySelector(container)
          : null
        : container;

    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        side={resolved.side}
        align={resolved.align}
        sideOffset={sideOffset}
        className={cn(popoverContentVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (resolvedContainer != null) {
      return (
        <PopoverPrimitive.Portal container={resolvedContainer as any}>
          {content}
        </PopoverPrimitive.Portal>
      );
    }

    return content;
  },
);

PopoverContent.displayName = "PopoverContent";

function PopoverPortal({ ...props }: PopoverPortalProps) {
  return (
    <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
  );
}

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

function PopoverClose({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />;
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn(styles.popoverHeader, className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn(styles.popoverTitle, className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn(styles.popoverDescription, className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
  PopoverAnchor,
  PopoverClose,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
};
export type PopoverVariantProps = VariantProps<typeof popoverContentVariants>;
