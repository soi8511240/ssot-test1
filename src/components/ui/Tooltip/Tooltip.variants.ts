import { cva } from "class-variance-authority";
import styles from "./Tooltip.module.scss";

export const tooltipProviderVariants = cva(styles.tooltipProvider, {
  variants: {
    delay: {
      default: "delay-0",
      fast: "delay-0",
      slow: "delay-300",
    },
  },
  defaultVariants: {
    delay: "default",
  },
});

export const tooltipContentVariants = cva(styles.tooltipContent, {
  variants: {
    variant: {
      default: styles.variantDefault,
      light: styles.variantLight,
      dark: styles.variantDark,
      warning: styles.variantWarning,
      error: styles.variantError,
      success: styles.variantSuccess,
      info: styles.variantInfo,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
    arrow: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    arrow: true,
  },
});
