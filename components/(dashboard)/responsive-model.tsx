"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle, // 1. Import DialogTitle
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle, // 2. Import DrawerTitle
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/fetures/workspace/hookes/use-media-query";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string; // Optional prop if you want to pass a specific name for screen readers
}

export function ResponsiveModal({
  children,
  open,
  onOpenChange,
  title = "Modal", // Fallback text for the screen reader
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full sm:max-w-lg p-0! border-none! gap-0 outline-none overflow-hidden hide-scrollbar bg-background shadow-none">
          {/* 3. Add the hidden DialogTitle */}
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-none">
        {/* 4. Add the hidden DrawerTitle */}
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh] w-full">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
