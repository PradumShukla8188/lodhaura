"use client";

import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DonateActions({ upiId }: { upiId: string }) {
  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast.success("UPI ID copied!");
  };

  return (
    <Button variant="outline" className="mt-4 gap-2" onClick={copyUpi}>
      <Copy className="h-4 w-4" />
      Copy UPI ID
    </Button>
  );
}
