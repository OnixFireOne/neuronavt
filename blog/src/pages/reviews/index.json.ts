import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getSortedReviews } from "@/utils/getSortedReviews";
import { getReviewSlug } from "@/utils/getReviewPaths";
import { reviewTypes } from "@/utils/reviewTypes";
import config from "@/config";

dayjs.extend(utc);
dayjs.extend(timezone);

// Card data for the favorites page, which renders in the browser.
export const GET: APIRoute = async () => {
  const reviews = getSortedReviews(await getCollection("reviews"));
  const items = reviews.map(review => {
    const { title, description, pubDatetime, content_type, value_score } =
      review.data;
    const date = dayjs(pubDatetime).tz(config.site.timezone);
    return {
      slug: getReviewSlug(review),
      title,
      description,
      datetime: date.toISOString(),
      date: date.format("D MMM, YYYY"),
      type: content_type,
      typeLabel: reviewTypes[content_type],
      score: value_score,
    };
  });
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
