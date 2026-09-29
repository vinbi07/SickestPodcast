import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EpisodeArchiveView from '../../components/EpisodeArchiveView';
import { episodes } from '../../content/episodes';
import { footerColumns, FOOTER_TAGLINE } from '../../content/footer';
import { primaryListenHref } from '../../lib/episode-status';
import { buildMetadata } from '../../lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'All Episodes',
  description:
    'Browse every episode of The Sickest Podcast — search by guest or title, or filter by topic including sports, business, entertainment, and leadership.',
  path: '/episodes',
});

export default function EpisodesArchivePage() {
  return (
    <div>
      <Navbar
        brand={{ prefix: 'THE', highlight: 'SICKEST', suffix: 'PODCAST' }}
        links={[
          { label: 'Episodes', href: '/episodes' },
          { label: 'Guests', href: '/#guests' },
          { label: 'About', href: '/#about' },
          { label: 'Party', href: '/end-of-season-party' },
        ]}
        bookHref="/booking/keynote"
        listenHref={primaryListenHref()}
      />
      <main>
        <EpisodeArchiveView episodes={episodes} />
      </main>
      <Footer columns={footerColumns} tagline={FOOTER_TAGLINE} />
    </div>
  );
}
