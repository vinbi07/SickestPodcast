import { DEFAULT_OG_IMAGE, PUBLISHER_NAME, SITE_NAME, SITE_URL } from '../content/site';
import { RSS_FEED_URL, SHOW_PLATFORM_LINKS, SOCIAL_LINKS } from '../content/links';
import { host } from '../content/host';
import type { Episode } from '../content/types';
import { episodeNumberLabel } from './episode-status';

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

function absoluteImage(image: string): string {
  return /^https?:\/\//.test(image) ? image : absoluteUrl(image);
}

/** Converts a "62 min" style label to an ISO 8601 duration ("PT62M"). Returns undefined if unparseable. */
function toIsoDuration(duration: string | null): string | undefined {
  if (!duration) return undefined;
  const match = duration.match(/(\d+)\s*min/i);
  if (!match) return undefined;
  return `PT${match[1]}M`;
}

/**
 * Converts an episode `date` display string to an ISO 8601 date, only when it
 * already contains a 4-digit year — display strings like "Sept 8" have no
 * confirmed year, and fabricating one would put an incorrect date in
 * structured data, so those are left out entirely instead of guessed.
 */
function toIsoDate(date: string | null): string | undefined {
  if (!date || !/\b\d{4}\b/.test(date)) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
}

const hostPerson = {
  '@type': 'Person' as const,
  name: `${host.firstName} ${host.lastName}`,
  jobTitle: 'Host',
};

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@type': 'Organization', name: PUBLISHER_NAME },
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PUBLISHER_NAME,
    url: SITE_URL,
    logo: absoluteImage('/SickFitLogo.png'),
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.tiktok,
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.youtube,
      SHOW_PLATFORM_LINKS.spotify,
      SHOW_PLATFORM_LINKS.applePodcasts,
      SHOW_PLATFORM_LINKS.amazonMusic,
    ].filter((url): url is string => Boolean(url)),
  };
}

export function buildPodcastSeriesJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastSeries',
    name: SITE_NAME,
    url: SITE_URL,
    webFeed: RSS_FEED_URL,
    image: absoluteImage(DEFAULT_OG_IMAGE),
    author: hostPerson,
    publisher: { '@type': 'Organization', name: PUBLISHER_NAME },
    sameAs: [SHOW_PLATFORM_LINKS.spotify, SHOW_PLATFORM_LINKS.applePodcasts, SHOW_PLATFORM_LINKS.youtube].filter(
      (url): url is string => Boolean(url),
    ),
  };
}

export function buildPodcastEpisodeJsonLd(episode: Episode) {
  const url = absoluteUrl(`/episodes/${episode.slug}`);
  const image = episode.seo.ogImage ?? DEFAULT_OG_IMAGE;

  return {
    '@context': 'https://schema.org',
    '@type': 'PodcastEpisode',
    name: episode.title,
    description: episode.description,
    url,
    episodeNumber: episodeNumberLabel(episode),
    datePublished: toIsoDate(episode.date),
    timeRequired: toIsoDuration(episode.duration),
    image: absoluteImage(image),
    partOfSeries: { '@type': 'PodcastSeries', name: SITE_NAME, url: SITE_URL },
    author: hostPerson,
    actor: { '@type': 'Person', name: episode.guest, jobTitle: episode.role },
    ...(episode.videoUrl ? { associatedMedia: { '@type': 'MediaObject', contentUrl: episode.videoUrl } } : {}),
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
