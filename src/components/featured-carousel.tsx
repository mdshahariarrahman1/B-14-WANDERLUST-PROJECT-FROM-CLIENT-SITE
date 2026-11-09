"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import type { Destination } from "@/app/destinations/catalog"

export function FeaturedCarousel({
  destinations,
}: {
  destinations: Destination[]
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const snapCount = React.useMemo(
    () => api?.scrollSnapList().length ?? destinations.length,
    [api, destinations.length]
  )

  // Track the selected snap index and arrow availability through the Embla
  // API so the counter/progress line stay in sync with scroll and resize.
  React.useEffect(() => {
    if (!api) return

    const update = () => {
      setCurrent(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }

    update()
    api.on("select", update)
    api.on("reInit", update)

    return () => {
      api.off("select", update)
      api.off("reInit", update)
    }
  }, [api])

  return (
    <Carousel setApi={setApi} opts={{ align: "start" }} className="mt-12">
      <CarouselContent>
        {destinations.map((destination) => (
          <CarouselItem
            key={destination._id}
            className="basis-[86%] sm:basis-[52%] lg:basis-[46%]"
          >
            <article className="flex flex-col">
              <div className="relative">
                {destination.image ? (
                  <Image
                    src={destination.image}
                    alt={destination.imageAlt || destination.name}
                    width={800}
                    height={520}
                    sizes="(min-width: 1024px) 45vw, (min-width: 640px) 52vw, 86vw"
                    className="aspect-65/40 w-full object-cover"
                  />
                ) : (
                  <div className="aspect-65/40 w-full bg-neutral-100" aria-hidden />
                )}
                {destination.rating > 0 && (
                  <span className="absolute right-4 top-4 flex items-center gap-1.5 bg-white px-3 h-9 text-sm font-medium text-neutral-950">
                    {destination.rating}
                    <StarIcon className="size-4 fill-neutral-950 text-neutral-950" />
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col pt-5">
                <p className="flex items-center gap-2 text-sm text-neutral-600">
                  <MapPinIcon className="size-4 text-neutral-950" />
                  {destination.country}
                </p>

                <div className="mt-2 flex items-end justify-between gap-4">
                  <h3 className="text-2xl font-normal tracking-[-0.02em] text-neutral-950 sm:text-3xl">
                    {destination.name}
                  </h3>
                  <p className="whitespace-nowrap">
                    <span className="text-2xl text-neutral-950 sm:text-3xl">
                      ${destination.price}
                    </span>
                    <span className="text-sm text-neutral-500">/Person</span>
                  </p>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
                  <CalendarIcon className="size-4 text-neutral-950" />
                  {destination.duration}
                </p>

                <Link
                  href={`/destinations/${destination._id}`}
                  className="mt-4 inline-flex w-fit items-center gap-1 text-[15px] font-medium tracking-wide text-brand uppercase underline underline-offset-4 hover:text-brand-dark"
                >
                  Book now
                  <ArrowUpRightIcon className="size-3.5" />
                </Link>
              </div>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="mt-14 flex items-center gap-8">
        <p className="whitespace-nowrap text-xl font-light text-neutral-950">
          {current + 1}/{snapCount}
        </p>

        <div className="relative h-px flex-1 bg-neutral-200" aria-hidden="true">
          <div
            className="absolute inset-y-0 bg-neutral-950 transition-all duration-300"
            style={{
              width: `${100 / snapCount}%`,
              left: `${(current * 100) / snapCount}%`,
            }}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous destinations"
            className="flex size-14 items-center justify-center rounded-full border border-neutral-200 text-neutral-950 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next destinations"
            className="flex size-14 items-center justify-center rounded-full border border-neutral-200 text-neutral-950 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowRightIcon className="size-5" />
          </button>
        </div>
      </div>
    </Carousel>
  )
}
