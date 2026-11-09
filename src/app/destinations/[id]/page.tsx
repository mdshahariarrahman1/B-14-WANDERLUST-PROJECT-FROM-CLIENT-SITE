import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";

import type { Destination } from "@/app/destinations/catalog";
import { EditDestinationDialog } from "@/app/destinations/[id]/edit-destination-dialog";
import { DeleteDestinationDialog } from "@/app/destinations/[id]/delete-destination-dialog";
import BookingCard from "@/components/booking/BookingCard";
import { API_BASE_URL, destinationAuthHeaders } from "@/lib/api";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type DestinationDocument = Partial<Destination> & {
  imageUrl?: string;
  description?: string;
  highlights?: string[];
  reviewsCount?: number;
  departureDate?: string;
};

type DestinationDetails = Destination & {
  description: string;
  highlights: string[];
  reviewsCount: number;
  departureDate: string;
};

export default function DestinationDetailsPage({
  params,
}: PageProps<"/destinations/[id]">) {
  return (
    <React.Suspense fallback={<DetailsFallback />}>
      <DestinationDetails params={params} />
    </React.Suspense>
  );
}

async function DestinationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const jwtToken = await auth.api.getToken({ headers: await headers() });

  const response = await fetch(
    `${API_BASE_URL}/destinations/${encodeURIComponent(id)}`,
    { headers: { ...destinationAuthHeaders, authorization: `Bearer ${jwtToken?.token}` } }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(
      `The destination request failed with status ${response.status}`
    );
  }

  const document = (await response.json()) as DestinationDocument;
  const destination = normalizeDestination(document);

  return (
    <section className="bg-white py-8 sm:py-10 mb-20">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Destinations
          </Link>
          <div className="flex items-center gap-3">
            <EditDestinationDialog destination={destination} />
            <DeleteDestinationDialog destination={destination} />
          </div>
        </div>

        <div className="relative h-70 w-full overflow-hidden sm:h-100 lg:h-125">
          <Image
            src={destination.image || "/images/Banner.png"}
            alt={destination.imageAlt || destination.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        <div className="mt-8 grid gap-10 border-t border-neutral-200 pt-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
          <div>
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              <MapPinIcon className="size-4" />
              {destination.country || "Explore"}
            </p>
            <h1 className="mt-2 text-4xl font-normal tracking-[-0.04em] text-neutral-950 sm:text-5xl">
              {destination.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-600">
              {destination.rating > 0 && (
                <span className="inline-flex items-center gap-2">
                  <StarIcon className="size-4 fill-green-600 text-green-600" />
                  <span className="font-medium text-neutral-900">
                    {destination.rating.toFixed(1)}
                  </span>
                  {destination.reviewsCount > 0 &&
                    ` (${destination.reviewsCount} reviews)`}
                </span>
              )}
              {destination.duration && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDaysIcon className="size-4" />
                  {destination.duration}
                </span>
              )}
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-normal tracking-[-0.03em] text-neutral-950">
                Overview
              </h2>
              <p className="mt-3 max-w-4xl text-[15px] leading-6 text-neutral-600">
                {destination.description}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-normal tracking-[-0.03em] text-neutral-950">
                Highlights
              </h2>
              <p className="mt-3 max-w-4xl text-[15px] leading-6 text-neutral-600">
                Make the most of your stay with a thoughtfully curated trip to{" "}
                {destination.name}.
              </p>
              <ul className="mt-5 grid gap-x-8 gap-y-4 text-sm text-neutral-600 sm:grid-cols-2">
                {destination.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-600" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <BookingCard destination={destination} />
        </div>
      </div>
    </section>
  );
}

function normalizeDestination(
  document: DestinationDocument
): DestinationDetails {
  return {
    _id: document._id ?? "",
    name: document.name ?? "Untitled destination",
    country: document.country ?? "",
    category: document.category ?? "",
    price: Number(document.price) || 0,
    duration: document.duration ?? "",
    rating: Number(document.rating) || 0,
    image: document.image ?? document.imageUrl ?? "",
    imageAlt: document.imageAlt ?? document.name ?? "",
    description:
      document.description ??
      `Discover the highlights of ${document.name ?? "this destination"}${
        document.country ? ` in ${document.country}` : ""
      } and enjoy a memorable travel experience.`,
    highlights:
      document.highlights?.filter((highlight) => highlight.trim().length > 0) ??
      [
        "Comfortable accommodation",
        "Curated local experiences",
        "Flexible travel dates",
        "Dedicated travel support",
      ],
    reviewsCount: Number(document.reviewsCount) || 0,
    departureDate: document.departureDate ?? "",
  };
}

function DetailsFallback() {
  return (
    <div
      className="mx-auto w-full max-w-360 animate-pulse px-5 py-10 sm:px-8 lg:px-20"
      aria-hidden
    >
      <div className="h-5 w-44 bg-neutral-100" />
      <div className="mt-6 h-70 w-full bg-neutral-100 sm:h-100 lg:h-125" />
      <div className="mt-8 h-7 w-48 bg-neutral-100" />
      <div className="mt-4 h-12 w-80 bg-neutral-100" />
      <div className="mt-8 h-24 w-full bg-neutral-100" />
    </div>
  );
}