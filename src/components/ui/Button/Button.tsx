import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      default: styles.variantDefault,
      // destructive: styles.variantDestructive,
      outline: styles.variantOutline,
      // secondary: styles.variantSecondary,
      ghost: styles.variantGhost,
      // link: styles.variantLink,
      text: styles.variantText,
    },
    // 글자 버튼 크기
    size: {
      default: styles.sizeDefault,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
    // 아이콘 전용 버튼 크기 (정사각형). 지정하면 size는 적용하지 않습니다.
    iconSize: {
      default: styles.sizeIcon,
      md: styles.sizeIconMd,
      sm: styles.sizeIconSm,
    },
    shape: {
      default: styles.shapeDefault,
      square: styles.shapeSquare,
    },
    color: {
      default: styles.colorDefault,
      gray: styles.colorGray,
      black: styles.colorBlack,
      grayBg: styles.colorGrayBg,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  className,
  variant = "default",
  size = "default",
  iconSize,
  shape = "default",
  color = "default",
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    shape?: string;
    color?: string;
  }) {
  const Comp = asChild ? Slot : "button";
  // iconSize가 있으면 아이콘 전용 버튼: 글자 버튼 크기(size)는 무시
  const textSize = iconSize ? null : size;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={textSize ?? undefined}
      data-icon-size={iconSize ?? undefined}
      data-shape={shape}
      className={cn(
        buttonVariants({ variant, size: textSize, iconSize, color, shape }),
        className,
      )}
      // 기본값 "button": 폼 안에서 실수로 제출되지 않도록. 제출 버튼은 type="submit"을 명시합니다.
      // asChild(링크 등)일 때는 type을 붙이지 않습니다.
      type={asChild ? type : (type ?? "button")}
      {...props}
    />
  );
}

export { Button };
