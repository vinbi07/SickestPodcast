import type { MetadataRoute } from 'next';
import { episodes } from '../content/episodes';
import { SITE_URL } from '../content/site';
import { BOOKING_TYPE_OPTIONS } from '../content/booking';

/**
 * Episode `date` is a display string like "Sept 8" with no confirmed year —
 * not a valid W3C datetime for <lastmod>. Only pass through dates that
 * already carry a 4-digit year; otherwise omit lastModified for that URL
 * rather than emit an invalid value or guess a year.
 */
function toLastModified(date: string | null): string | undefined {
  if (!date || !/\b\d{4}\b/.test(date)) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/episodes',
    '/booking',
    ...BOOKING_TYPE_OPTIONS.map((option) => `/booking/${option.value}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const episodeRoutes = episodes
    .filter((episode) => episode.status === 'released')
    .map((episode) => ({
      url: `${SITE_URL}/episodes/${episode.slug}`,
      lastModified: toLastModified(episode.date),
    }));

  return [...staticRoutes, ...episodeRoutes];
}
