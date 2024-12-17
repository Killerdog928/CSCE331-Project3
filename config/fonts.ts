import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";

/**
 * Configures the FontSans font with specified subsets and a CSS variable.
 *
 * @constant {object} fontSans - The configured FontSans font.
 * @property {string[]} subsets - The subsets to include in the font.
 * @property {string} variable - The CSS variable to use for the font.
 */
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
