import VideoPlayer from './VideoPlayer';
import styles from './VideoModal.module.css';

export default function VideoModal({ episode, onClose }) {
  if (!episode) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close video modal">
          ×
        </button>
        <h3>{episode.title}</h3>
        <VideoPlayer videoUrl={episode.videoUrl} title={episode.title} embedded />
      </div>
    </div>
  );
}