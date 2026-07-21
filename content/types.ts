import type { StaticImageData } from 'next/image';

export type EpisodeStatus = 'released' | 'upcoming' | 'trailer' | 'unavailable';

export interface PlatformLinks {
  spotify?: string | null;
  applePodcasts?: string | null;
  youtube?: string | null;
  amazonMusic?: string | null;
  rss?: string | null;
}

export interface EpisodeChapter {
  label: string;
  timestampSeconds: number;
}

export interface EpisodeSeo {
  title?: string | null;
  description?: string | null;
  ogImage?: string | null;
}

export interface Episode {
  id: number;
  slug: string;
  title: string;
  guestSlug: string;
  guest: string;
  role: string;
  category: string;
  duration: string | null;
  date: string | null;
  status: EpisodeStatus;
  description: string;
  videoUrl: string | null;
  thumbnail: string;
  seo: EpisodeSeo;
  platformLinks: PlatformLinks;
  chapters: EpisodeChapter[] | null;
  transcript: string | null;
  takeaways: string[] | null;
  relatedEpisodeSlugs: string[] | null;
}

export interface Guest {
  id: number;
  slug: string;
  name: string;
  role: string;
  category: string;
  episodeSlug: string;
  episodeNumber: number;
  photo: StaticImageData;
}
