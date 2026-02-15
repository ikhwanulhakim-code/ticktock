import Link from "next/link";

export function PageFooter() {
  return (
    <footer className="border-t py-6">
      <div className="mx-auto max-w-3xl px-4 space-y-3">
        <nav
          aria-label="Footer navigation"
          className="flex items-center justify-center gap-4 text-xs"
        >
          <Link
            href="/about"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <span className="text-muted-foreground/40" aria-hidden="true">·</span>
          <Link
            href="/how-it-works"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </Link>
          <span className="text-muted-foreground/40" aria-hidden="true">·</span>
          <a
            href="https://github.com/ikhwanulhakim-code/ticktock"
            target="_blank"
            rel="noopener me"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TickTock. Free countdown timer for everyone.
        </p>
      </div>
    </footer>
  );
}
