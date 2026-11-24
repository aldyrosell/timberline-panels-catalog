import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-muted-foreground text-sm font-medium">404</p>
      <h1 className="text-3xl font-semibold tracking-tight text-balance">
        We couldn&apos;t find that page
      </h1>
      <p className="text-muted-foreground text-pretty">
        The page may have moved, or the link may be out of date.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground focus-visible:ring-ring mt-2 rounded-[12px] px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Back to home
      </Link>
    </main>
  );
}
