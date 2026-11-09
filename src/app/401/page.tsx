import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl px-6 lg:px-20">
        <p className="text-sm font-medium tracking-widest text-brand uppercase">
          401
        </p>
        <h1 className="mt-3 text-4xl font-normal tracking-[-0.03em] text-neutral-950 sm:text-5xl">
          Unauthorized
        </h1>
        <p className="mt-4 text-lg font-light text-neutral-600">
          Your session has expired or you do not have permission to view this
          page. Please sign in again.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/login" />}
          className="mt-8 h-12 rounded-none bg-brand px-6 text-white hover:bg-brand-dark"
        >
          Sign in
        </Button>
      </div>
    </section>
  );
}
