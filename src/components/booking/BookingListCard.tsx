"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  MapPinIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export type Booking = {
  _id?: string;
  destinationId?: string;
  destinationName?: string;
  name?: string;
  country?: string;
  image?: string;
  imageUrl?: string;
  price?: number | string;
  travelDate?: string;
  defaultDate?: string;
  status?: string;
};

export function BookingListCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const handleCancelBooking = async () => {
    if (!booking._id) {
      toast.add({
        title: "Could not cancel this booking",
        description: "The booking does not have a valid ID.",
        type: "error",
      });
      return;
    }

    setIsCancelling(true);

    try {
      const response = await fetch(
        `/api/bookings/${encodeURIComponent(booking._id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        let message = `The cancellation failed with status ${response.status}.`;

        if (contentType.includes("application/json")) {
          const result: unknown = await response.json();
          if (
            typeof result === "object" &&
            result !== null &&
            "message" in result &&
            typeof result.message === "string"
          ) {
            message = result.message;
          }
        }

        throw new Error(message);
      }

      toast.add({
        title: "Booking cancelled",
        description: `Your booking for ${booking.destinationName ?? booking.name ?? "this trip"} was cancelled.`,
        type: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Booking cancellation failed:", error);
      toast.add({
        title: "Could not cancel this booking",
        description:
          error instanceof Error
            ? error.message
            : "The booking service could not complete your request.",
        type: "error",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const destinationId = booking.destinationId ?? booking._id;
  const name = booking.destinationName ?? booking.name ?? "Travel booking";
  const image = booking.image ?? booking.imageUrl ?? "/images/Banner.png";
  const travelDate = booking.travelDate ?? booking.defaultDate;
  const status = booking.status ?? "confirmed";
  const normalizedStatus = status.toLowerCase();
  const isConfirmed = normalizedStatus === "confirmed";
  const price = Number(booking.price);

  return (
    <article className="grid gap-5 border rounded-2xl border-neutral-200 bg-white p-4 sm:grid-cols-[260px_minmax(0,1fr)] sm:items-center sm:p-5">
      <div className="relative h-48 overflow-hidden sm:h-40">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 260px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col items-start">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            isConfirmed
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {isConfirmed ? (
            <CheckCircle2Icon className="size-3.5" />
          ) : (
            <Clock3Icon className="size-3.5" />
          )}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>

        <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-neutral-950">
          {name}
        </h2>

        <p className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
          <CalendarDaysIcon className="size-4 shrink-0" />
          Departure: {formatTravelDate(travelDate)}
        </p>
        {booking.country && (
          <p className="mt-1 flex items-center gap-2 text-sm text-neutral-600">
            <MapPinIcon className="size-4 shrink-0" />
            {booking.country}
          </p>
        )}
        {booking._id && (
          <p className="mt-1 text-sm text-neutral-600">
            Booking ID: {booking._id.slice(-6)}
          </p>
        )}

        <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-4">
          <p className="text-2xl font-semibold text-brand">
            {Number.isFinite(price)
              ? `$${price.toLocaleString("en-US")}`
              : "Price unavailable"}
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={handleCancelBooking}
              disabled={isCancelling}
              variant="outline"
              aria-label={`Cancel booking for ${name}`}
              className="rounded-lg border-red-300 px-4 text-red-600 hover:border-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2Icon />
              {isCancelling ? "Cancelling..." : "Cancel"}
            </Button>
            {destinationId && (
              <Button
                nativeButton={false}
                render={
                  <Link
                    href={`/destinations/${encodeURIComponent(destinationId)}`}
                  />
                }
                className="rounded-lg bg-brand px-5 text-white hover:bg-brand-dark"
              >
                View
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function formatTravelDate(date: string | undefined) {
  if (!date) {
    return "Date not selected";
  }

  const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}
