import { useState } from "react"

interface useCopyToClipboardProps {
  onCopy?: () => void
  timeout?: number
}

export function useCopyToClipboard({ onCopy, timeout = 2000 }: useCopyToClipboardProps = {}) {
  const [copied, setCopied] = useState<boolean>(false)

  function copyToClipboard(value: string) {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      return
    }

    if (!value) return

    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)

      if (onCopy) {
        onCopy()
      }

      setTimeout(() => {
        setCopied(false)
      }, timeout)
    }, console.error)
  }

  return { copied, copyToClipboard }
}
