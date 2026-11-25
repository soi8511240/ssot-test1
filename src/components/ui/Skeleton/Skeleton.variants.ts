import { cva } from "class-variance-authority";
import styles from "./Skeleton.module.scss";

export const skeletonVariants = cva(styles.skeleton, {
  variants: {
    variant: {
      default: styles.variantDefault,
      muted: styles.variantMuted,
    },
    rounded: {
      sm: styles.roundedSm,
      md: styles.roundedMd,
      lg: styles.roundedLg,
      full: styles.roundedFull,
    },
  },
  defaultVariants: {
    variant: "default",
    rounded: "md",
  },
});
