/**
 * TrailCast — "best hours to run" heuristic.
 *
 * Scores the next 24 forecast hours from precip + precip-probability.
 * Lower score = better running conditions.
 *   rain : +2 per 0.5mm, +1.5 if prob ≥ 30%, +2.5 if prob ≥ 60%
 *
 * ponytail: wind/temp scoring needs extra hourly fields we don't parse yet;
 * rain alone is the dominant "should I run now" signal for trail runners.
 * Add wind/temp when the UI asks for it.
 */
import type { ParsedForecast } from './openMeteo';

export interface ScoredHour {
  time: string; // ISO
  score: number;
  hourLabel: string; // "HH:MM"
}

export function scoreHour(
  precipMm: number | null,
  precipProbPct: number | null,
): number {
  let s = 0;
  if (precipMm !== null && precipMm > 0) s += 2 * Math.ceil(precipMm / 0.5);
  if (precipProbPct !== null) {
    if (precipProbPct >= 60) s += 2.5;
    else if (precipProbPct >= 30) s += 1.5;
  }
  return Math.round(s * 10) / 10;
}

/** Returns the N best future hours (from now) sorted best-first. */
export function bestHours(forecast: ParsedForecast, n = 3, fromHour?: string): ScoredHour[] {
  const nowHour = fromHour ?? new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
  const startIdx = forecast.hours.findIndex((h) => h.time.slice(0, 13) >= nowHour);
  const future = startIdx >= 0 ? forecast.hours.slice(startIdx, startIdx + 24) : forecast.hours.slice(0, 24);
  return future
    .map((h) => ({
      time: h.time,
      score: scoreHour(h.precipitationMm, h.precipitationProbPct),
      hourLabel: h.time.slice(11, 16),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n);
}