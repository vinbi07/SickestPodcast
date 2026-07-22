import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import VideoPlayer from '../../../components/VideoPlayer';
import { episodes, getEpisodeBySlug } from '../../../content/episodes';
import { footerColumns, FOOTER_TAGLINE } from '../../../content/footer';
import { primaryListenHref, statusLabel } from '../../../lib/episode-status';
import { buildMetadata } from '../../../lib/metadata';
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

  return (
    <div>
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
            Episode {String(episode.id).padStart(2, '0')} · {episode.duration ?? 'Duration TBD'} ·{' '}
            {statusLabel(episode)}
          </div>
          <h1>{episode.title}</h1>
          <p className={styles.role}>{episode.role}</p>
          <p className={styles.desc}>{episode.description}</p>
          <div className={styles.actions}>
            <Link href="/booking/keynote">Book Paden</Link>
            <Link href="/">Back to Home</Link>
          </div>
        </section>

        <section className={`container ${styles.player}`}>
          <VideoPlayer episode={episode} embedded />
        </section>
      </main>

      <Footer columns={footerColumns} tagline={FOOTER_TAGLINE} />
    </div>
  );
}
