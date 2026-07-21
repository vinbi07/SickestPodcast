import styles from './VideoPlayer.module.css';
import type { Episode } from '../content/types';
import { isPlayable, ctaLabel } from '../lib/episode-status';

function toEmbedUrl(videoUrl: string): string {
  try {
    const parsed = new URL(videoUrl);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : videoUrl;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : videoUrl;
      }

      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/').filter(Boolean)[1];
        return id ? `https://www.youtube.com/embed/${id}` : videoUrl;
      }
    }
  } catch {
    return videoUrl;
  }

  return videoUrl;
}

function isDirectVideoUrl(videoUrl: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoUrl);
}

interface VideoPlayerProps {
  episode: Episode;
  embedded?: boolean;
}

export default function VideoPlayer({ episode, embedded = true }: VideoPlayerProps) {
  const { videoUrl, title } = episode;

  if (!isPlayable(episode) || !videoUrl) {
    return (
      <div className={styles.frameWrap}>
        <div className={styles.comingSoon}>{ctaLabel(episode)}</div>
        <p className={styles.empty}>No video available for this episode yet.</p>
      </div>
    );
  }

  if (!embedded) {
    return (
      <a className={styles.linkOut} href={videoUrl} target="_blank" rel="noreferrer">
        Open video in a new tab
      </a>
    );
  }

  if (isDirectVideoUrl(videoUrl)) {
    return (
      <div className={styles.frameWrap}>
        <video className={styles.video} autoPlay loop muted playsInline controls preload="metadata">
          <source src={videoUrl} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  const embeddableUrl = toEmbedUrl(videoUrl);

  return (
    <div className={styles.frameWrap}>
      <iframe
        src={embeddableUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
