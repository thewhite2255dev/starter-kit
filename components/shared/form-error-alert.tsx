import { cn } from "@/lib/utils"
import { TriangleAlert } from "lucide-react"

interface FormErrorAlertProps extends React.ComponentProps<"div"> {
  message?: string
  className?: string
}

export default function FormErrorAlert({ message, className, ...props }: FormErrorAlertProps) {
  if (!message) return null

  return (
    <div
      {...props}
      className={cn(
        "border-destructive/20 bg-destructive/5 text-destructive *:data-[slot=alert-description]:text-destructive/90 flex h-9 items-center gap-2 rounded-md border px-2 *:[svg]:text-current",
        className
      )}
    >
      <TriangleAlert className="size-4" />
      <div className="max-h-24 w-full overflow-y-auto">{message}</div>
    </div>
  )
}
