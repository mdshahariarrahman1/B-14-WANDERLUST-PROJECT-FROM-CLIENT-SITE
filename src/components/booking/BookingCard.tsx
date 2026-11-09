"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Destination } from "@/app/destinations/catalog";
import { toast } from "@/components/ui/toast";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

const BookingCard = ({ destination }: { destination: Destination }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookNow = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const travelDate = formData.get("defaultDate");

    if (typeof travelDate !== "string" || !travelDate) {
      toast.add({
        title: "Choose a travel date",
        description: "Select a date before booking this destination.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.name,
          email: user?.email,
          destinationId: destination._id,
          destinationName: destination.name,
          country: destination.country,
          category: destination.category,
          duration: destination.duration,
          image: destination.image,
          travelDate,
          price: destination.price,
          bookingDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        let message = `The booking request failed with status ${response.status}.`;

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
        title: "Booking submitted",
        description: `Your trip to ${destination.name} has been booked.`,
        type: "success",
      });
      router.push("/bookings");
    } catch (error) {
      console.error("Booking request failed:", error);
      toast.add({
        title: "Could not complete the booking",
        description:
          error instanceof Error
            ? error.message
            : "The booking service could not complete your request.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card className="h-fit rounded-none border-0 bg-white py-0 shadow-none ring-1 ring-neutral-200 lg:sticky lg:top-6">
        <CardContent className="p-5 sm:p-6">
          <p className="text-sm text-neutral-500">Starting from</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-0.04em] text-brand">
            ${destination.price.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-sm text-neutral-500">per person</p>

          <label className="sr-only" htmlFor="trip-date">
            Select your travel date
          </label>
          <form onSubmit={handleBookNow}>
            <Input
              id="trip-date"
              type="date"
              name="defaultDate"
              required
              className="mt-10 h-12 rounded-lg border-neutral-200 bg-neutral-50 px-4 text-base"
            />
            <div className="my-5 border-t border-neutral-200" />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full justify-between rounded-none bg-brand px-5 text-base text-white hover:bg-brand-dark"
            >
              {isSubmitting ? "Booking..." : "Book Now"}
              <ArrowRightIcon />
            </Button>
          </form>
          <ul className="mt-5 space-y-3 text-sm text-neutral-600">
            {[
              "Free cancellation up to 7 days",
              "Travel insurance included",
              "24/7 customer support",
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <CheckIcon className="size-4 shrink-0 text-green-600" />
                {benefit}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCard;
