import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    SITE_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  //   runtimeEnv: {
  //  SITE_URL: process.env.SITE_URL,
  //     NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  //   },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
})
