import type { Metadata } from 'next';
import './globals.css';
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from '../content/site';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { buildOrganizationJsonLd, buildPodcastSeriesJsonLd, buildWebsiteJsonLd } from '../lib/structured-data';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | Athlete, Executive & Underdog Interviews`,
  description: DEFAULT_DESCRIPTION,
  icons: { icon: '/SickFitLogo.png', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};

const siteJsonLd = [buildWebsiteJsonLd(), buildOrganizationJsonLd(), buildPodcastSeriesJsonLd()];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
        {siteJsonLd.map((entry) => (
          <script
            key={entry['@type']}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, '\\u003c') }}
          />
        ))}
      </head>
      <body>
        <AnnouncementBanner />
        {children}
      </body>
    </html>
  );
}
