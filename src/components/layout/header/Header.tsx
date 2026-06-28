import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-foreground"
        >
          UrbanKey
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/properties"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Properties
          </Link>
          <Link
            href="/properties?listingType=sale"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Buy
          </Link>
          <Link
            href="/properties?listingType=rent"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Rent
          </Link>
        </nav>
      </div>
    </header>
  )
}
