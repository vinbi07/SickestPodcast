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
    id: 1,
    title: 'Crystal Hayslett: Betting on Your Pivot',
    guest: 'Crystal Hayslett',
    role: 'Actress · Producer · Investor',
    category: 'Entertainment',
    duration: '52 min',
    description:
      'Crystal will open up about moving from behind the scenes to center stage, handling pressure in public, and building a career that will not depend on permission.',
    cardSummary:
      'From supporting roles to leading her own ventures: Crystal Hayslett on owning the pivot.',
    thumbnail: 'CH',
  },
  {
    id: 2,
    title: 'Nicole Lynn: Negotiating at the Highest Level',
    guest: 'Nicole Lynn',
    role: 'President of Football Operations · Klutch Sports',
    category: 'Sports Business',
    duration: '48 min',
    description:
      'Nicole will break down high-stakes contract strategy, what top performers will expect from leadership, and why conviction will win when the room is skeptical.',
    thumbnail: 'NL',
  },
  {
    id: 3,
    title: 'Arike Ogunbowale: Clutch Mindset',
    guest: 'Arike Ogunbowale',
    role: 'Guard · Dallas Wings',
    category: 'WNBA',
    duration: '55 min',
    description:
      'Arike will share how she prepares for pressure moments, turns criticism into fuel, and creates consistency across long seasons and short windows.',
    thumbnail: 'AO',
  },
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
    id: 7,
    title: 'Sydney Colson: Longevity and Leadership',
    guest: 'Sydney Colson',
    role: 'WNBA Champion · Athlete',
    category: 'WNBA',
    duration: '46 min',
    description:
      'Sydney will dive into team culture, leadership from the bench, and building an off-court brand without losing focus on performance.',
    thumbnail: 'SC',
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
    id: 9,
    title: 'Jim Jeffcoat: Championship Mindset',
    guest: 'Jim Jeffcoat',
    role: 'Former NFL Defensive End · Dallas Cowboys',
    category: 'NFL',
    duration: '49 min',
    description:
      'Jim will share lessons from championship locker rooms, consistency at the highest level, and how leadership under pressure will translate beyond football.',
    thumbnail: 'JJ',
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
    id: 13,
    title: 'Scott Murray: Storytelling at the Speed of Sports',
    guest: 'Scott Murray',
    role: 'Chairman/CEO · Murray Media',
    category: 'Sports/Media',
    duration: '50 min',
    description:
      'Scott will explain how media leaders will shape narratives in real time, protect credibility, and deliver under constant deadline pressure.',
    thumbnail: 'SM',
  },
  {
    id: 14,
    title: 'Dana Vaughns: Reinvention in Public',
    guest: 'Dana Vaughns',
    role: 'Actor · Singer · Entertainer',
    category: 'Entertainment',
    duration: '45 min',
    description:
      'Dana will discuss how artists will evolve across industries, protect creative identity, and stay consistent while audiences and platforms change.',
    thumbnail: 'DV',
  },
  {
    id: 15,
    title: 'Dak Prescott: Leadership in the Spotlight',
    guest: 'Dak Prescott',
    role: 'Quarterback · Dallas Cowboys',
    category: 'NFL',
    duration: '52 min',
    description:
      'Dak will share how elite quarterbacks will lead through adversity, build trust in the locker room, and execute when expectations are at their highest.',
    thumbnail: 'DP',
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
