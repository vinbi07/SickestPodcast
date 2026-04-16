import styles from './Pillars.module.css';

export default function Pillars({ pillars }) {
  return (
    <div className={styles.list}>
      {pillars.map((pillar) => (
        <article key={pillar.id} className={styles.item}>
          <div className={styles.badge}>{String(pillar.id).padStart(2, '0')}</div>
          <div>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}