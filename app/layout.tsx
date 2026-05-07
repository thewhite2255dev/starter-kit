import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { cn } from "@/lib/utils"
import { buildJsonLd, buildMetadata, siteConfig } from "@/lib/site.config"
import { Providers } from "@/components/shared/providers"

const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
})

export const metadata: Metadata = buildMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable)}
      suppressHydrationWarning
    >
      <head>
        {(Array.isArray(siteConfig.seo.jsonLd)
          ? siteConfig.seo.jsonLd
          : [siteConfig.seo.jsonLd]
        ).map((block, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: buildJsonLd(block) }}
          />
        ))}
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
