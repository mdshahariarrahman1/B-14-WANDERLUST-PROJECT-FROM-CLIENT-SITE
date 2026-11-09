const API_BASE_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

export async function PUT(
  request: Request,
  { params }: RouteContext<"/api/destinations/[id]">
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return Response.json(
      { message: "Sign in to update a destination." },
      { status: 401 }
    );
  }

  let upstream: Response;

  try {
    upstream = await fetch(
      `${API_BASE_URL}/destinations/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            request.headers.get("content-type") ?? "application/json",
          authorization,
        },
        body: await request.text(),
      }
    );
  } catch (error) {
    console.error("Destination update request failed:", error);
    return Response.json(
      { message: "Could not connect to the destination service." },
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

export async function DELETE(
  request: Request,
  { params }: RouteContext<"/api/destinations/[id]">
) {
  const { id } = await params;
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return Response.json(
      { message: "Sign in to delete a destination." },
      { status: 401 }
    );
  }

  let upstream: Response;

  try {
    upstream = await fetch(
      `${API_BASE_URL}/destinations/${encodeURIComponent(id)}`,
      { method: "DELETE", headers: { authorization } }
    );
  } catch (error) {
    console.error("Destination deletion request failed:", error);
    return Response.json(
      { message: "Could not connect to the destination service." },
      { status: 502 }
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: upstream.headers,
  });
}
