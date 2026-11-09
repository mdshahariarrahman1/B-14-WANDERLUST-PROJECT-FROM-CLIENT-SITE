import type { Destination } from "./catalog";

export type DestinationDocument = Partial<Destination> & {
  // Form-submitted documents carry these instead of image/imageAlt.
  imageUrl?: string;
  description?: string;
};

// The backend stores whatever was posted; form submissions have an
// imageUrl/description shape while the seeded documents have image/rating
// ones. Normalize every document so the catalog always gets renderable data.
// Lives outside the client-only catalog module so server components can call it.
export function normalizeDestination(
  document: DestinationDocument
): Destination {
  return {
    _id: document._id ?? "",
    name: document.name ?? "Untitled destination",
    country: document.country ?? "",
    category: document.category ?? "",
    price: Number(document.price) || 0,
    duration: document.duration ?? "",
    rating: Number(document.rating) || 0,
    // Form documents store the URL in imageUrl; seeded ones use image.
    image: document.image ?? document.imageUrl ?? "",
    imageAlt: document.imageAlt ?? document.name ?? "",
  };
}
