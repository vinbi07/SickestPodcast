import styles from './HostSection.module.css';

export default function HostSection({ host, onBook }) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.layout}`}>
        <div>
          <div className={styles.overline}>Your Host</div>
          <h2>
            {host.firstName}
            <span>{host.lastName}</span>
          </h2>
          <p>{host.bio}</p>

          <ul>
            {host.credentials.map((credential) => (
              <li key={credential}>{credential}</li>
            ))}
          </ul>

          <div className={styles.actions}>
            <button onClick={onBook}>Book a Keynote</button>
            <button onClick={onBook}>Advisory Program</button>
          </div>
        </div>

        <div>
          <blockquote>
            <span>"{host.quote}"</span>
            <footer>{host.firstName} {host.lastName} · Founder, SickFit</footer>
          </blockquote>

          <div className={styles.advisory}>
            <div>VIP Advisory</div>
            <h3>12 Calls. 12 Months. $12,000.</h3>
            <p>
              Monthly one-on-one strategy access with direct operator support, practical frameworks,
              and accountability.
            </p>
            <button onClick={onBook}>Apply Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}