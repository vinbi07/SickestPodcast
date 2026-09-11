import type { PlatformLinks } from './types';

export const RSS_FEED_URL = 'https://feeds.buzzsprout.com/2611545.rss';
export const BUZZSPROUT_SHARE_URL = 'https://www.buzzsprout.com/2611545/free_share_page';

export const SHOW_PLATFORM_LINKS: PlatformLinks = {
  spotify: 'https://open.spotify.com/show/5CtLA7yWCqsroCeqPoDsgu',
  applePodcasts: 'https://podcasts.apple.com/us/podcast/the-sickest-podcast/id6809694464',
  youtube: 'https://www.youtube.com/@TheSickestPodcast',
  amazonMusic: 'https://music.amazon.com/podcasts/63c3f352-dd86-4dc9-bee2-72b37e16b07e/the-sickest-podcast',
  rss: RSS_FEED_URL,
};

// Mirrors the social links rendered in components/Hero.tsx — kept here too so
// structured data (Organization "sameAs") can reuse the same URLs.
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/thesickestpod?utm_source=qr',
  tiktok: 'https://www.tiktok.com/@thesickestpod',
  linkedin: 'https://www.linkedin.com/in/paden-sickles/',
  youtube: 'https://www.youtube.com/@TheSickestPodcast',
};
