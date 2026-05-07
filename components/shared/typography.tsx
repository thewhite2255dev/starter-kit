import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("text-balance", {
  variants: {
    variant: {
      h1: "text-4xl md:text-5xl font-semibold scroll-m-20 tracking-tight",
      h2: "text-3xl md:text-4xl font-semibold scroll-m-20 tracking-tight",
      h3: "text-2xl md:text-3xl font-semibold scroll-m-20 tracking-tight",
      p: "text-base",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

export interface TypographyProps
  extends React.ComponentProps<"p">, VariantProps<typeof typographyVariants> {}

export function Typography({ className, variant, children, ...props }: TypographyProps) {
  const Component = (variant as React.ElementType) || "p"

  return (
    <Component className={cn(typographyVariants({ variant, className }))} {...props}>
      {children}
    </Component>
  )
}
