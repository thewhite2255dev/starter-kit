import "server-only"

// ============================================================
//  site.config.ts — SEO Engine (Production Ready)
//  Stack: Next.js · TypeScript
//  Author: thewhite2255dev
// ============================================================

import type { Metadata } from "next"
import { env } from "@/env"
// ─────────────────────────────────────────────
// 1. CORE TYPES
// ─────────────────────────────────────────────

export type Locale = "fr" | "en" | (string & {})

export type OpenGraphType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "video.movie"

type Robots = NonNullable<Metadata["robots"]>

type ThemeColorDescriptor = Extract<NonNullable<Metadata["themeColor"]>, { color: string }>

type Verification = NonNullable<Metadata["verification"]>

type TemplateString = Extract<NonNullable<Metadata["title"]>, object>

type Author = NonNullable<Extract<NonNullable<Metadata["authors"]>, Array<unknown>>[number]>

// ─────────────────────────────────────────────
// 2. SEO TYPES
// ─────────────────────────────────────────────

export type SeoImage = {
  url: string
  width?: number
  height?: number
  alt?: string
  type?: string // e.g. "image/png"
}

export type TwitterCard = "summary" | "summary_large_image" | "app" | "player"

export type AlternateLanguages = {
  [locale: string]: string
}

export type ArticleSEO = {
  type: "article"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
}

export type SeoConfig = {
  /** Base URL of the site — no trailing slash. e.g. "https://mysite.com" */
  baseUrl: string
  /** Canonical site name (used in og:site_name) */
  siteName: string

  /** Default title for every page */
  defaultTitle: string
  /** Template applied to page-level titles. e.g. "%s | My Site" */
  titleTemplate: string
  /** Fallback description for pages that don't set their own */
  defaultDescription: string

  /** Default keywords applied site-wide — overridable per page */
  defaultKeywords?: string[]

  /** Default authors applied site-wide — overridable per page */
  defaultAuthors?: Author[]

  /** Absolute path or URL to the default Open Graph / share image */
  defaultImage: SeoImage
  /** Open Graph type for the root route */
  openGraphType: OpenGraphType

  /** Twitter/X card configuration */
  twitter: {
    card: TwitterCard
    /** @handle format — e.g. "@mysite" */
    site?: string
    /** @handle format — e.g. "@author" */
    creator?: string
  }

  /** Robots meta directive for the whole site.
   *  Per-page overrides are handled in each page's generateMetadata(). */
  robots: Robots

  /** Theme colors — plug into app/layout.tsx via export const viewport.
   *  @example
   *  export const viewport: Viewport = {
   *    themeColor: Array.isArray(siteConfig.seo.themeColor)
   *      ? siteConfig.seo.themeColor
   *      : [siteConfig.seo.themeColor],
   *  };
   */
  themeColor?: ThemeColorDescriptor | ThemeColorDescriptor[]

  /** Canonical alternate locales for hreflang */
  locales?: {
    default: Locale
    available?: Locale[]
  }

  verification?: Verification

  /** Structured data (JSON-LD) injected in <head>.
   *  Pass a plain object; it will be serialised by the helper below. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export type SiteConfig = {
  seo: SeoConfig
}

// ─────────────────────────────────────────────
// 3. CONFIG (EDIT THIS)
// ─────────────────────────────────────────────

export const siteConfig: SiteConfig = {
  seo: {
    baseUrl: env.SITE_URL,
    siteName: "Starter Kit Next.js",

    defaultTitle:
      "Starter Kit Next.js | Kit de démarrage avec optimisation SEO pour des projets modernes",
    titleTemplate: "%s | Starter Kit Next.js",
    defaultDescription:
      "Starter Kit Next.js 2026 avec TypeScript, composants UI et fondations SEO pour creer et deployer rapidement des applications web modernes.",

    defaultKeywords: [
      "starter kit nextjs",
      "boilerplate nextjs",
      "nextjs typescript",
      "seo nextjs",
      "template nextjs 2026",
    ],

    defaultAuthors: [{ name: "Degni Beugre Israël", url: "https://github.com/Thewhite2255dev" }],

    defaultImage: {
      url: "/og/default.png",
      width: 1200,
      height: 630,
      alt: "Starter Kit Next.js - image de partage par defaut",
      type: "image/png",
    },

    openGraphType: "website",

    twitter: {
      card: "summary_large_image",
      site: "@mysite",
      creator: "@myauthor",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },

    // themeColor: [
    //   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    //   { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    // ],

    locales: {
      default: "en",
      // available: ["en", "fr"],
    },

    verification: {
      google: process.env.GOOGLE_VERIFICATION_TOKEN ?? "", // other: { "msvalidate.01": "BING_TOKEN" },
    },

    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Starter Kit Next.js",
        url: env.SITE_URL,
      },
    ],
  },
}

// ─────────────────────────────────────────────
// 4. BUILD INPUT
// ─────────────────────────────────────────────

type BuildSEOInput = {
  title?: string | TemplateString
  description?: string
  keywords?: string[]
  authors?: Author[]
  image?: SeoImage
  canonical?: string
  noIndex?: boolean
  locale?: string
  alternates?: AlternateLanguages
  article?: ArticleSEO
}

// ─────────────────────────────────────────────
// 5. MAIN BUILDER (CORE ENGINE)
// ─────────────────────────────────────────────

/**
 * buildMetadata — generates a Next.js Metadata object from siteConfig.
 * Call this in your root layout.tsx, then spread per-page overrides.
 *
 * @example
 * // app/layout.tsx
 * export const metadata: Metadata = buildMetadata();
 */
export function buildMetadata(input?: BuildSEOInput): Metadata {
  const { seo } = siteConfig

  const title = input?.title ?? seo.defaultTitle
  const description = input?.description ?? seo.defaultDescription
  const image = input?.image ?? seo.defaultImage

  const keywords = [...(seo.defaultKeywords ?? []), ...(input?.keywords ?? [])].filter(
    (k, i, arr) => arr.indexOf(k) === i
  )

  const authors = input?.authors ?? seo.defaultAuthors

  const canonical = input?.canonical
    ? input.canonical.startsWith("http")
      ? input.canonical
      : `${seo.baseUrl}${input.canonical}`
    : undefined

  const absoluteImage = image.url.startsWith("http") ? image.url : `${seo.baseUrl}${image.url}`

  const robots: Robots = input?.noIndex ? { index: false, follow: false } : seo.robots

  const resolvedTitle =
    typeof title === "string" ? title : "absolute" in title ? title.absolute : title.default

  return {
    metadataBase: new URL(seo.baseUrl),

    title: typeof title === "string" ? { default: title, template: seo.titleTemplate } : title,

    description,

    ...(keywords.length > 0 && { keywords }),

    ...(authors && { authors }),

    alternates: {
      ...(canonical && { canonical }),
      ...(input?.alternates && { languages: input.alternates }),
    },

    openGraph: {
      type: input?.article?.type ?? seo.openGraphType,
      title: resolvedTitle,
      description,
      url: canonical,
      siteName: seo.siteName,
      locale: input?.locale ?? seo.locales?.default,

      images: [
        {
          url: absoluteImage,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],

      ...(input?.article && {
        publishedTime: input.article.publishedTime,
        modifiedTime: input.article.modifiedTime,
        authors: input.article.authors,
        tags: input.article.tags,
      }),
    },

    twitter: {
      card: seo.twitter.card,
      title: resolvedTitle,
      description,
      images: [absoluteImage],
      creator: seo.twitter.creator,
      site: seo.twitter.site,
    },

    robots,

    ...(seo.verification && { verification: seo.verification }),
  }
}

// ─────────────────────────────────────────────
// 6. FACTORY (ADVANCED)
// ─────────────────────────────────────────────

export function createSEO(defaults?: BuildSEOInput) {
  return (overrides?: BuildSEOInput): Metadata => {
    return buildMetadata({
      ...defaults,
      ...overrides,
      keywords: [...(defaults?.keywords ?? []), ...(overrides?.keywords ?? [])].filter(
        (k, i, arr) => arr.indexOf(k) === i
      ),
    })
  }
}

// ─────────────────────────────────────────────
// 7. JSON-LD
// ─────────────────────────────────────────────

/**
 * buildJsonLd — serialises a JSON-LD object for use in a <script> tag.
 *
 * @example
 * // app/layout.tsx
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: buildJsonLd() }}
 * />
 */
export function buildJsonLd(data?: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(data ?? siteConfig.seo.jsonLd ?? {}).replace(/</g, "\\u003c")
}

// ─────────────────────────────────────────────
// 8. UTIL
// ─────────────────────────────────────────────

/**
 * getAbsoluteUrl — joins the base URL with a relative path.
 *
 * @example
 * getAbsoluteUrl("/blog/mon-article") // "https://mysite.com/blog/mon-article"
 */
export function getAbsoluteUrl(path: string): string {
  return `${siteConfig.seo.baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}
