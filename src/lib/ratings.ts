/** Site-wide tool rating scale (matches review articles: "4.5/5 stars"). */
export const RATING_MAX = 5

export function clampRating(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(Math.max(value, 0), RATING_MAX)
}

/** Convert legacy 10-point DB values to 5-point. */
export function normalizeRating(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  if (value > RATING_MAX) return clampRating(value / 2)
  return clampRating(value)
}

export function formatRating(value: number, options?: { suffix?: boolean }): string {
  const normalized = normalizeRating(value)
  const text = normalized.toFixed(1)
  return options?.suffix === false ? text : `${text}/${RATING_MAX}`
}

export function ratingBarPercent(value: number): number {
  const normalized = normalizeRating(value)
  return Math.min((normalized / RATING_MAX) * 100, 100)
}
