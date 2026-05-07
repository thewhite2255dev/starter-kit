"use client"

import { Logo } from "./logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "./theme-switcher"

export type navItem = {
  label: string
  href: string
}

export type AppHeaderProps = {
  siteName: string
}

export function AppHeader({ siteName }: AppHeaderProps) {
  const pathname = usePathname()

  const navItems: navItem[] = []

  return (
    <header className="bg-background/90 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo siteName={siteName} />
        </div>
        <nav className="hidden gap-6 font-medium lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-primary text-sm font-medium",
                pathname.endsWith(item.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
