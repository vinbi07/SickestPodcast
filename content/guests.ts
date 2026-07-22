import crystalHayslettPhoto from '../assets/guests/CrystalHayslett.jpg';
import nicoleLynnPhoto from '../assets/guests/NicoleLynn.webp';
import arikeOgunbowalePhoto from '../assets/guests/ArikeOgunbowale.webp';
import donovanRetaPhoto from '../assets/guests/DonovanReta.jpeg';
import robMatwickPhoto from '../assets/guests/RobMatwick.jpg';
import dotherSykesPhoto from '../assets/guests/DotherSykes.jpg';
import sydneyColsonPhoto from '../assets/guests/SydneyColson.avif';
import khaliaCollierPhoto from '../assets/guests/KhaliaCollier.jpg';
import jimJeffcoatPhoto from '../assets/guests/JimJeffcoat.webp';
import jasonMitchellPhoto from '../assets/guests/JasonMitchell.webp';
import markCubanPhoto from '../assets/guests/MarkCuban.png';
import markRockefellerPhoto from '../assets/guests/markRocketFeller.png';
import scottMurrayPhoto from '../assets/guests/ScottMurray.jpeg';
import danaVaughnsPhoto from '../assets/guests/DanaVaughns.jpg';
import dakPrescottPhoto from '../assets/guests/DakPrescott.png';
import jBolinPhoto from '../assets/guests/JBolin.png';
import alaniTaylorPhoto from '../assets/guests/AlaniTaylor.png';
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
  { id: 16, name: 'J. Bolin', role: 'Celeb Stylist · Creative Director', category: 'Entertainment', episodeId: 16, photo: jBolinPhoto },
  { id: 17, name: 'Alani Taylor', role: 'Celebrity Stylist · Fashion Designer', category: 'Entertainment', episodeId: 17, photo: alaniTaylorPhoto },
  { id: 1, name: 'Crystal Hayslett', role: 'Actress, producer, investor', category: 'Entertainment', episodeId: 1, photo: crystalHayslettPhoto },
  { id: 2, name: 'Nicole Lynn', role: 'President of Football Operations at Klutch Sports', category: 'Sports Business', episodeId: 2, photo: nicoleLynnPhoto },
  { id: 3, name: 'Arike Ogunbowale', role: 'Guard for the Dallas Wings', category: 'WNBA', episodeId: 3, photo: arikeOgunbowalePhoto },
  { id: 4, name: 'Donovan Reta', role: 'SVP of Business Operations for the Dallas Wings', category: 'Executive', episodeId: 4, photo: donovanRetaPhoto },
  { id: 7, name: 'Sydney Colson', role: '2x WNBA champion and speaker', category: 'WNBA', episodeId: 7, photo: sydneyColsonPhoto },
  { id: 8, name: 'Khalia Collier', role: 'VP Chief of Staff for the Dallas Mavericks', category: 'NBA', episodeId: 8, photo: khaliaCollierPhoto },
  { id: 9, name: 'Jim Jeffcoat', role: 'Former NFL defensive end for the Dallas Cowboys', category: 'NFL', episodeId: 9, photo: jimJeffcoatPhoto },
  { id: 11, name: 'Mark Cuban', role: 'Minority owner of the Dallas Mavericks and investor', category: 'Business', episodeId: 11, photo: markCubanPhoto },
  { id: 12, name: 'Mark Rockefeller', role: 'Business Executive and Investor', category: 'Business', episodeId: 12, photo: markRockefellerPhoto },
  { id: 13, name: 'Scott Murray', role: 'Chairman/CEO of Murray Media and former Sports Director', category: 'Sports/Media', episodeId: 13, photo: scottMurrayPhoto },
  { id: 14, name: 'Dana Vaughns', role: 'Actor, singer, and entertainer', category: 'Entertainment', episodeId: 14, photo: danaVaughnsPhoto },
  { id: 15, name: 'Dak Prescott', role: 'Quarterback for the Dallas Cowboys', category: 'NFL', episodeId: 15, photo: dakPrescottPhoto },
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
