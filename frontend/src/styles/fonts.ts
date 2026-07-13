import { Syne, Afacad } from "next/font/google";

/** Syne = large/display text */
export const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Afacad = small/body text */
export const afacad = Afacad({
  variable: "--font-afacad",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontVariables = `${syne.variable} ${afacad.variable}`;
