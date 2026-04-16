import styles from './Footer.module.css';

export default function Footer({ columns, tagline }) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.brand}>THE <span>SICK</span>EST PODCAST</div>
        <p className={styles.tagline}>{tagline}</p>

        <div className={styles.cols}>
          {columns.map((column) => (
            <div key={column.title}>
              <div className={styles.heading}>{column.title}</div>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>© 2026 The Sickest Podcast · Paden Sickles · SickFit</span>
          <span>Supposed to be here.</span>
        </div>
      </div>
    </footer>
  );
}