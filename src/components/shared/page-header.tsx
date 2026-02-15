import Image from "next/image";
import Link from "next/link";

export function PageHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/app_icon.webp"
            alt=""
            width={28}
            height={28}
            className="rounded"
            priority
          />
          <span className="text-2xl font-bold tracking-tight">
            Tick<span className="text-primary/60">Tock</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="hidden sm:inline">How It Works</span>
            <span className="sm:hidden">How</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
