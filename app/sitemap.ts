import type { MetadataRoute } from 'next';
import { episodes } from '../content/episodes';
import { SITE_URL } from '../content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/episodes', '/booking'].map((path) => ({
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
