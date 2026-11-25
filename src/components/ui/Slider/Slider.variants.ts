import { cva } from "class-variance-authority";
import styles from "./Slider.module.scss";

export const sliderRootVariants = cva(styles.sliderRoot, {
  variants: {
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
  },
  defaultVariants: {
    size: "md",
  },
});
