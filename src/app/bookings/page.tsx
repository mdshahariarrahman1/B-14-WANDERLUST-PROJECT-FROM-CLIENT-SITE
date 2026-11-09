import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  BookingListCard,
  type Booking,
} from "@/components/booking/BookingListCard";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const BOOKINGS_API =
  `${process.env.BACKEND_URL ?? "http://localhost:5000"}/bookings`;

function getUserBookingsUrl(email: string) {
  const url = new URL(BOOKINGS_API);
  url.pathname = url.pathname.replace(/\/+$/, "");

  if (!url.pathname.endsWith("/bookings")) {
    url.pathname += "/bookings";
  }

  url.pathname += `/${encodeURIComponent(email)}`;
  return url;
}

export default function BookingsPage() {
  return (
    <section className="min-h-[60vh] bg-neutral-50 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-medium tracking-[-0.04em] text-neutral-950 sm:text-5xl">
            My Bookings
          </h1>
          <p className="mt-2 text-base text-neutral-600">
            Manage and view your upcoming travel plans
          </p>
        </header>

        <Suspense fallback={<BookingsFallback />}>
          <BookingsContent />
        </Suspense>
      </div>
    </section>
  );
}

async function BookingsContent() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user.email) {
    redirect("/login");
  }

  // better-auth jwt plugin theke token
  const jwtToken = await auth.api.getToken({ headers: requestHeaders });

  if (!jwtToken?.token) {
    redirect("/login");
  }

  const response = await fetch(getUserBookingsUrl(session.user.email), {
    headers: { Authorization: `Bearer ${jwtToken.token}` },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    redirect("/401");
  }

  if (!response.ok) {
    throw new Error(
      `Could not load bookings. The booking service returned status ${response.status}.`
    );
  }

  const bookings: unknown = await response.json();

  if (!Array.isArray(bookings)) {
    throw new Error("The booking service returned an invalid bookings response.");
  }

  const userBookings = bookings as Booking[];

  if (userBookings.length > 0) {
    return (
      <div className="space-y-4">
        {userBookings.map((booking, index) => (
          <BookingListCard
            key={booking._id ?? `${booking.destinationId ?? "booking"}-${index}`}
            booking={booking}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-4 border border-neutral-200 bg-white p-8">
      <p className="text-lg text-neutral-700">
        You don&apos;t have any bookings yet.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/destinations" />}
        className="rounded-none bg-brand text-white hover:bg-brand-dark"
      >
        Explore destinations
      </Button>
    </div>
  );
}

function BookingsFallback() {
  return (
    <div className="space-y-4" aria-label="Loading bookings">
      {[0, 1].map((item) => (
        <div
          key={item}
          className="h-52 animate-pulse rounded-2xl border border-neutral-200 bg-white"
        />
      ))}
    </div>
  );
}