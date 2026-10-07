import type { CollectionEntry } from "astro:content";
import { reviewFilter } from "./reviewFilter";

export function getSortedReviews(reviews: CollectionEntry<"reviews">[]) {
  return reviews.filter(reviewFilter).sort((a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime());
}
