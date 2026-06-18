"use client"

import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ThemeSwitcherProps {
  children: React.ReactNode
  className?: string
}

export function ThemeSwitcher({ className, children }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: "system", label: "Système", icon: Monitor },
    { value: "light", label: "Clair", icon: Sun },
    { value: "dark", label: "Sombre", icon: Moon },
  ] as const

  return (
    <DropdownMenu>
      <DropdownMenuTrigger title="Mode sombre (d)" asChild>
        {children ? (
          children
        ) : (
          <Button variant="ghost" size="icon" aria-label="Toggle mode" className={className}>
            <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            <Icon />
            <span className="mr-auto">{label}</span>
            <Check
              className={cn({
                "pointer-events-none opacity-0": theme !== value,
                "pointer-events-auto opacity-100": theme === value,
              })}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
