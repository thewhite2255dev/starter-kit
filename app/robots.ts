import type { MetadataRoute } from "next"
import { env } from "@/env"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.SITE_URL
  const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString()

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/"],
      },
    ],
    sitemap: sitemapUrl,
  }
}
