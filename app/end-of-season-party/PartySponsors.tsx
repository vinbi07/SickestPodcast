import Image from 'next/image';
import { PARTY_SEASON_PARTNERS, PARTY_SPONSORS, type PartyLogo } from '../../content/party-sponsors';
import styles from './PartySponsors.module.css';

const SHAPE_CLASS: Record<PartyLogo['shape'], string> = {
  mark: styles.mark,
  wordmark: styles.wordmark,
  padded: styles.padded,
};

interface LogoGroupProps {
  title: string;
  logos: PartyLogo[];
  className: string;
}

function LogoGroup({ title, logos, className }: LogoGroupProps) {
  return (
    <div className={`${styles.group} ${className}`}>
      <h2 className={styles.overline}>{title}</h2>
      <ul className={styles.logos}>
        {logos.map((item) => {
          const image = (
            <span className={`${styles.logo} ${SHAPE_CLASS[item.shape]}`}>
              <Image src={item.logo} alt={item.name} sizes="(min-width: 960px) 240px, 40vw" />
            </span>
          );

          return (
            <li key={item.name}>
              {item.href ? (
                <a className={styles.link} href={item.href} target="_blank" rel="noreferrer">
                  {image}
                </a>
              ) : (
                image
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PartySponsors() {
  return (
    <section className={styles.section} aria-label="Sponsors and partners">
      <div className={`container ${styles.inner}`}>
        <LogoGroup title="Sponsors" logos={PARTY_SPONSORS} className={styles.sponsors} />
        <LogoGroup title="Season Partners" logos={PARTY_SEASON_PARTNERS} className={styles.partners} />
      </div>
    </section>
  );
}
