import Pillars from './Pillars';
import styles from './About.module.css';

export default function About({ quote, body, stats, pillars, onBook }) {
  return (
    <section className={styles.section} id="about">
      <div className={`container ${styles.layout}`}>
        <div>
          <div className={styles.overline}>The Show</div>
          <h2 className={styles.quote}>{quote}</h2>
          <p className={styles.body}>{body}</p>

          <div className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <div>{stat.value}</div>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <button className={styles.bookBtn} onClick={onBook}>
            About Paden
          </button>
        </div>

        <Pillars pillars={pillars} />
      </div>
    </section>
  );
}