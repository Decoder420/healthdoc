"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { muiDarkTheme, muiTheme } from "@/lib/mui/theme";

export function MuiProvider({ children }: { children: React.ReactNode }) {
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

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache: emotionCache, flush };
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
      <MuiThemeProvider theme={resolvedTheme === "dark" ? muiDarkTheme : muiTheme}>
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
