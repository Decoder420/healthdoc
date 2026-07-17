import localFont from "next/font/local";

/**
 * Self-hosted fonts via next/font/local.
 * Avoids next/font/google downloads that fail under corporate TLS interception.
 */
export const ibmPlexSans = localFont({
  src: [
    {
      path: "./font-files/IBMPlexSans-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./font-files/IBMPlexSans-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./font-files/IBMPlexSans-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./font-files/IBMPlexSans-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const ibmPlexMono = localFont({
  src: [
    {
      path: "./font-files/IBMPlexMono-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./font-files/IBMPlexMono-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./font-files/IBMPlexMono-600.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const reportSans = localFont({
  src: [
    { path: "./font-files/DMSans-400.woff2", weight: "400", style: "normal" },
    { path: "./font-files/DMSans-500.woff2", weight: "500", style: "normal" },
    { path: "./font-files/DMSans-600.woff2", weight: "600", style: "normal" },
    { path: "./font-files/DMSans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-report-sans",
  display: "swap",
});

export const reportDisplay = localFont({
  src: [
    { path: "./font-files/Fraunces-500.woff2", weight: "500", style: "normal" },
    { path: "./font-files/Fraunces-600.woff2", weight: "600", style: "normal" },
    { path: "./font-files/Fraunces-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-report-display",
  display: "swap",
});

export const fontVariables = `${ibmPlexSans.variable} ${ibmPlexMono.variable}`;
