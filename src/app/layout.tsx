import type { Metadata } from "next";
import { Inter, Roboto, Roboto_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/Layout/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TradeJournal — Your trading journal, rebuilt.",
  description:
    "Log trades, write analysis, and track your performance in a minimal, private, and customizable workspace built for serious traders.",
};

// Runs before React hydrates to avoid a flash of the wrong theme/color-theme
const themeScript = `
try {
  var t = localStorage.getItem('theme');
  var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (dark) document.documentElement.classList.add('dark');
  var ct = localStorage.getItem('color-theme') || 'void';
  document.documentElement.setAttribute('data-theme', ct);
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${robotoMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
