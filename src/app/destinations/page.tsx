import * as React from "react";
import Link from "next/link";
import { headers } from "next/headers";

import {
  DestinationsCatalog,
  type Destination,
} from "@/app/destinations/catalog";
import {
  normalizeDestination,
  type DestinationDocument,
} from "@/app/destinations/normalize";
import { API_BASE_URL } from "@/lib/api";
import { auth } from "@/lib/auth";

function DestinationsPage() {
  return (
    <section
      id="destinations"
      aria-labelledby="destinations-title"
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-360 px-6 lg:px-20">
        <h1
          id="destinations-title"
          className="text-4xl font-normal tracking-[-0.03em] text-neutral-950 sm:text-5xl lg:text-6xl"
        >
          Explore All Destinations
        </h1>
        <p className="mt-3 text-lg font-light text-neutral-600 sm:text-xl">
          Find your perfect travel experience from our curated collection
        </p>

        <React.Suspense fallback={<CatalogFallback />}>
          <DestinationsData />
        </React.Suspense>
      </div>
    </section>
  );
}

async function DestinationsData() {
  // Request-time APIs try/catch-er baire rakhte hobe: prerender-e `headers()`
  // Next-er hanging-promise signal diye reject kore, React seta handle kore.
  const requestHeaders = await headers();

  const session = await auth.api
    .getSession({ headers: requestHeaders })
    .catch(() => null);

  if (!session?.user) {
    return <LoginRequired />;
  }

  const jwtToken = await auth.api
    .getToken({ headers: requestHeaders })
    .catch(() => null);

  if (!jwtToken?.token) {
    return <LoginRequired />;
  }

  let destinations: Destination[] = [];
  let status: "ok" | "unauthorized" | "failed" = "ok";

  try {
    const response = await fetch(`${API_BASE_URL}/destinations`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${jwtToken.token}` },
    });

    if (response.status === 401 || response.status === 403) {
      status = "unauthorized";
    } else if (!response.ok) {
      throw new Error(
        `The destinations request failed with status ${response.status}`,
      );
    } else {
      const documents = (await response.json()) as DestinationDocument[];
      destinations = documents.map(normalizeDestination);
    }
  } catch (error) {
    console.error("Failed to load destinations:", {
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    status = "failed";
  }

  if (status === "unauthorized") {
    return <LoginRequired expired />;
  }

  if (status === "failed" || destinations.length === 0) {
    return <DestinationsUnavailable />;
  }

  return <DestinationsCatalog destinations={destinations} />;
}

function LoginRequired({ expired = false }: { expired?: boolean }) {
  return (
    <p className="mt-10 text-lg font-light text-neutral-600">
      {expired
        ? "Your session has expired. "
        : "You need to be signed in to explore destinations. "}
      <Link href="/login" className="text-neutral-950 underline">
        Log in
      </Link>{" "}
      to continue.
    </p>
  );
}

function DestinationsUnavailable() {
  return (
    <p className="mt-10 text-lg font-light text-neutral-600">
      Destinations are temporarily unavailable. Please try again later.
    </p>
  );
}

function CatalogFallback() {
  return (
    <div
      className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-52 w-full bg-neutral-100" />
          <div className="mt-5 h-4 w-24 bg-neutral-100" />
          <div className="mt-3 h-6 w-2/3 bg-neutral-100" />
          <div className="mt-3 h-4 w-32 bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

export default DestinationsPage;