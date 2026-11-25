import { cva } from "class-variance-authority";
import styles from "./Popover.module.scss";

/** 트리거 기준 Popper 방향·정렬을 한 번에 지정 (예: bottom-start) */
export const POPOVER_PLACEMENTS = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
] as const;

export type PopoverPlacement = (typeof POPOVER_PLACEMENTS)[number];

type PopoverSide = "top" | "right" | "bottom" | "left";
type PopoverAlign = "start" | "center" | "end";

export function placementToSideAlign(placement: PopoverPlacement): {
  side: PopoverSide;
  align: PopoverAlign;
} {
  const parts = placement.split("-");
  const side = parts[0] as PopoverSide;
  const alignPart = parts[1];
  const align: PopoverAlign =
    alignPart === "start" || alignPart === "end" ? alignPart : "center";
  return { side, align };
}

export const popoverContentVariants = cva(styles.popoverContent, {
  variants: {
    variant: {
      default: styles.variantDefault,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
