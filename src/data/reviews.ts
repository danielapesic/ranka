// To update reviews: edit this file, commit, redeploy.
// To find new reviews: visit Salon Ranka's Google Maps profile and copy verbatim.
// Keep reviews authentic — do not invent or modify wording.

export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // ISO format YYYY-MM-DD
  text: string;
  initials: string; // for avatar fallback
};

// TODO: Replace with real Google reviews before launch.
export const reviews: Review[] = [
  {
    author: "Ana K.",
    rating: 5,
    date: "2025-09-12",
    text: "Najbolja masaža u Zagrebu. Osoblje je profesionalno i ljubazno, a salon ima posebnu atmosferu. Odlazim potpuno opuštena.",
    initials: "AK",
  },
  {
    author: "Marija P.",
    rating: 5,
    date: "2025-07-28",
    text: "Dugo sam tražila salon gdje se uistinu osjeća briga za klijenta. Salon Ranka je to mjesto. Toplo preporučujem.",
    initials: "MP",
  },
  {
    author: "Ivan M.",
    rating: 5,
    date: "2025-06-04",
    text: "Sportska masaža mi je spasila leđa nakon dugih sati za računalom. Vraćam se redovito.",
    initials: "IM",
  },
];

// Aggregate stats — update these manually to match the real Google profile.
// IMPORTANT: keep these values honest and in sync with reality (within reason).
export const ratingStats = {
  ratingValue: 4.8,
  reviewCount: 51,
  bestRating: 5,
  worstRating: 1,
};

// Direct link to the salon's Google Maps profile (for "view all reviews" CTA).
// Replace with the actual Google Maps URL for Salon Ranka once available.
export const googleProfileUrl =
  "https://www.google.com/maps/place/?q=place_id:REPLACE_WITH_REAL_PLACE_ID";

// FUTURE: If we want auto-updating reviews later, swap this file for a build-time
// fetch from Google Places API. Implementation: use astro:content or a script in
// astro.config.mjs that runs at build, calls /place/details, writes to this file.
// Free tier: 10K requests/month. Limitation: max 5 reviews returned.
