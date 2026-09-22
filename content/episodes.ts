import type { StaticImageData } from 'next/image';
import { slugify } from '../lib/slugify';
import type { Episode, EpisodeSeo, EpisodeStatus, PlatformLinks } from './types';
import { RSS_FEED_URL } from './links';
import robMatwickThumb from '../assets/guests/Rob Matwick_7.jpg';
import jasonMitchellThumb from '../assets/guests/jason Mitchell_44.jpg';

// Which guest's episode is shown as "Featured" on the homepage. This is an
// explicit, independent flag — it does not follow episode order/number.
export const FEATURED_GUEST_SLUG = 'rob-matwick';

// Episodes with a confirmed release date and an on-set photo to use as the
// video thumbnail while the real video is not published yet. Keyed by
// episode `id`. Everything else stays fully "upcoming" (no date, no image).
const dateOverrides: Record<number, string> = {
  5: 'Sept 22',
  10: 'Sept 8',
  17: 'Sept 15',
};

const thumbnailOverrides: Record<number, StaticImageData | string> = {
  5: robMatwickThumb,
  10: jasonMitchellThumb,
  17: '/AlaniThumbnail.png',
};

// Jason Mitchell (Sept 8), Alani Taylor (Sept 15), and Rob Matwick (Sept 22)
// are live — real video and platform links. Everything else stays "upcoming"
// with no fabricated links.
const statusOverrides: Record<number, EpisodeStatus> = {
  5: 'released',
  10: 'released',
  17: 'released',
};

const videoUrlOverrides: Record<number, string> = {
  5: 'https://www.youtube.com/watch?v=MU9shBypJqs',
  10: 'https://youtu.be/VVE1Qv7Ghss',
  17: 'https://youtu.be/KXzoPDIlyc0?si=mg5bMEni8Cwd-vO3',
};

// Search-snippet-friendly title/description per episode, derived from the
// existing guest/role/description copy above (kept ≤60/≤160 chars). These
// only affect <title>/meta description/OG tags via buildMetadata() — the
// visible page copy (episode.title/description) is untouched.
const seoOverrides: Record<number, EpisodeSeo> = {
  10: {
    title: 'Jason Mitchell on The Sickest Podcast | Actor Interview',
    description:
      'Actor Jason Mitchell joins The Sickest Podcast to talk pressure, preparation, and performing when the spotlight is brightest.',
  },
  17: {
    title: 'Alani Taylor on The Sickest Podcast | Stylist Interview',
    description:
      'Celebrity stylist and fashion designer Alani Taylor talks identity, originality, and building a name in fashion on The Sickest Podcast.',
  },
  5: {
    title: 'Rob Matwick on The Sickest Podcast | Texas Rangers SVP',
    description:
      'Texas Rangers SVP Rob Matwick joins The Sickest Podcast to discuss venue infrastructure, fan economics, and scaling a franchise.',
  },
  6: {
    title: 'Dother Sykes on The Sickest Podcast | Stunt Performer',
    description:
      'Actor and stunt performer Dother Sykes talks discipline, set leadership, and performing safely under pressure on The Sickest Podcast.',
  },
  20: {
    title: 'Dana Vaughns on The Sickest Podcast | Musician Interview',
    description:
      'Singer, dancer, and musician Dana Vaughns joins The Sickest Podcast to talk reinvention and building a career in entertainment.',
  },
  21: {
    title: 'Vanita Krouch on The Sickest Podcast | Team USA QB',
    description:
      'Team USA flag football QB and gold medalist Vanita Krouch joins The Sickest Podcast to talk the road before the wins.',
  },
  23: {
    title: 'Briana Green on The Sickest Podcast | Globetrotters',
    description:
      'Harlem Globetrotters guard Briana Green joins The Sickest Podcast to talk trick shots, team legacy, and her path to the pros.',
  },
  22: {
    title: 'Dre in Dallas on The Sickest Podcast | Food Creator',
    description:
      'TikTok food creator Keandre "Dre" Hopkins joins The Sickest Podcast to talk going viral and building a following in Dallas.',
  },
  24: {
    title: 'Daven Gates on The Sickest Podcast | Chef Interview',
    description:
      'Chef Daven Gates, known online as One Stop Chop, joins The Sickest Podcast to talk cooking, family, and building an audience.',
  },
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
  17: {
    spotify: 'https://open.spotify.com/episode/41vSkbEZkKbPJwYNzf5loV?si=258cfc40c1cd47c5',
    applePodcasts:
      'https://podcasts.apple.com/us/podcast/alani-taylor-from-the-army-to-beyonc%C3%A9/id6809694464?i=1000789708895',
    youtube: 'https://youtu.be/KXzoPDIlyc0?si=mg5bMEni8Cwd-vO3',
    amazonMusic: 'https://music.amazon.com/podcasts/63c3f352-dd86-4dc9-bee2-72b37e16b07e/the-sickest-podcast',
    rss: RSS_FEED_URL,
  },
  5: {
    spotify: 'https://open.spotify.com/episode/2KtrR4YbHRDoEKHHJBHOgM',
    applePodcasts:
      'https://podcasts.apple.com/us/podcast/rob-matwick-the-man-behind-a-%241-2-billion-ballpark/id6809694464?i=1000791041909',
    youtube: 'https://www.youtube.com/watch?v=MU9shBypJqs',
    amazonMusic:
      'https://music.amazon.com/podcasts/63c3f352-dd86-4dc9-bee2-72b37e16b07e/episodes/f7eae00d-2e9c-4708-9c68-5b219d9a2f4c/the-sickest-podcast-rob-matwick-the-man-behind-a-1-2-billion-ballpark',
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
    title: 'Alani Taylor: From the Army to Beyoncé',
    guest: 'Alani Taylor',
    role: 'Celebrity Stylist · Fashion Designer',
    category: 'Entertainment',
    duration: '54 min',
    description:
      'Alani will talk about translating personal identity into wearable design, staying original under public pressure, and building a name in fashion.',
    thumbnail: 'AT',
  },
  {
    id: 5,
    title: 'Rob Matwick: The Man Behind a $1.2 Billion Ballpark',
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
    title: 'Briana Green: More Than a Globetrotter',
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
  seo: seoOverrides[episode.id] ?? {},
  platformLinks: platformLinksOverrides[episode.id] ?? {},
  chapters: null,
  transcript: null,
  takeaways: null,
  relatedEpisodeSlugs: null,
}));

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return episodes.find((episode) => episode.slug === slug);
}
