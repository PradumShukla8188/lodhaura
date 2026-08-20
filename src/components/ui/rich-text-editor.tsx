"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const JoditEditorClient = dynamic(
  () => import("./jodit-editor-client"),
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("rich-text-editor-container", className)}>
        <Skeleton className="h-[400px] w-full rounded-md border border-input bg-muted/20" />
      </div>
    );
  }

  return (
    <div className={cn("rich-text-editor-container", className)}>
      <JoditEditorClient value={value} onChange={onChange} />
    </div>
  );
}
