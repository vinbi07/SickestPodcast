import { episodes } from '../content/episodes';
import type { Episode } from '../content/types';

export function isPlayable(episode: Episode): boolean {
  return episode.status === 'released' && Boolean(episode.videoUrl);
}

export function ctaLabel(episode: Episode): string {
  if (episode.status === 'released') return 'Play Episode';
  if (episode.status === 'trailer') return 'Watch Trailer';
  if (episode.status === 'upcoming') return 'Coming Soon';
  return 'Unavailable';
}

export function primaryEpisodeHref(episode: Episode): string {
  return `/episodes/${episode.slug}`;
}

export function primaryListenHref(): string {
  const released = episodes.find((episode) => episode.status === 'released');
  return released ? primaryEpisodeHref(released) : '/episodes';
}

export function statusLabel(episode: Episode): string {
  if (episode.status === 'released') return episode.date ? `Released ${episode.date}` : 'Released';
  if (episode.status === 'trailer') return 'Trailer Available';
  if (episode.status === 'upcoming') return 'Coming Soon';
  return 'Unavailable';
}
