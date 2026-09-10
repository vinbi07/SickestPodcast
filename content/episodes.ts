import type { StaticImageData } from 'next/image';
import { slugify } from '../lib/slugify';
import type { Episode, EpisodeStatus, PlatformLinks } from './types';
import { RSS_FEED_URL } from './links';
import robMatwickThumb from '../assets/guests/Rob Matwick_7.jpg';
import jasonMitchellThumb from '../assets/guests/jason Mitchell_44.jpg';

// Episodes with a confirmed release date and an on-set photo to use as the
// video thumbnail while the real video is not published yet. Keyed by
// episode `id`. Everything else stays fully "upcoming" (no date, no image).
const dateOverrides: Record<number, string> = {
  5: 'Sept 8',
  10: 'Sept 8',
};

const thumbnailOverrides: Record<number, StaticImageData> = {
  5: robMatwickThumb,
  10: jasonMitchellThumb,
};

// Episode 1 (Jason Mitchell) is live as of Sept 8 — real video and platform
// links. Everything else stays "upcoming" with no fabricated links.
const statusOverrides: Record<number, EpisodeStatus> = {
  10: 'released',
};

const videoUrlOverrides: Record<number, string> = {
  10: 'https://youtu.be/VVE1Qv7Ghss',
};

const platformLinksOverrides: Record<number, PlatformLinks> = {
  10: {
    spotify: 'https://open.spotify.com/episode/0f9qFIdUoMv0IutEAZv0bO',
    applePodcasts:
      'https://podcasts.apple.com/us/podcast/ep-1-jason-mitchell-from-straight-outta-compton-to/id6809694464?i=1000788411292',
    youtube: 'https://youtu.be/VVE1Qv7Ghss',
    amazonMusic:
      'https://music.amazon.com/podcasts/63c3f352-dd86-4dc9-bee2-72b37e16b07e/episodes/8b00470a-6abc-4ff1-9d20-f5b817b8340b/the-sickest-podcast-ep-1-jason-mitchell-from-straight-outta-compton-to-starting-over',
    rss: RSS_FEED_URL,
  },
};

/**
 * Raw episode content. Every episode currently shares the same placeholder
 * video asset and has no real platform links, so `status` is `upcoming` and
 * `videoUrl`/`date` are left unset (not fabricated) until real media, a
 * confirmed air date, and listen links exist. See MEMORY / plan notes for
 * why: showing "Play"/a real date here would misrepresent unreleased content.
 */
const rawEpisodes: Array<Omit<Episode, 'slug' | 'guestSlug' | 'seo' | 'platformLinks' | 'chapters' | 'transcript' | 'takeaways' | 'relatedEpisodeSlugs' | 'status' | 'date' | 'videoUrl'>> = [
  {
    id: 10,
    title: 'Jason Mitchell: From Straight Outta Compton to Starting Over',
    guest: 'Jason Mitchell',
    role: 'Actor',
    category: 'Entertainment',
    duration: '62 min',
    description:
      'Jason will talk about preparation, navigating pressure in entertainment, and the mindset required to deliver when the spotlight is brightest.',
    thumbnail: 'JM',
  },
  {
    id: 17,
    title: 'Alani Taylor: Designing Identity',
    guest: 'Alani Taylor',
    role: 'Celebrity Stylist · Fashion Designer',
    category: 'Entertainment',
    duration: '45 min',
    description:
      'Alani will talk about translating personal identity into wearable design, staying original under public pressure, and building a name in fashion.',
    thumbnail: 'AT',
  },
  {
    id: 5,
    title: 'Rob Matwick: Building a World-Class Venue',
    guest: 'Rob Matwick',
    role: 'SVP · Texas Rangers',
    category: 'MLB',
    duration: '58 min',
    description:
      'Rob will talk infrastructure, fan economics, and what it will take to execute at scale while protecting the long-term identity of a franchise.',
    thumbnail: 'RM',
  },
  {
    id: 6,
    title: 'Dother Sykes: Precision Under Pressure',
    guest: 'Dother Sykes',
    role: 'Actor · Stunt Performer',
    category: 'Entertainment',
    duration: '50 min',
    description:
      'Dother will explain stunt discipline, set leadership, and the habits that will let him perform safely and creatively in high-risk environments.',
    thumbnail: 'DS',
  },
  {
    id: 20,
    title: 'Dana Vaughns: Reinvention in Public',
    guest: 'Dana Vaughns',
    role: 'Singer · Dancer · Musician',
    category: 'Entertainment',
    duration: '45 min',
    description:
      'Pittsburgh-born singer, dancer, and musician blending pop, soul, and R&B — he started performing before age 10 and moved to California to pursue entertainment.',
    thumbnail: 'DV',
  },
  {
    id: 21,
    title: 'Vanita Krouch: Before the Olympics, There Was Us',
    guest: 'Vanita Krouch',
    role: 'Team USA iFlag QB',
    category: 'Sports',
    duration: '45 min',
    description:
      'One of the most decorated flag football players in the world and Team USA gold medal leader.',
    thumbnail: 'VK',
  },
  {
    id: 23,
    title: 'Briana Green: Trick Shots and Team Legacy',
    guest: 'Briana Green',
    role: 'Guard · Harlem Globetrotters',
    category: 'Sports',
    duration: '45 min',
    description:
      'Point guard known for her freestyle and trick-shot style, and the fifteenth woman to join the Harlem Globetrotters since 2017. A UTEP alum who also played professionally in the Czech Republic and Spain, she shares her game with over 700,000 Instagram followers.',
    thumbnail: 'BG',
  },
  {
    id: 22,
    title: 'Dre in Dallas: What Happens When Being Yourself Goes Viral?',
    guest: 'Keandre Dre Hopkins',
    role: 'TikTok Food Creator',
    category: 'Food & Luxury Lifestyle',
    duration: '45 min',
    description:
      "TikTok star and food content creator with 1.6 million followers on @dreindallas, where he shares the foods he tries and glimpses of his life in Dallas, Texas. One of his videos, filmed during Crumbl's Olivia Rodrigo collab, has drawn over 20 million views.",
    thumbnail: 'KH',
  },
  {
    id: 24,
    title: 'Daven Gates: One Stop Chop Wasn\'t the Plan',
    guest: 'Daven Gates',
    role: 'Chef · One Stop Chop',
    category: 'Food',
    duration: '45 min',
    description:
      'Self-taught home cook, veteran, and devoted dad from Queens, New York, known online as One Stop Chop. He learned to cook by shadowing his great-grandmother and now shares approachable comfort recipes on social media.',
    thumbnail: 'DG',
  },
];

export const episodes: Episode[] = rawEpisodes.map((episode) => ({
  ...episode,
  slug: slugify(episode.title),
  guestSlug: slugify(episode.guest),
  // No episode has real playable media or a confirmed air date yet — every
  // `videoUrl` in the old data was the same placeholder MP4. Represent that
  // honestly instead of presenting a fake "Play" state. See content-required
  // note above.
  status: statusOverrides[episode.id] ?? 'upcoming',
  date: dateOverrides[episode.id] ?? null,
  videoUrl: videoUrlOverrides[episode.id] ?? null,
  thumbnailImage: thumbnailOverrides[episode.id] ?? null,
  seo: {},
  platformLinks: platformLinksOverrides[episode.id] ?? {},
  chapters: null,
  transcript: null,
  takeaways: null,
  relatedEpisodeSlugs: null,
}));

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return episodes.find((episode) => episode.slug === slug);
}
