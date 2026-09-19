import type { Metadata, Viewport } from "next";
import { Archivo_Black, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import { TOKEN } from "@/lib/launchpad";
import { SITE_URL } from "@/lib/site";

const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo", display: "swap" });

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
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
    <html lang={TOKEN.language} className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <div className="hazard h-3" />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:py-8">{children}</main>
        <footer className="mt-10 border-t-2 border-signal/30 bg-ground-deep">
          <div className="hazard h-2.5" />
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-5">
            <span className="micro font-semibold text-signal">${TOKEN.symbol}</span>
            <a
              className="micro text-lane-soft underline decoration-signal/50 underline-offset-4 hover:text-signal"
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
