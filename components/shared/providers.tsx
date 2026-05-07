"use client"

import { ProgressProvider } from "@bprogress/next/app"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "./theme-provider"

interface providersProps {
  children: React.ReactNode
}

export function Providers({ children }: providersProps) {
  return (
    <ThemeProvider>
      <Toaster position="top-center" richColors />
      <ProgressProvider options={{ showSpinner: false }} shallowRouting>
        {children}
      </ProgressProvider>
    </ThemeProvider>
  )
}
