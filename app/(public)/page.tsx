import { Code2, Layers, Zap, Palette, Sparkles, Shield, type LucideIcon } from "lucide-react"
import { Typography } from "@/components/shared/typography"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/site.config"

type Item = { title: string; description: string; icon?: LucideIcon }

export default function Page() {
  const items: Item[] = [
    {
      title: "Performance",
      description:
        "Optimisé pour des performances maximales avec Next.js 16, React Server Components et Turbopack.",
      icon: Zap,
    },
    {
      title: "TypeScript",
      description:
        "Entièrement typé avec TypeScript pour une meilleure expérience développeur et moins d'erreurs.",
      icon: Code2,
    },
    {
      title: "Composants UI",
      description: "Bibliothèque complète de composants réutilisables avec Shadcn UI et Base UI.",
      icon: Layers,
    },
    {
      title: "Design System",
      description:
        "Tailwind CSS 4 avec thème personnalisable et mode sombre inclus via next-themes.",
      icon: Palette,
    },
    {
      title: "Animations",
      description:
        "Animations fluides et élégantes avec tw-animate-css et lucide-react pour les icônes.",
      icon: Sparkles,
    },
    {
      title: "Type-Safe",
      description:
        "Navigation typée avec génération automatique des routes et gestion d'état avec nuqs.",
      icon: Shield,
    },
  ]

  return (
    <>
      <section className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center space-y-8 py-12 text-center">
          <div className="space-y-6">
            <Typography variant="h1">Starter Kit Next.js</Typography>
            <Typography className="text-muted-foreground text-lg md:text-xl">
              <span>{siteConfig.seo.siteName} </span>vous permet de construire une application
              moderne et performante avec Next.js, TypeScript. Prête à l&apos;emploi avec tous les
              outils nécessaires pour démarrer votre projet.
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon as LucideIcon

            return (
              <Card key={index} className="gap-0">
                <div className="bg-primary/10 mx-6 mb-3 flex size-10 items-center justify-center rounded-lg md:size-12">
                  <Icon className="text-primary size-5 md:size-6" />
                </div>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold md:text-base">{item.title}</CardTitle>
                  <CardDescription className="mt-1 text-xs wrap-break-word md:text-sm">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>
      <Separator />
      <section className="bg-card/40">
        <div className="container">
          {/* Tech Stack Section */}
          <div className="space-y-8 py-12">
            <Typography variant="h3" className="text-center">
              Technologies utilisées
            </Typography>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                "Next.js 16",
                "React 19",
                "TypeScript 5",
                "Tailwind CSS 4",
                "Shadcn UI",
                "Nuqs",
                "Next Themes",
                "Lucide React",
              ].map((tech) => (
                <div
                  key={tech}
                  className="hover:bg-accent rounded-lg border p-4 text-center text-sm font-medium md:text-base"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
