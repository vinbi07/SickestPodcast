import robMatwickPhoto from '../assets/guests/RobMatwick.jpg';
import dotherSykesPhoto from '../assets/guests/DotherSykes.jpg';
import jasonMitchellPhoto from '../assets/guests/JasonMitchell.webp';
import alaniTaylorPhoto from '../assets/guests/AlaniTaylor.png';
import danaVaughnsPhoto from '../assets/guests/DanaVaughns.jpg';
import vanitaKrouchPhoto from '../assets/guests/VanitaKrouch.webp';
import keandreDreHopkinsPhoto from '../assets/guests/KeandreDreHopkins.png';
import brianaGreenPhoto from '../assets/guests/BrianaGreen.png';
import davenGatesPhoto from '../assets/guests/DavenGates.png';
import charlieLeeAdamsJrPhoto from '../public/charlieLeeJrImage.png';
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
  { id: 10, name: 'Jason Mitchell', role: 'Actor', category: 'Entertainment', episodeId: 10, photo: jasonMitchellPhoto },
  { id: 17, name: 'Alani Taylor', role: 'Celebrity Stylist · Fashion Designer', category: 'Entertainment', episodeId: 17, photo: alaniTaylorPhoto },
  { id: 5, name: 'Rob Matwick', role: 'SVP for the Texas Rangers', category: 'MLB', episodeId: 5, photo: robMatwickPhoto },
  { id: 6, name: 'Dother Sykes', role: 'Actor and stunt performer', category: 'Entertainment', episodeId: 6, photo: dotherSykesPhoto },
  { id: 20, name: 'Dana Vaughns', role: 'Singer · Dancer · Musician', category: 'Entertainment', episodeId: 20, photo: danaVaughnsPhoto },
  { id: 21, name: 'Vanita Krouch', role: 'Team USA iFlag QB', category: 'Sports', episodeId: 21, photo: vanitaKrouchPhoto },
  { id: 23, name: 'Briana Green', role: 'Guard · Harlem Globetrotters', category: 'Sports', episodeId: 23, photo: brianaGreenPhoto },
  { id: 22, name: 'Keandre Dre Hopkins', role: 'TikTok Food Creator', category: 'Food & Luxury Lifestyle', episodeId: 22, photo: keandreDreHopkinsPhoto },
  { id: 24, name: 'Daven Gates', role: 'Chef · One Stop Chop', category: 'Food', episodeId: 24, photo: davenGatesPhoto },
  { id: 25, name: 'Charlie Lee Adams Jr.', role: 'Comedian', category: 'Entertainment', episodeId: 25, photo: charlieLeeAdamsJrPhoto },
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
