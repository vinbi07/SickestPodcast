export interface FooterColumn {
  title: string;
  items: string[];
}

export const footerColumns: FooterColumn[] = [
  { title: 'The Show', items: ['Episodes', 'Season 1 Guests', 'About the Show', 'Watch on YouTube', 'Listen on Buzzsprout'] },
  { title: 'Paden Sickles', items: ['About Paden', 'Book a Keynote', 'VIP Advisory', 'Speaking Inquiries'] },
  { title: 'SickFit', items: ['Shop SickFit', 'Brand Partners', 'Retail Inquiries', 'sickfitofficial.com'] },
  { title: 'Connect', items: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube'] },
];

export const FOOTER_TAGLINE = 'People who were not supposed to win. Exactly how they did it.';
