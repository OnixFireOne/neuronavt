import type { CollectionEntry } from "astro:content";
import config from "@/config";

export function reviewFilter({ data }: CollectionEntry<"reviews">) {
  const isPublishTimePassed = Date.now() > data.pubDatetime.getTime() - config.posts.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
}
