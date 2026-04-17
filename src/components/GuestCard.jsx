import styles from './GuestCard.module.css';

export default function GuestCard({ guest, onOpenEpisode }) {
  return (
    <article className={styles.card} onClick={() => onOpenEpisode(guest.episode)} role="button" tabIndex={0}>
      <div className={styles.info}>
        <div className={styles.episode}>Ep {String(guest.episode).padStart(2, '0')}</div>
        <h3 className={styles.name}>{guest.name}</h3>
        <p className={styles.role}>{guest.role}</p>
        <span className={styles.tag}>{guest.category}</span>
      </div>

      <img className={styles.avatar} src={guest.photo} alt={guest.name} loading="lazy" />
    </article>
  );
}