import styles from './VideoPlayer.module.css';

function toEmbedUrl(videoUrl) {
  if (!videoUrl) return videoUrl;

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

function isDirectVideoUrl(videoUrl) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoUrl);
}

export default function VideoPlayer({ videoUrl, title, embedded = true }) {
  if (!videoUrl) {
    return <p className={styles.empty}>No video available for this episode yet.</p>;
  }

  const embeddableUrl = toEmbedUrl(videoUrl);

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
        <div className={styles.comingSoon}>Coming Soon</div>
        <video className={styles.video} autoPlay loop muted playsInline controls preload="metadata">
          <source src={videoUrl} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className={styles.frameWrap}>
      <div className={styles.comingSoon}>Coming Soon</div>
      <iframe
        src={embeddableUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}