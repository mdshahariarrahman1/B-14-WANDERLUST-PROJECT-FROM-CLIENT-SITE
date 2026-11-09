import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "cn"

const SEARCH_FIELDS = [
  { id: "location", label: "Location", value: "Address, City Or Zip" },
  { id: "date", label: "Date/Duration", value: "Anytime/3 Days" },
  { id: "budget", label: "Budget", value: "$0 - $3000" },
  { id: "people", label: "People", value: "5-10" },
]

export function Banner() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-neutral-900 text-white"
    >
      <Image
        src="/images/Banner.png"
        alt="Aerial view of a turquoise bay surrounded by forested hills and a coastal village"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      <div className="flex min-h-[calc(100svh-76px)] flex-col">
        <div className="mx-auto flex w-full max-w-360 flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-20 lg:px-10 lg:pb-20 lg:pt-28">
          <h1
            id="hero-title"
            className="text-[clamp(2.75rem,6.6vw,6rem)] font-light leading-[0.95] tracking-[-0.03em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
          >
            <span className="block">Discover Your</span>
            <span className="block">Next Adventure</span>
          </h1>

          <p className="mt-6 max-w-170 text-base font-light leading-relaxed text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-lg lg:mt-7 lg:text-xl">
            Explore breathtaking destinations and create unforgettable memories
            with our curated travel experiences.
          </p>

          <div className="mt-9 flex w-full max-w-107.5 flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:mt-10 lg:gap-5">
            <Link
              href="/destinations"
              className="group inline-flex h-14 w-full items-center justify-center gap-5 bg-brand px-8 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-50 sm:px-0"
            >
              Explore Now
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/destinations"
              className="inline-flex h-14 w-full items-center justify-center border border-white/25 bg-white/25 px-8 text-sm font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm transition-colors hover:bg-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-50 sm:px-0"
            >
              View Destination
            </Link>
          </div>
        </div>

        <div
          role="search"
          aria-label="Search destinations"
          className="w-full border-t border-white/20 bg-white/20 backdrop-blur-[6px]"
        >
          <div className="mx-auto flex max-w-360 flex-col lg:flex-row">
            <div className="grid flex-1 grid-cols-2 lg:grid-cols-4">
              {SEARCH_FIELDS.map((field, index) => (
                <label
                  key={field.id}
                  className={cn(
                    "min-w-0 px-5 py-4 sm:px-6 lg:border-l lg:border-white/20 lg:px-10 lg:py-5 lg:first:border-l-0",
                    index % 2 === 1 && "border-l border-white/20",
                    index >= 2 && "border-t border-white/20 lg:border-t-0"
                  )}
                >
                  <span className="block text-lg font-semibold text-white sm:text-xl">
                    {field.label}
                  </span>
                  <input
                    name={field.id}
                    defaultValue={field.value}
                    className="mt-0.5 w-full min-w-0 bg-transparent text-[15px] text-white/85 outline-none placeholder:text-white/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              className="min-h-14 bg-brand px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white lg:min-h-25 lg:w-40 lg:shrink-0 lg:text-[22px]"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
