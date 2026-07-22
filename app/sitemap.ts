import type { MetadataRoute } from 'next';
import { episodes } from '../content/episodes';
import { SITE_URL } from '../content/site';
import { BOOKING_TYPE_OPTIONS } from '../content/booking';

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
      lastModified: episode.date ?? undefined,
    }));

  return [...staticRoutes, ...episodeRoutes];
}
