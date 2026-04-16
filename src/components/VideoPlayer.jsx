import styles from './VideoPlayer.module.css';

export default function VideoPlayer({ videoUrl, title, embedded = true }) {
  if (!videoUrl) {
    return <p className={styles.empty}>No video available for this episode yet.</p>;
  }

  if (!embedded) {
    return (
      <a className={styles.linkOut} href={videoUrl} target="_blank" rel="noreferrer">
        Open video in a new tab
      </a>
    );
  }

  return (
    <div className={styles.frameWrap}>
      <iframe
        src={videoUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}