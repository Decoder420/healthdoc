"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { Toaster } from "@/components/ui/Toaster";
import { useTheme } from "@/providers/theme-provider";
import { muiDarkTheme, muiTheme } from "@/styles/theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [{ cache, flush }] = useState(() => {
    const emotionCache = createCache({ key: "mui", prepend: true });
    emotionCache.compat = true;

    const prevInsert = emotionCache.insert;
    let inserted: string[] = [];

    emotionCache.insert = (...args) => {
      const serialized = args[1];
      if (emotionCache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flushInserted = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache: emotionCache, flush: flushInserted };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <GlobalStyles
        styles="@layer theme, base, mui, components, utilities;"
      />
      <MuiThemeProvider
        theme={resolvedTheme === "dark" ? muiDarkTheme : muiTheme}
      >
        <CssBaseline />
        {children}
        <Toaster />
      </MuiThemeProvider>
    </CacheProvider>
  );
}
