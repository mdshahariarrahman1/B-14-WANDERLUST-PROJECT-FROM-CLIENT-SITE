import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000";

function getBookingUrl(id: string) {
  const url = new URL(API_BASE_URL);
  url.pathname = url.pathname.replace(/\/+$/, "");

  if (!url.pathname.endsWith("/bookings")) {
    url.pathname += "/bookings";
  }

  url.pathname += `/${encodeURIComponent(id)}`;
  return url;
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/bookings/[id]">
) {
  const session = await auth.api.getSession({ headers: await headers() });
  const tokenResult = await auth.api
    .getToken({ headers: await headers() })
    .catch(() => null);

  if (!session?.user.email || !tokenResult?.token) {
    return Response.json({ message: "Sign in to cancel a booking." }, { status: 401 });
  }

  const { id } = await params;
  let upstream: Response;

  try {
    upstream = await fetch(getBookingUrl(id), {
      method: "DELETE",
      headers: {
        "x-user-email": session.user.email,
        authorization: `Bearer ${tokenResult.token}`,
      },
    });
  } catch (error) {
    console.error("Booking cancellation request failed:", error);
    return Response.json(
      { message: "Could not connect to the booking service." },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
