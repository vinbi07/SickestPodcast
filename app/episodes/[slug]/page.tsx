import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import VideoPlayer from '../../../components/VideoPlayer';
import Platforms from '../../../components/Platforms';
import { episodes, getEpisodeBySlug } from '../../../content/episodes';
import { footerColumns, FOOTER_TAGLINE } from '../../../content/footer';
import { BUZZSPROUT_SHARE_URL } from '../../../content/links';
import { episodeNumberLabel, primaryListenHref, statusLabel } from '../../../lib/episode-status';
import { buildMetadata } from '../../../lib/metadata';
import { buildBreadcrumbJsonLd, buildPodcastEpisodeJsonLd } from '../../../lib/structured-data';
import { SITE_NAME } from '../../../content/site';
import styles from './page.module.css';

interface EpisodePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return episodes.map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);

  if (!episode) {
    return buildMetadata({
      title: 'Episode Not Found',
      description: 'This episode could not be found.',
      path: `/episodes/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: episode.seo.title ?? `${episode.title} | ${SITE_NAME}`,
    description: episode.seo.description ?? episode.description,
    path: `/episodes/${episode.slug}`,
    image: episode.seo.ogImage ?? undefined,
    noindex: episode.status !== 'released',
  });
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);

  if (!episode) {
    notFound();
  }

  const episodeJsonLd = buildPodcastEpisodeJsonLd(episode);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Episodes', path: '/episodes' },
    { name: episode.title, path: `/episodes/${episode.slug}` },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <Navbar
        brand={{ prefix: 'THE', highlight: 'SICKEST', suffix: 'PODCAST' }}
        links={[
          { label: 'Episodes', href: '/episodes' },
          { label: 'Guests', href: '/#guests' },
          { label: 'About', href: '/#about' },
        ]}
        bookHref="/booking/keynote"
        listenHref={primaryListenHref()}
      />

      <main className={styles.page}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span aria-hidden="true">/</span>{' '}
          <Link href="/episodes">Episodes</Link> <span aria-hidden="true">/</span>{' '}
          <span aria-current="page">{episode.title}</span>
        </nav>

        <section className={`container ${styles.hero}`}>
          <div className={styles.meta}>
            Episode {episodeNumberLabel(episode)} · {episode.duration ?? 'Duration TBD'} ·{' '}
            {statusLabel(episode)}
          </div>
          <h1>{episode.title}</h1>
          <p className={styles.role}>{episode.role}</p>
          <p className={styles.desc}>{episode.description}</p>
        </section>

        <Platforms
          platformLinks={episode.platformLinks}
          morePlatformsHref={BUZZSPROUT_SHARE_URL}
          transparent
        />

        <section className={`container ${styles.player}`}>
          <VideoPlayer episode={episode} embedded />
        </section>
      </main>

      <Footer columns={footerColumns} tagline={FOOTER_TAGLINE} />
    </div>
  );
}
