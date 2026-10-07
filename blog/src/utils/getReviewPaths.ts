import type { CollectionEntry } from "astro:content";

export function getReviewSlug(review: CollectionEntry<"reviews">) {
  return (review.filePath ?? review.id).split(/[\\/]/).pop()!.replace(/\.md$/, "");
}
export function getReviewUrl(review: CollectionEntry<"reviews">) {
  return `/reviews/${getReviewSlug(review)}/`;
}
export function getReviewTransitionName(review: CollectionEntry<"reviews">) {
  return `review-${getReviewSlug(review)}`;
}
