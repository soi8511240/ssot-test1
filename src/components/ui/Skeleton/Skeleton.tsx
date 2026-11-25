import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { skeletonVariants } from "./Skeleton.variants";


type SkeletonProps = React.ComponentProps<"div"> &
  VariantProps<typeof skeletonVariants>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, rounded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        className={cn(
          skeletonVariants({ variant, rounded }),
          /* flex 자식에서 h-/w- 유틸이 눌리지 않도록 */
          "min-w-0 shrink-0",
          className,
        )}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
export type { SkeletonProps };
export type SkeletonVariantProps = VariantProps<typeof skeletonVariants>;
