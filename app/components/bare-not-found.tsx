"use client";
import { Link } from "react-router";
import { useSiteSkin } from "./site-skin";

export function BareNotFound() {
  const { buttonVariants } = useSiteSkin();
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 px-4 md:px-6 lg:px-8 min-h-screen bg-background text-center text-foreground"
    >
      <h1 className="m-0 scroll-mt-20 py-4 mb-4 typo-headline">404</h1>
      <p className="m-0 scroll-mt-20 text-foreground text-base leading-6 sm:text-lg sm:leading-7">This style template does not exist.</p>
      <Link to="/" className={buttonVariants.outline}>
        Back to Docs
      </Link>
    </div>
  );
}
