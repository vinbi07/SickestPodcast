import styles from './HeroStats.module.css';

export default function HeroStats({ stats, desktop = false }) {
  return (
    <div className={`${styles.stats} ${desktop ? styles.desktop : ''}`}>
      {stats.map((item) => (
        <div key={item.label} className={styles.item}>
          <div className={styles.number}>{item.value}</div>
          <div className={styles.label}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}