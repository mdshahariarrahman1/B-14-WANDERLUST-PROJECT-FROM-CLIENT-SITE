import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  MapPinnedIcon,
  WalletIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@/components/booking/BookingListCard";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { auth } from "@/lib/auth";

const BOOKINGS_API =
  `${process.env.BACKEND_URL ?? "http://localhost:5000"}/bookings`;

type TravelStats = {
  /** Number of bookings, or null when the booking service is unreachable. */
  trips: number | null;
  /** Sum of numeric booking prices, or null when unavailable. */
  totalSpent: number | null;
  /** Earliest upcoming departure date, or null when there is none. */
  nextDeparture: Date | null;
};

export default function ProfilePage() {
  return (
    <section className="min-h-[60vh] bg-neutral-50 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-medium tracking-[-0.04em] text-neutral-950 sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-2 text-base text-neutral-600">
            Manage your account and review your travel activity
          </p>
        </header>

        <Suspense fallback={<ProfileFallback />}>
          <ProfileContent />
        </Suspense>
      </div>
    </section>
  );
}

async function ProfileContent() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.email) {
    redirect("/login");
  }

  const user = session.user;
  const bookings = await fetchUserBookings(user.email);
  const stats = buildTravelStats(bookings);

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
      <aside className="lg:sticky lg:top-24">
        <Card className="rounded-2xl border border-neutral-200 bg-white py-8 shadow-none [--card-spacing:--spacing(6)]">
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="size-24 text-3xl">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || "Profile photo"}
              />
              <AvatarFallback className="bg-neutral-100 text-brand">
                {initialFor(user.name, user.email)}
              </AvatarFallback>
            </Avatar>

            <h2 className="mt-4 text-2xl font-medium tracking-[-0.03em] text-neutral-950">
              {user.name || "Traveler"}
            </h2>
            <p className="mt-1 text-sm break-all text-neutral-600">
              {user.email}
            </p>

            <span
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                user.emailVerified
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {user.emailVerified ? (
                <CheckCircle2Icon className="size-3.5" />
              ) : (
                <Clock3Icon className="size-3.5" />
              )}
              {user.emailVerified ? "Email verified" : "Email unverified"}
            </span>

            <div className="mt-6 w-full space-y-4 border-t border-neutral-200 pt-6 text-left">
              <StatRow
                icon={<MapPinnedIcon className="size-5" />}
                label="Trips booked"
                value={
                  stats.trips === null
                    ? "—"
                    : String(stats.trips)
                }
              />
              <StatRow
                icon={<WalletIcon className="size-5" />}
                label="Total spent"
                value={
                  stats.totalSpent === null
                    ? "—"
                    : `$${stats.totalSpent.toLocaleString("en-US")}`
                }
              />
              <StatRow
                icon={<CalendarDaysIcon className="size-5" />}
                label="Next departure"
                value={describeNextDeparture(stats)}
              />
            </div>

            {stats.trips === null && (
              <p className="mt-4 w-full text-left text-xs text-neutral-500">
                Travel stats are unavailable — the booking service could not be
                reached.
              </p>
            )}

            <Button
              nativeButton={false}
              render={<Link href="/bookings" />}
              className="mt-6 w-full rounded-md bg-brand text-[15px] text-white hover:bg-brand-dark"
            >
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </aside>

      <ProfileTabs
        user={{
          name: user.name ?? null,
          email: user.email,
          image: user.image ?? null,
        }}
      />
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="truncate text-lg font-semibold text-neutral-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function ProfileFallback() {
  return (
    <div
      className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start"
      aria-label="Loading profile"
    >
      <Skeleton className="h-110 rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-56 rounded-md" />
        <Skeleton className="h-105 rounded-2xl" />
      </div>
    </div>
  );
}

async function fetchUserBookings(email: string): Promise<Booking[] | null> {
  try {
    const jwtToken = await auth.api.getToken({ headers: await headers() });

    if (!jwtToken?.token) {
      return null;
    }

    const response = await fetch(getUserBookingsUrl(email), {
      headers: { authorization: `Bearer ${jwtToken.token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const bookings: unknown = await response.json();

    return Array.isArray(bookings) ? (bookings as Booking[]) : null;
  } catch (error) {
    console.error("Could not load bookings for profile stats:", error);
    return null;
  }
}

function getUserBookingsUrl(email: string) {
  const url = new URL(BOOKINGS_API);
  url.pathname = url.pathname.replace(/\/+$/, "");

  if (!url.pathname.endsWith("/bookings")) {
    url.pathname += "/bookings";
  }

  url.pathname += `/${encodeURIComponent(email)}`;
  return url;
}

function buildTravelStats(bookings: Booking[] | null): TravelStats {
  if (!bookings) {
    return { trips: null, totalSpent: null, nextDeparture: null };
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  let totalSpent = 0;
  const upcoming: Date[] = [];

  for (const booking of bookingDates(bookings)) {
    if (booking.date.getTime() >= startOfToday.getTime()) {
      upcoming.push(booking.date);
    }
  }

  for (const booking of bookings) {
    const price = Number(booking.price);
    if (Number.isFinite(price)) {
      totalSpent += price;
    }
  }

  upcoming.sort((a, b) => a.getTime() - b.getTime());

  return {
    trips: bookings.length,
    totalSpent,
    nextDeparture: upcoming[0] ?? null,
  };
}

function bookingDates(bookings: Booking[]) {
  const parsed: { date: Date }[] = [];

  for (const booking of bookings) {
    const rawDate = booking.travelDate ?? booking.defaultDate;

    if (typeof rawDate !== "string" || !rawDate) {
      continue;
    }

    const date = new Date(`${rawDate.slice(0, 10)}T00:00:00`);

    if (!Number.isNaN(date.getTime())) {
      parsed.push({ date });
    }
  }

  return parsed;
}

function describeNextDeparture(stats: TravelStats) {
  if (stats.trips === null) {
    return "—";
  }

  if (!stats.nextDeparture) {
    return stats.trips === 0 ? "No trips yet" : "None upcoming";
  }

  return formatDate(stats.nextDeparture);
}

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function initialFor(name: string | null | undefined, email?: string | null) {
  return name?.charAt(0)?.toUpperCase() ?? email?.charAt(0)?.toUpperCase() ?? "W";
}
