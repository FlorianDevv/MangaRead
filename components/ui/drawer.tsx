"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { clx } from "@/lib/utils/clx/clx-merge";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = clx(DrawerPrimitive.Overlay, "fixed inset-0 z-50 bg-black/80");
const DrawerHeader = clx.div("grid gap-1.5 p-4 text-center sm:text-left");
const DrawerDescription = clx(
  DrawerPrimitive.Description,
  "text-sm text-muted-foreground",
);
const DrawerFooter = clx.div("mt-auto flex gap-2 p-4");
const DrawerTitle = clx(
  DrawerPrimitive.Title,
  "text-lg font-semibold leading-none tracking-tight",
);

const DrawerPrimitiveContent = clx(
  DrawerPrimitive.Content,
  "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
);

//
// TODO UI
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ children }) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitiveContent>
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitiveContent>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
