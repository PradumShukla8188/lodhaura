"use client";

import { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthInit } from "@/components/auth/AuthInit";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { store } from "@/store/store";
import { setColorTheme } from "@/store/slices/themeSlice";
import {
  applyColorTheme,
  defaultColorTheme,
  themePresets,
  type ColorThemeId,
} from "@/lib/themes";

function ThemeColorSync({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem("lodhaura_color_theme") as ColorThemeId | null;
    const themeId = saved && saved in themePresets ? saved : defaultColorTheme;
    store.dispatch(setColorTheme(themeId));
    applyColorTheme(themeId);
  }, []);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const { colorTheme } = store.getState().theme;
      applyColorTheme(colorTheme);
      localStorage.setItem("lodhaura_color_theme", colorTheme);
    });
    return unsubscribe;
  }, []);

  return <>{children}</>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ThemeColorSync>
            <AuthInit>{children}</AuthInit>
            <InstallPrompt />
            <Toaster richColors closeButton position="top-right" />
          </ThemeColorSync>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
