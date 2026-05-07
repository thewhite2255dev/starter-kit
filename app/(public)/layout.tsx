import { AppHeader } from "@/components/shared/app-header"
import { ScrollToTop } from "@/components/shared/scroll-to-top"
import { siteConfig } from "@/lib/site.config"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader siteName={siteConfig.seo.siteName} />
      <main className="flex-1 overflow-hidden">{children}</main>
      <ScrollToTop />
    </>
  )
}
