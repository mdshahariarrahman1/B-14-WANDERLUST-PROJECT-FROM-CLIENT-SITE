import * as React from "react"
import Link from "next/link"
import { headers } from "next/headers"
import { ArrowRightIcon } from "lucide-react"

import { normalizeDestination } from "@/app/destinations/normalize"
import type { Destination } from "@/app/destinations/catalog"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { API_BASE_URL } from "@/lib/api"
import { auth } from "@/lib/auth"

const FEATURED_COUNT = 5;

export function FeaturedDestinations() {
  return (
    <section
      id="featured-destinations"
      aria-labelledby="featured-destinations-title"
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-360 px-6 lg:px-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="featured-destinations-title"
              className="text-4xl font-normal tracking-[-0.03em] text-neutral-950 sm:text-5xl lg:text-6xl"
            >
              Featured Destinations
            </h2>
            <p className="mt-3 text-lg font-light text-neutral-600">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex h-14 shrink-0 items-center justify-center gap-3 border border-brand px-6 text-[15px] font-medium tracking-widest text-brand uppercase transition-colors hover:bg-brand/5 hover:text-brand-dark"
          >
            All destinations
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <React.Suspense fallback={<FeaturedCarouselFallback />}>
          <FeaturedDestinationsData />
        </React.Suspense>
      </div>
    </section>
  )
}

// Same pattern as /destinations: stream the uncached backend read inside a
// Suspense boundary, normalize both document shapes, and degrade gracefully.
async function FeaturedDestinationsData() {
  let destinations: Destination[] = [];
  let failed = false;

  try {
    const jwtToken = await auth.api.getToken({ headers: await headers() });

    if (!jwtToken?.token) {
      throw new Error("No active session.");
    }

    const response = await fetch(`${API_BASE_URL}/destinations`, {
      headers: { authorization: `Bearer ${jwtToken.token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `The destinations request failed with status ${response.status}`
      );
    }

    const documents = (await response.json()) as Destination[];
    destinations = documents.map(normalizeDestination).slice(0, FEATURED_COUNT);
  } catch {
    failed = true;
  }

  if (failed || destinations.length === 0) {
    return (
      <p className="mt-12 text-lg font-light text-neutral-600">
        Could not load destinations. Is the backend server running?
      </p>
    );
  }

  return <FeaturedCarousel destinations={destinations} />
}

function FeaturedCarouselFallback() {
  return (
    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:hidden" aria-hidden>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-65/40 w-full bg-neutral-100" />
          <div className="mt-5 h-4 w-24 bg-neutral-100" />
          <div className="mt-3 h-7 w-2/3 bg-neutral-100" />
          <div className="mt-3 h-4 w-32 bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}
