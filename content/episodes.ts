import { slugify } from '../lib/slugify';
import type { Episode } from './types';

/**
 * Raw episode content. Every episode currently shares the same placeholder
 * video asset and has no real platform links, so `status` is `upcoming` and
 * `videoUrl`/`date` are left unset (not fabricated) until real media, a
 * confirmed air date, and listen links exist. See MEMORY / plan notes for
 * why: showing "Play"/a real date here would misrepresent unreleased content.
 */
const rawEpisodes: Array<Omit<Episode, 'slug' | 'guestSlug' | 'seo' | 'platformLinks' | 'chapters' | 'transcript' | 'takeaways' | 'relatedEpisodeSlugs' | 'status' | 'date' | 'videoUrl'>> = [
  {
    id: 4,
    title: 'Donovan Reta: Operating the Business of Sport',
    guest: 'Donovan Reta',
    role: 'SVP of Business Operations · Dallas Wings',
    category: 'Executive',
    duration: '44 min',
    description:
      'Donovan will unpack executive decision making, legal discipline, and how to align brand, fan experience, and revenue under one operating model.',
    thumbnail: 'DR',
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
    id: 8,
    title: 'Khalia Collier: Ownership at 23',
    guest: 'Khalia Collier',
    role: 'VP Chief of Staff · Dallas Mavericks',
    category: 'NBA',
    duration: '54 min',
    description:
      'Khalia will discuss ownership responsibility, navigating rooms with legacy power, and the systems required to turn vision into repeatable outcomes.',
    thumbnail: 'KC',
  },
  {
    id: 10,
    title: 'Jason Mitchell: Owning Your Craft',
    guest: 'Jason Mitchell',
    role: 'Actor',
    category: 'Entertainment',
    duration: '47 min',
    description:
      'Jason will talk about preparation, navigating pressure in entertainment, and the mindset required to deliver when the spotlight is brightest.',
    thumbnail: 'JM',
  },
  {
    id: 11,
    title: 'Mark Cuban: Building Influence Beyond Ownership',
    guest: 'Mark Cuban',
    role: 'Minority Owner · Dallas Mavericks',
    category: 'Business',
    duration: '53 min',
    description:
      'Mark will break down what minority ownership will teach about leverage, leadership, and making high-conviction investment decisions under pressure.',
    thumbnail: 'MC',
  },
  {
    id: 12,
    title: 'Mark Rockefeller: Leading with Long-Term Vision',
    guest: 'Mark Rockefeller',
    role: 'Business Executive · Investor',
    category: 'Business',
    duration: '51 min',
    description:
      'Mark will share how executives will build resilient organizations, balance short-term execution with long-term strategy, and invest with discipline.',
    thumbnail: 'MR',
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
    id: 18,
    title: 'Zarna Garg: Finding the Punchline',
    guest: 'Zarna Garg',
    role: 'Comedian · Screenwriter',
    category: 'Entertainment',
    duration: '45 min',
    description:
      'Zarna will share how she turned a mid-life career pivot into a comedy career, writing jokes that cross cultures, and building a voice that will not ask for permission.',
    thumbnail: 'ZG',
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
    title: 'Vanita Krouch: Playing for Gold',
    guest: 'Vanita Krouch',
    role: 'Team USA iFlag QB',
    category: 'Sports',
    duration: '45 min',
    description:
      'One of the most decorated flag football players in the world and Team USA gold medal leader.',
    thumbnail: 'VK',
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
  status: 'upcoming',
  date: null,
  videoUrl: null,
  seo: {},
  platformLinks: {},
  chapters: null,
  transcript: null,
  takeaways: null,
  relatedEpisodeSlugs: null,
}));

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return episodes.find((episode) => episode.slug === slug);
}
