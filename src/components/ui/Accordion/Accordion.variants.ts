import { cva } from "class-variance-authority";
import styles from "./Accordion.module.scss";

export const accordionVariants = cva(styles.accordion, {
  variants: {
    variant: {
      default: "",
      bordered: styles.variantBordered,
      ghost: styles.variantGhost,
    },
    size: {
      default: "",
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export const accordionItemVariants = cva(styles.accordionItem, {
  variants: {
    variant: {
      default: "",
      bordered: styles.itemVariantBordered,
      ghost: styles.itemVariantGhost,
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionTriggerVariants = cva(styles.accordionTrigger, {
  variants: {
    variant: {
      default: "",
      compact: styles.triggerVariantCompact,
      expanded: styles.triggerVariantExpanded,
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionContentVariants = cva(styles.accordionContent, {
  variants: {
    variant: {
      default: "",
      padded: styles.contentVariantPadded,
      minimal: styles.contentVariantMinimal,
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
