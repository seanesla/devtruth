import Link from "next/link"
import { DevTruthTextLogo } from "@/components/devtruth-text-logo"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <DevTruthTextLogo className="h-5 w-auto" />
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-8">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Documentation
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              API
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Changelog
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Status
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
