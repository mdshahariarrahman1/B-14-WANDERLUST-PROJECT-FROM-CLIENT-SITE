import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000";

const bookingUrl = new URL(API_BASE_URL);
bookingUrl.pathname = bookingUrl.pathname.replace(/\/+$/, "");
if (!bookingUrl.pathname.endsWith("/bookings")) {
  bookingUrl.pathname += "/bookings";
}

export async function POST(request: Request) {
  const tokenResult = await auth.api
    .getToken({ headers: await headers() })
    .catch(() => null);

  if (!tokenResult?.token) {
    return Response.json(
      { message: "Sign in to book a destination." },
      { status: 401 }
    );
  }

  let upstream: Response;

  try {
    upstream = await fetch(bookingUrl, {
      method: "POST",
      headers: {
        "Content-Type":
          request.headers.get("content-type") ?? "application/json",
        authorization: `Bearer ${tokenResult.token}`,
      },
      body: await request.text(),
    });
  } catch (error) {
    console.error("Booking request failed:", error);
    return Response.json(
      { message: "Could not connect to the booking service." },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const contentType = upstream.headers.get("content-type") ?? "";
    let message = `The booking service returned status ${upstream.status}.`;

    if (contentType.includes("application/json")) {
      const result: unknown = await upstream.json();
      if (
        typeof result === "object" &&
        result !== null &&
        "message" in result &&
        typeof result.message === "string"
      ) {
        message = result.message;
      }
    } else {
      console.error(
        `Booking service returned status ${upstream.status} with a non-JSON response.`
      );
    }

    return Response.json({ message }, { status: upstream.status });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
