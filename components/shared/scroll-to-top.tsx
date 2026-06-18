"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowUpToLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useIsTablet } from "@/hooks/use-media-query"

export function ScrollToTop() {
  const [showTopBtn, setShowTopBtn] = useState<boolean>(false)

  const isTablet = useIsTablet()

  const handleScroll = useCallback(() => {
    setShowTopBtn(window.scrollY > window.innerHeight / 2)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
  }

  return (
    <Button
      onClick={scrollToTop}
      variant="outline"
      className={cn(
        "fixed right-4 bottom-4 z-50 opacity-0 duration-300 ease-in-out",
        { "left-1/2": isTablet === true },
        showTopBtn ? "opacity-100" : "pointer-events-none cursor-default opacity-0"
      )}
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUpToLine aria-hidden="true" />
    </Button>
  )
}
