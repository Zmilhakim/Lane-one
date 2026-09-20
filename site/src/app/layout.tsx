import type { Metadata, Viewport } from "next";
import { Overpass, Overpass_Mono } from "next/font/google";

import "./globals.css";
import { TOKEN } from "@/lib/launchpad";
import { SITE_URL } from "@/lib/site";

// Overpass is Highway Gothic's open-source descendant, which is the whole reason
// for it: a token named after a lane should be set in the face road signs are.
const overpass = Overpass({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-overpass",
  display: "swap",
});

const overpassMono = Overpass_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-overpass-mono",
  display: "swap",
});

const title = `${TOKEN.name} ($${TOKEN.symbol})`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description: TOKEN.blurb,
  openGraph: {
    type: "website",
    siteName: TOKEN.name,
    title,
    description: TOKEN.blurb,
    images: [{ url: "/og-1200x630.png", width: 1200, height: 630, alt: TOKEN.name }],
  },
  twitter: { card: "summary_large_image", title, description: TOKEN.blurb, images: ["/og-1200x630.png"] },
  icons: { icon: "/avatar-1000.png" },
};

export const viewport: Viewport = {
  themeColor: "#161a21",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={TOKEN.language} className={`${overpass.variable} ${overpassMono.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <div className="lane-rule h-2.5" />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-8">{children}</main>
        <footer className="mt-10 bg-road-deep">
          <div className="lane-rule h-2.5" />
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-5">
            <span className="label font-semibold text-orange">${TOKEN.symbol}</span>
            <a
              className="label text-marking-dim underline decoration-orange/50 underline-offset-4 hover:text-orange"
              href="https://github.com/Zmilhakim/lane-one"
              target="_blank"
              rel="noreferrer"
            >
              Source
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
