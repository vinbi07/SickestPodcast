import type { Metadata } from 'next';
import HomeView from '../components/HomeView';
import { episodes } from '../content/episodes';
import { guests } from '../content/guests';
import { buildMetadata } from '../lib/metadata';
import { DEFAULT_DESCRIPTION, SITE_NAME } from '../content/site';

export const metadata: Metadata = buildMetadata({
  title: `${SITE_NAME} | Athlete, Executive & Underdog Interviews`,
  description: DEFAULT_DESCRIPTION,
  path: '/',
});

export default function Page() {
  return <HomeView episodes={episodes} guests={guests} />;
}
