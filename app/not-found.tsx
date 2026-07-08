import Link from "next/link";
import Logo from "@/components/layout/Logo";
import GoBackButton from "@/components/layout/GoBackButton";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col">
      <header className="relative flex h-[60px] shrink-0 items-center border-b border-border bg-surface-2 lg:h-24">
        {/* <640: left */}
        <Link href="/dashboard" className="flex items-center pl-6 sm:hidden">
          <Logo size="sm" />
        </Link>

        {/* 640–1024: centered */}
        <Link
          href="/dashboard"
          className="absolute left-1/2 hidden -translate-x-1/2 sm:flex lg:hidden"
        >
          <Logo size="md" />
        </Link>

        {/* 1024+: left, same inset as the real Header's logo zone */}
        <Link
          href="/dashboard"
          className="hidden items-center pl-heading-gap lg:flex"
        >
          <Logo size="md" />
        </Link>
      </header>

      <main className="not-found-glow relative flex flex-1 items-center justify-center px-6 py-10">
        <div className="max-w-[480px] text-center">
          <p className="mb-heading-gap text-[13px] font-medium tracking-[2px] text-primary">
            ERROR · 404
          </p>
          <p className="not-found-number mb-heading-gap font-brand text-[64px] leading-none font-bold sm:text-[96px]">
            404
          </p>
          <h1 className="mb-2.5 text-[22px] font-semibold tracking-[-0.2px] text-foreground">
            Page not found
          </h1>
          <p className="mb-8 text-[14.5px] leading-[1.6] text-text-2">
            The screen you&apos;re looking for doesn&apos;t exist, was moved,
            or the link is broken.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button nativeButton={false} render={<Link href="/dashboard" />}>
              Back to dashboard
            </Button>
            <GoBackButton />
          </div>
        </div>
      </main>
    </div>
  );
}
