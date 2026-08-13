import donovanRetaPhoto from '../assets/guests/DonovanReta.jpeg';
import robMatwickPhoto from '../assets/guests/RobMatwick.jpg';
import dotherSykesPhoto from '../assets/guests/DotherSykes.jpg';
import khaliaCollierPhoto from '../assets/guests/KhaliaCollier.jpg';
import jasonMitchellPhoto from '../assets/guests/JasonMitchell.webp';
import markCubanPhoto from '../assets/guests/MarkCuban.png';
import markRockefellerPhoto from '../assets/guests/markRocketFeller.png';
import alaniTaylorPhoto from '../assets/guests/AlaniTaylor.png';
import zarnaGargPhoto from '../assets/guests/ZarnaGarg.jpg';
import danaVaughnsPhoto from '../assets/guests/DanaVaughns.jpg';
import vanitaKrouchPhoto from '../assets/guests/VanitaKrouch.webp';
import type { StaticImageData } from 'next/image';
import { slugify } from '../lib/slugify';
import { episodes } from './episodes';
import type { Guest } from './types';

interface RawGuest {
  id: number;
  name: string;
  role: string;
  category: string;
  episodeId: number;
  photo: StaticImageData;
}

const rawGuests: RawGuest[] = [
  { id: 5, name: 'Rob Matwick', role: 'SVP for the Texas Rangers', category: 'MLB', episodeId: 5, photo: robMatwickPhoto },
  { id: 10, name: 'Jason Mitchell', role: 'Actor', category: 'Entertainment', episodeId: 10, photo: jasonMitchellPhoto },
  { id: 6, name: 'Dother Sykes', role: 'Actor and stunt performer', category: 'Entertainment', episodeId: 6, photo: dotherSykesPhoto },
  { id: 17, name: 'Alani Taylor', role: 'Celebrity Stylist · Fashion Designer', category: 'Entertainment', episodeId: 17, photo: alaniTaylorPhoto },
  { id: 4, name: 'Donovan Reta', role: 'SVP of Business Operations for the Dallas Wings', category: 'Executive', episodeId: 4, photo: donovanRetaPhoto },
  { id: 8, name: 'Khalia Collier', role: 'VP Chief of Staff for the Dallas Mavericks', category: 'NBA', episodeId: 8, photo: khaliaCollierPhoto },
  { id: 11, name: 'Mark Cuban', role: 'Minority owner of the Dallas Mavericks and investor', category: 'Business', episodeId: 11, photo: markCubanPhoto },
  { id: 12, name: 'Mark Rockefeller', role: 'Business Executive and Investor', category: 'Business', episodeId: 12, photo: markRockefellerPhoto },
  { id: 18, name: 'Zarna Garg', role: 'Indian Comedian and Screenwriter', category: 'Entertainment', episodeId: 18, photo: zarnaGargPhoto },
  { id: 20, name: 'Dana Vaughns', role: 'Singer · Dancer · Musician', category: 'Entertainment', episodeId: 20, photo: danaVaughnsPhoto },
  { id: 21, name: 'Vanita Krouch', role: 'Team USA iFlag QB', category: 'Sports', episodeId: 21, photo: vanitaKrouchPhoto },
];

export const guests: Guest[] = rawGuests.map((guest, index) => {
  const matchingEpisode = episodes.find((episode) => episode.id === guest.episodeId);
  return {
    id: guest.id,
    slug: slugify(guest.name),
    name: guest.name,
    role: guest.role,
    category: guest.category,
    episodeSlug: matchingEpisode?.slug ?? '',
    // Episode number reflects display order in `rawGuests` above, not the
    // episode's static `id` — reordering guests here reorders episode numbers.
    episodeNumber: index + 1,
    photo: guest.photo,
  };
});

export function getEpisodeNumberBySlug(episodeSlug: string): number | undefined {
  return guests.find((guest) => guest.episodeSlug === episodeSlug)?.episodeNumber;
}
