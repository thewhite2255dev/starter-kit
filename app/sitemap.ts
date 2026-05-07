import type { MetadataRoute } from "next"
import { env } from "@/env"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.SITE_URL

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  return [...staticPages]
}
