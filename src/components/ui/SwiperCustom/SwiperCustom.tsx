import * as React from "react";
import clsx from "clsx";
import {
  SwiperRoot,
  SwiperSlideRoot,
  type SwiperInstance,
  type SwiperProps,
  type SwiperRef,
  type SwiperSlideProps,
} from "./swiperImports";
import styles from "./SwiperCustom.module.css";

const Swiper = React.forwardRef<SwiperRef, SwiperProps>(function Swiper(
  { className, ...rest },
  ref,
) {
  return (
    <SwiperRoot
      ref={ref}
      {...rest}
      className={clsx(styles.swiper, className)}
    />
  );
});
Swiper.displayName = "Swiper";

function SwiperSlide({ className, ...rest }: SwiperSlideProps) {
  return (
    <SwiperSlideRoot {...rest} className={clsx(styles.slide, className)} />
  );
}
/** swiper/react가 자식 슬라이드를 displayName으로만 식별합니다. */
SwiperSlide.displayName = "SwiperSlide";

export {
  Swiper,
  SwiperSlide,
};
export type { SwiperInstance, SwiperProps, SwiperRef, SwiperSlideProps };
