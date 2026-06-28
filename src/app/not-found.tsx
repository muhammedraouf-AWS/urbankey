import Link from "next/link"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-serif text-8xl font-semibold text-muted-foreground/30">404</p>
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">Page Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Return Home
      </Link>
    </main>
  )
}
