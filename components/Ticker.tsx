import styles from './Ticker.module.css';

export default function Ticker({ items }: { items: string[] }) {
  const repeated = [...items, ...items];
  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`} className={styles.item}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
