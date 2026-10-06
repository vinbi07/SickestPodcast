import type { StaticImageData } from 'next/image';
import sickFitLogo from '../assets/logos/SickFitSponsor.png';
import fiservLogo from '../assets/logos/FiservSponsor.png';
import okraLogo from '../assets/logos/OkraPartner.png';
import medaseLogo from '../assets/logos/medasePartner.png';
import fundraiserBlanketsLogo from '../assets/logos/fundraiserBlanketsPartner.png'; 

export interface PartyLogo {
  name: string;
  logo: StaticImageData;
  /** `mark` is a square emblem, `wordmark` is tightly cropped text, `padded` is a wordmark on a square canvas. */
  shape: 'mark' | 'wordmark' | 'padded';
  /** When set, the logo links out to the sponsor's site. */
  href?: string;
}

export const PARTY_SPONSORS: PartyLogo[] = [
  { name: 'SickFit', logo: sickFitLogo, shape: 'mark' },
  { name: 'Fiserv', logo: fiservLogo, shape: 'wordmark' },
];

export const PARTY_SEASON_PARTNERS: PartyLogo[] = [
  { name: "Drink O'kra", logo: okraLogo, shape: 'padded' },
  { name: "Fundraiser Blankets", logo: fundraiserBlanketsLogo, shape: 'padded' },
  { name: 'Medase', logo: medaseLogo, shape: 'wordmark' },
];
