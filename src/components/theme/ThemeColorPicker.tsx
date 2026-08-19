"use client";

import { useDispatch, useSelector } from "react-redux";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { themePresets, colorThemeIds, type ColorThemeId } from "@/lib/themes";
import { setColorTheme } from "@/store/slices/themeSlice";
import type { RootState } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ThemeColorPickerProps {
  variant?: "icon" | "full";
  className?: string;
}

export function ThemeColorPicker({
  variant = "icon",
  className,
}: ThemeColorPickerProps) {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme.colorTheme);

  const handleSelect = (themeId: ColorThemeId) => {
    dispatch(setColorTheme(themeId));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" aria-label="Choose color theme">
            <Palette className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <span
              className="h-4 w-4 rounded-full ring-2 ring-white/50"
              style={{ backgroundColor: themePresets[currentTheme].swatch }}
            />
            Theme
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {colorThemeIds.map((id) => {
          const preset = themePresets[id];
          const isActive = currentTheme === id;

          return (
            <DropdownMenuItem
              key={id}
              onClick={() => handleSelect(id)}
              className={cn(
                "gap-3 py-2.5",
                isActive && "bg-primary/10"
              )}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full shadow-inner ring-1 ring-black/10"
                style={{
                  background: `linear-gradient(135deg, ${preset.cssVars["--primary"]}, ${preset.cssVars["--secondary"]}, ${preset.cssVars["--accent"]})`,
                }}
              />
              <div className="flex flex-1 flex-col items-start">
                <span className="font-medium">{preset.name}</span>
                <span className="text-xs text-muted-foreground">
                  {preset.description}
                </span>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
