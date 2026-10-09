import {
  FAVORITES_EVENT,
  getFavorites,
  reviewSlugFromHref,
  toggleFavorite,
} from "@/utils/favorites";

// Star toggles are added on the client so review cards rendered by the site
// and cards inside generated digest posts get the same button.
const STAR_PATH =
  "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z";

function createButton(slug: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "radar-fav";
  button.dataset.favSlug = slug;
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
  return button;
}

function addButtons() {
  document.querySelectorAll<HTMLElement>("[data-fav-host]").forEach(host => {
    const slug = host.dataset.favHost;
    if (slug && !host.querySelector(".radar-fav"))
      host.append(createButton(slug));
  });
  document.querySelectorAll<HTMLElement>(".radar-card").forEach(card => {
    const head = card.querySelector(".radar-card-head");
    if (!head || head.querySelector(".radar-fav")) return;
    const link = [...card.querySelectorAll("a")].find(a =>
      reviewSlugFromHref(a.getAttribute("href"))
    );
    const slug = reviewSlugFromHref(link?.getAttribute("href") ?? null);
    if (slug) head.append(createButton(slug));
  });
}

function syncButtons() {
  const favorites = new Set(getFavorites());
  document.querySelectorAll<HTMLButtonElement>(".radar-fav").forEach(button => {
    const active = favorites.has(button.dataset.favSlug ?? "");
    const label = active ? "Убрать из избранного" : "В избранное";
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", label);
    button.title = label;
  });
}

export function refreshFavoriteButtons() {
  addButtons();
  syncButtons();
}

document.addEventListener("click", event => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
    ".radar-fav"
  );
  if (!button?.dataset.favSlug) return;
  event.preventDefault();
  toggleFavorite(button.dataset.favSlug);
});

document.addEventListener(FAVORITES_EVENT, syncButtons);
window.addEventListener("storage", syncButtons);
document.addEventListener("astro:page-load", refreshFavoriteButtons);
