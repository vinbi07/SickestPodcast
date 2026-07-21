export interface Host {
  firstName: string;
  lastName: string;
  bio: string;
  credentials: string[];
  quote: string;
}

export const host: Host = {
  firstName: 'Paden',
  lastName: 'Sickles',
  bio: 'Army veteran and founder of SickFit. She left a defining career, built a brand from scratch, and brings that same direct operator lens to every interview.',
  credentials: [
    '11-year Army Engineer Officer, Captain',
    'Founder and CEO of SickFit',
    'Goldman Sachs 10KSB Alumna',
    'MBA Finance · PMP · LSSBB',
  ],
  quote:
    'I left a career that defined me to bet everything on a sock company. I would do it again.',
};
