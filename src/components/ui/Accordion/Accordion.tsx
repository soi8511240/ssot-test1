import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import styles from "./Accordion.module.scss";
import { accordionVariants, accordionItemVariants, accordionTriggerVariants, accordionContentVariants } from "./Accordion.variants";


function Accordion({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> &
  VariantProps<typeof accordionVariants>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn(accordionVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> &
  VariantProps<typeof accordionItemVariants>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> &
  VariantProps<typeof accordionTriggerVariants>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerVariants({ variant }), className)}
        {...props}
      >
        {children}
        <ChevronDownIcon className={styles.chevron} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> &
  VariantProps<typeof accordionContentVariants>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(accordionContentVariants({ variant }), className)}
      {...props}
    >
      <div className={cn(styles.contentInner, className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}


export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
export type {
  VariantProps as AccordionVariantProps,
};