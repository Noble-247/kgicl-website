// data/featured.ts: controls the six products on the homepage.
// To swap one, replace its slug with the slug of another product. Save, commit, deploy.
// This is the only source of truth for featured products.
export const HOME_FEATURED = [
  "120w-solar-street-light-12-eye",
  "150w-solar-street-light-6-bar",
  "200w-solar-street-light-16-eye",
  "wall-switch-and-socket",
  "pvc-single-core-copper-wire",
  "led-bulb",
] as const;

// Change here if the design ever shows more or fewer featured products.
export const FEATURED_COUNT = 6;
