import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PartyHero from './PartyHero';
import RsvpSection from './RsvpSection';
import PartySponsors from './PartySponsors';
import { footerColumns, FOOTER_TAGLINE } from '../../content/footer';
import { PARTY } from '../../content/party';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../../content/site';
import { primaryListenHref } from '../../lib/episode-status';
import { buildMetadata } from '../../lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'End of Season Party | The Sickest Podcast',
  description: 'Register for The Sickest Podcast End of Season Party in Dallas on Friday, November 6, 2026.',
  path: PARTY.path,
});

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: PARTY.name,
  description: 'Season one deserves a proper sendoff. Join The Sickest Podcast for its End of Season Party in Dallas.',
  startDate: PARTY.startIso,
  endDate: PARTY.endIso,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: [new URL(DEFAULT_OG_IMAGE, SITE_URL).toString()],
  url: new URL(PARTY.path, SITE_URL).toString(),
  location: {
    '@type': 'Place',
    name: `${PARTY.address.street}, ${PARTY.address.suite}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${PARTY.address.street}, ${PARTY.address.suite}`,
      addressLocality: PARTY.address.city,
      addressRegion: PARTY.address.region,
      postalCode: PARTY.address.postalCode,
      addressCountry: 'US',
    },
  },
  organizer: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

export default function EndOfSeasonPartyPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd).replace(/</g, '\\u003c') }}
      />
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
        <PartyHero />
        <RsvpSection />
        <PartySponsors />
      </main>
      <Footer columns={footerColumns} tagline={FOOTER_TAGLINE} />
    </div>
  );
}
