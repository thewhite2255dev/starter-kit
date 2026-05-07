import fs from "fs"
import path from "path"

/**
 * Types for route configuration
 */
type RouteType = "public" | "protected" | null

interface ScannedRoute {
  route: string
  type: RouteType
  isDynamic: boolean
}

interface RoutesConfig {
  public: string[]
  protected: string[]
  auth: string[]
  dynamic: string[]
  generatedAt: string
}

interface ScannerConfig {
  appDir?: string
  excludePatterns?: string[]
  outputDir?: string
}

/**
 * Default configuration for the scanner
 */
const DEFAULT_CONFIG: Required<ScannerConfig> = {
  appDir: path.join(process.cwd(), "app"),
  excludePatterns: ["_", "api", ".", "components"],
  outputDir: path.join(process.cwd(), "lib"),
}

/**
 * Checks if a path should be excluded
 */
function shouldExclude(item: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    if (pattern.startsWith("*")) {
      return item.endsWith(pattern.slice(1))
    }
    return item.startsWith(pattern) || item === pattern
  })
}

/**
 * Parses route segment and detects dynamic parts
 */
function parseRouteSegment(item: string): {
  segment: string
  isDynamic: boolean
} {
  if (item.startsWith("[") && item.endsWith("]")) {
    return {
      segment: `:${item.slice(1, -1)}`,
      isDynamic: true,
    }
  }
  if (item.startsWith("(") && item.endsWith(")")) {
    return {
      segment: "",
      isDynamic: false,
    }
  }
  return {
    segment: item,
    isDynamic: false,
  }
}

/**
 * Normalizes a route path to a standard format
 */
function normalizeRoute(route: string): string {
  const normalized = route.replace(/\\/g, "/").replace(/\/+/g, "/")

  if (!normalized || normalized === "/") return "/"

  const withLeadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`

  return withLeadingSlash !== "/" && withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash
}

/**
 * Scans the app directory for routes
 */
function scanAppRoutes(config: ScannerConfig = {}): ScannedRoute[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const routes: ScannedRoute[] = []
  const appDir = finalConfig.appDir

  if (!fs.existsSync(appDir)) {
    console.warn(`⚠️  App directory not found: ${appDir}`)
    return routes
  }

  /**
   * Recursively scans directory for page files
   */
  function scanDirectory(dir: string, baseRoute = "", parentGroup: RouteType = null) {
    try {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        if (shouldExclude(item, finalConfig.excludePatterns)) continue

        const fullPath = path.join(dir, item)
        let stat: fs.Stats

        try {
          stat = fs.statSync(fullPath)
        } catch {
          console.warn(`⚠️  Could not stat: ${fullPath}`)
          continue
        }

        if (stat.isDirectory()) {
          const { segment } = parseRouteSegment(item)
          let currentGroup: RouteType = parentGroup

          // Detect route groups
          if (item.startsWith("(") && item.endsWith(")")) {
            const groupName = item.slice(1, -1)
            if (groupName === "public" || groupName === "protected") {
              currentGroup = groupName
            }
          }

          const newBaseRoute = segment ? path.posix.join(baseRoute, segment) : baseRoute

          scanDirectory(fullPath, newBaseRoute, currentGroup)
        } else if (/^page\.(tsx|ts|jsx|js)$/.test(item)) {
          const route = normalizeRoute(baseRoute) || "/"

          // Check for duplicates
          if (!routes.some((r) => r.route === route)) {
            const isDynamic = route.includes(":")
            routes.push({ route, type: parentGroup, isDynamic })
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error scanning directory ${dir}:`, error)
    }
  }

  scanDirectory(appDir)
  return routes.sort((a, b) => a.route.localeCompare(b.route))
}

/**
 * Generates configuration from scanned routes
 */
function buildRoutesConfig(routes: ScannedRoute[]): RoutesConfig {
  const authRouteSet = new Set([
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/reset-password",
    "/verify-email",
  ])

  return {
    public: routes.filter((r) => r.type !== "protected").map((r) => r.route),
    protected: routes.filter((r) => r.type === "protected").map((r) => r.route),
    auth: routes
      .filter((r) => r.route.startsWith("/auth/") || authRouteSet.has(normalizeRoute(r.route)))
      .map((r) => r.route),
    dynamic: routes.filter((r) => r.isDynamic).map((r) => r.route),
    generatedAt: new Date().toISOString(),
  }
}

/**
 * Generates TypeScript file content
 */
function generateTypesContent(config: RoutesConfig): string {
  return `// ⚠️ Auto-generated file. Do not edit manually.
// Generated at: ${config.generatedAt}

export const generatedRoutes = {
  public: ${JSON.stringify(config.public, null, 2)},
  protected: ${JSON.stringify(config.protected, null, 2)},
  auth: ${JSON.stringify(config.auth, null, 2)},
  dynamic: ${JSON.stringify(config.dynamic, null, 2)},
  generatedAt: '${config.generatedAt}'
} as const;

export type GeneratedRoutes = typeof generatedRoutes;

/**
 * Check if a route is protected
 */
export function isProtectedRoute(route: string): boolean {
  return (generatedRoutes.protected as readonly string[]).includes(route);
}

/**
 * Check if a route is public
 */
export function isPublicRoute(route: string): boolean {
  return (generatedRoutes.public as readonly string[]).includes(route);
}

/**
 * Check if a route is an auth route
 */
export function isAuthRoute(route: string): boolean {
  return (generatedRoutes.auth as readonly string[]).includes(route);
}

/**
 * Check if a route is dynamic
 */
export function isDynamicRoute(route: string): boolean {
  return (generatedRoutes.dynamic as readonly string[]).includes(route);
}
`
}

/**
 * Validates the generated routes
 */
function validateRoutes(config: RoutesConfig): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (config.public.length === 0 && config.protected.length === 0) {
    errors.push("❌ No routes found. Check your app directory structure.")
  }

  // Check for duplicate routes
  const allRoutes = [...config.public, ...config.protected]
  const duplicates = allRoutes.filter((route, index) => allRoutes.indexOf(route) !== index)
  if (duplicates.length > 0) {
    errors.push(`❌ Duplicate routes found: ${duplicates.join(", ")}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Logs statistics about generated routes
 */
function logStatistics(config: RoutesConfig) {
  console.table({
    "📍 Public Routes": config.public.length,
    "🔒 Protected Routes": config.protected.length,
    "🔐 Auth Routes": config.auth.length,
    "🔄 Dynamic Routes": config.dynamic.length,
    "📊 Total Routes": config.public.length + config.protected.length + config.auth.length,
  })
}

/**
 * Main function to generate routes file
 */
function generateRoutesFile(config?: ScannerConfig) {
  try {
    console.log("🔍 Scanning app directory for routes...")

    const scannedRoutes = scanAppRoutes(config)

    if (scannedRoutes.length === 0) {
      console.warn("⚠️  No routes found during scan.")
    }

    const routesConfig = buildRoutesConfig(scannedRoutes)

    // Validate routes
    const validation = validateRoutes(routesConfig)
    if (!validation.valid) {
      validation.errors.forEach((error) => console.error(error))
    }

    const output = generateTypesContent(routesConfig)

    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    fs.mkdirSync(finalConfig.outputDir, { recursive: true })

    const outputPath = path.join(finalConfig.outputDir, "generated-routes.ts")
    fs.writeFileSync(outputPath, output)

    console.log("✅ Routes generated successfully!")
    logStatistics(routesConfig)
    console.log(`📁 Output: ${outputPath}\n`)

    return routesConfig
  } catch (error) {
    console.error(
      "❌ Fatal error generating routes:",
      error instanceof Error ? error.message : error
    )
    process.exit(1)
  }
}

// Execute if run directly
generateRoutesFile()
