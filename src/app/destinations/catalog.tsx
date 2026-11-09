"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Destination = {
  _id: string;
  name: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  imageAlt: string;
};

const PRICE_RANGES = [
  { value: "under-2000", label: "Under $2000", min: 0, max: 2000 },
  { value: "2000-3000", label: "$2000 – $3000", min: 2000, max: 3000 },
  {
    value: "over-3000",
    label: "Over $3000",
    min: 3000,
    max: Number.POSITIVE_INFINITY,
  },
] as const;

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating: High to Low" },
  { value: "duration", label: "Duration: Shortest First" },
] as const;

const controlClassName =
  "h-12 w-full justify-between rounded-[4px] border-none bg-neutral-50 px-4 text-[15px] text-neutral-900 shadow-none uppercase placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-brand/40 md:text-[15px]";

export function DestinationsCatalog({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = React.useState("");
  const [priceRange, setPriceRange] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");

  // The SQL-free version: derive the filters from whatever the database holds.
  const categories = React.useMemo(
    () =>
      [...new Set(destinations.map((destination) => destination.category))].toSorted(),
    [destinations]
  );

  const filtered = React.useMemo(() => {
    let list = destinations;

    if (category) {
      list = list.filter((destination) => destination.category === category);
    }

    if (priceRange) {
      const range = PRICE_RANGES.find(
        (candidate) => candidate.value === priceRange
      );

      if (range) {
        list = list.filter(
          (destination) =>
            destination.price >= range.min && destination.price < range.max
        );
      }
    }

    switch (sortBy) {
      case "price-asc":
        list = list.toSorted((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = list.toSorted((a, b) => b.price - a.price);
        break;
      case "rating":
        list = list.toSorted((a, b) => b.rating - a.rating);
        break;
      case "duration":
        list = list.toSorted(
          (a, b) =>
            Number.parseInt(a.duration, 10) - Number.parseInt(b.duration, 10)
        );
        break;
    }

    return list;
  }, [destinations, category, priceRange, sortBy]);

  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Select
          value={category || null}
          onValueChange={(value) => setCategory(value ?? "")}
        >
          <SelectTrigger
            aria-label="Filter destinations by category"
            className={controlClassName}
          >
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((candidate) => (
              <SelectItem key={candidate} value={candidate}>
                {candidate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priceRange || null}
          onValueChange={(value) => setPriceRange(value ?? "")}
        >
          <SelectTrigger
            aria-label="Filter destinations by price range"
            className={controlClassName}
          >
            <SelectValue placeholder="Price range" />
          </SelectTrigger>
          <SelectContent>
            {PRICE_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy || null}
          onValueChange={(value) => setSortBy(value ?? "")}
        >
          <SelectTrigger
            aria-label="Sort destinations"
            className={controlClassName}
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-6 text-lg font-light text-neutral-600">
        {filtered.length > 0
          ? `Showing ${filtered.length} destination${
              filtered.length === 1 ? "" : "s"
            }`
          : "No destinations match your filters"}
      </p>

      <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((destination) => (
          <article key={destination._id} className="flex flex-col">
            <div className="relative">
              {destination.image ? (
                <Image
                  src={destination.image}
                  alt={destination.imageAlt || destination.name}
                  width={800}
                  height={520}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="h-52 w-full bg-neutral-100" aria-hidden />
              )}
              {destination.rating > 0 && (
                <Badge className="absolute right-4 top-4 h-8 rounded-none bg-white px-3 text-sm font-medium text-neutral-950">
                  {destination.rating}
                  <StarIcon className="fill-neutral-950 text-neutral-950" />
                </Badge>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3 pt-5">
              <p className="flex items-center gap-2 text-sm text-neutral-600">
                <MapPinIcon className="size-4 text-neutral-950" />
                {destination.country}
              </p>

              <div className="flex items-end justify-between gap-4">
                <h2 className="text-2xl font-normal tracking-[-0.02em] text-neutral-950">
                  {destination.name}
                </h2>
                <p className="whitespace-nowrap">
                  <span className="text-2xl text-neutral-950">
                    ${destination.price}
                  </span>
                  <span className="text-sm text-neutral-500">/Person</span>
                </p>
              </div>

              <p className="flex items-center gap-2 text-sm text-neutral-600">
                <CalendarIcon className="size-4" />
                {destination.duration}
              </p>

              <Link
                href={`/destinations/${destination._id}`}
                className="mt-2 inline-flex items-center gap-1 text-[15px] font-medium tracking-wide text-brand uppercase underline underline-offset-4 hover:text-brand-dark"
              >
                Book now
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
