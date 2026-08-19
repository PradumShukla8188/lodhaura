"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("lodhaura_install_dismissed");
    if (dismissed) return;

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    if (ios) {
      const standalone = (navigator as Navigator & { standalone?: boolean }).standalone;
      if (!standalone) setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferred(null);
  };

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("lodhaura_install_dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div className="install-prompt fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md sm:left-auto">
      <div className="glass-strong rounded-2xl border border-white/20 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-village text-lg font-bold text-white">
            L
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Add Lodhaura to Home Screen</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isIOS
                ? "Tap Share → Add to Home Screen for quick access like an app."
                : "Install our village portal on your phone for faster access."}
            </p>
            {!isIOS && (
              <Button size="sm" className="mt-3 gap-2" onClick={install}>
                <Download className="h-4 w-4" />
                Install App
              </Button>
            )}
          </div>
          <button type="button" onClick={dismiss} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
