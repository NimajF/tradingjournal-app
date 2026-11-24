import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/Layout/ThemeProvider";
import { InlineScript } from "./components/Layout/InlineScript";
import { APP_NAME } from "@/lib/constants/app";
import { DEFAULT_COLOR_THEME, THEME_IDS } from "@/lib/constants/themes";

// Geist carries the whole interface — body, controls and headings. It is a
// variable face, so the weight range is continuous rather than a list of
// cuts, and 450 becomes available: the weight Supabase uses on controls and
// the one that sits exactly between "quiet label" and "this is a button".
//
// Geist is not Inter and must not be tracked like it. Inter is drawn loose at
// interface sizes and needs roughly -0.006em pulled out of it to stop looking
// airy; Geist is drawn tight and ships with letter-spacing: normal on Vercel's
// own controls. Applying Inter's negative ramp to it reads cramped. See the
// tracking rules in globals.css.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// Its companion, so a price in a table and the label above it come from one
// drawing hand. Reserved for figures that have to line up in a column.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Document your trades and analysis`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "A private workspace to log trades, write your analysis, and organize it across journals and newsletters — no broker connections, free to use.",
};

// Runs before React hydrates to avoid a flash of the wrong mode/palette.
// An unknown palette id (from an older build) falls back to the default,
// the same rule ThemeProvider applies after hydration. The leftover `skin`
// key from the retired skin toggle is cleared.
const themeScript = `
try {
  var t = localStorage.getItem('theme');
  var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
  var ids = ${JSON.stringify(THEME_IDS)};
  var ct = localStorage.getItem('color-theme');
  document.documentElement.setAttribute('data-theme', ids.indexOf(ct) === -1 ? '${DEFAULT_COLOR_THEME}' : ct);
  localStorage.removeItem('skin');
} catch(e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <InlineScript html={themeScript} />
      </head>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
