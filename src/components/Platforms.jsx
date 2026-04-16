import styles from './Platforms.module.css';

export default function Platforms({ items }) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.row}`}>
        <h2>Listen everywhere</h2>
        <div>
          {items.map((item) => (
            <button key={item}>{item}</button>
          ))}
        </div>
      </div>
    </section>
  );
}