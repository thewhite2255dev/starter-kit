import { cn } from "@/lib/utils"
import { CircleCheck } from "lucide-react"

interface FormSuccessAlertProps extends React.ComponentProps<"div"> {
  message?: string
  className?: string
}

export default function FormSuccessAlert({ message, className, ...props }: FormSuccessAlertProps) {
  if (!message) return null

  return (
    <div
      {...props}
      className={cn(
        "flex h-9 items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2 dark:border-emerald-800 dark:bg-emerald-950 *:[svg]:text-current",
        className
      )}
    >
      <CircleCheck className="size-4 text-emerald-600! dark:text-emerald-400!" />
      <div className="max-h-24 w-full overflow-y-auto text-emerald-600! dark:text-emerald-400!">
        {message}
      </div>
    </div>
  )
}
