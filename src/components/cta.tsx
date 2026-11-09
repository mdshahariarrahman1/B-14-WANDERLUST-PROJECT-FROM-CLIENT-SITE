import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

export function Cta() {
  return (
    <section
      id="get-started"
      aria-labelledby="cta-title"
      className="relative isolate flex min-h-100 items-center justify-center overflow-hidden bg-neutral-950 py-16 text-center text-white mt-12 sm:min-h-110 lg:py-0"
    >
      <Image
        src="/images/CTA.png"
        alt="Aerial view of an airplane flying over a tropical island surrounded by turquoise reefs"
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/30" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-32 bg-linear-to-b from-black/90 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-linear-to-t from-black/85 to-transparent"
      />

      <div className="mx-auto flex w-full max-w-360 flex-col items-center px-6">
        <h2
          id="cta-title"
          className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:leading-[1.1]"
        >
          Ready To Start Your Journey?
        </h2>

        <p className="mt-5 max-w-155 text-lg font-light text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-xl">
          Join thousands of travelers who have discovered the world with us
        </p>

        <Link
          href="#destinations"
          className="group mt-12 inline-flex h-14 w-full max-w-70 items-center justify-center gap-6 bg-white px-6 text-sm font-semibold uppercase tracking-[0.02em] text-neutral-900 transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-70 sm:px-0 sm:text-base"
        >
          Book Your Trip Today
          <ArrowRightIcon
            aria-hidden="true"
            className="size-5 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  )
}
