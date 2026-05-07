import { cn } from "@/lib/utils"
import Link from "next/link"

export type LogoProps = {
  siteName: string
  className?: string
}

export function Logo({ className, siteName }: LogoProps) {
  return (
    <div className={cn("text-lg font-semibold", className)}>
      <Link href="/">{siteName}</Link>
    </div>
  )
}
