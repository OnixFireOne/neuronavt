// Favorite reviews live only in this browser: a list of review slugs, newest first.
const STORAGE_KEY = "neuronavt:favorites";
export const FAVORITES_EVENT = "favorites:change";

const REVIEW_HREF = /^\/reviews\/(\d{4}-\d{2}-\d{2}-[^/]+)\/?$/;

export function reviewSlugFromHref(href: string | null): string | null {
  return href ? (REVIEW_HREF.exec(href)?.[1] ?? null) : null;
}

export function getFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    );
    return Array.isArray(value)
      ? value.filter((slug): slug is string => typeof slug === "string")
      : [];
  } catch {
    return [];
  }
}

export function setFavorites(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(slugs)]));
  document.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
}

export function toggleFavorite(slug: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(slug);
  if (index >= 0) favorites.splice(index, 1);
  else favorites.unshift(slug);
  setFavorites(favorites);
  return index < 0;
}
