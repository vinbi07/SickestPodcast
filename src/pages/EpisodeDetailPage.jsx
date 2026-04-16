import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoPlayer from '../components/VideoPlayer';
import { episodes } from '../data/podcasts';
import styles from './EpisodeDetailPage.module.css';

const footerColumns = [
  { title: 'The Show', items: ['Episodes', 'Season 1 Guests', 'About the Show', 'Watch on YouTube'] },
  { title: 'Paden Sickles', items: ['About Paden', 'Book a Keynote', 'VIP Advisory', 'Speaking Inquiries'] },
  { title: 'SickFit', items: ['Shop SickFit', 'Brand Partners', 'Retail Inquiries', 'sickfitofficial.com'] },
  { title: 'Connect', items: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube'] }
];

export default function EpisodeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const episode = episodes.find((item) => String(item.id) === id);

  const handleBooking = () => {
    navigate('/booking');
  };

  if (!episode) {
    return (
      <div>
        <Navbar
          brand={{ prefix: 'THE', highlight: 'SICK', suffix: 'EST PODCAST' }}
          links={[]}
          onBook={handleBooking}
        />
        <main className={styles.notFound}>
          <h1>Episode not found</h1>
          <Link to="/">Return Home</Link>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        brand={{ prefix: 'THE', highlight: 'SICK', suffix: 'EST PODCAST' }}
        links={[
          { label: 'Episodes', href: '/#episodes' },
          { label: 'Guests', href: '/#guests' },
          { label: 'About', href: '/#about' }
        ]}
        onBook={handleBooking}
      />

      <main className={styles.page}>
        <section className={`container ${styles.hero}`}>
          <div className={styles.meta}>Episode {String(episode.id).padStart(2, '0')} · {episode.duration}</div>
          <h1>{episode.title}</h1>
          <p className={styles.role}>{episode.role}</p>
          <p className={styles.desc}>{episode.description}</p>
          <div className={styles.actions}>
            <button onClick={handleBooking}>Book Paden</button>
            <Link to="/">Back to Home</Link>
          </div>
        </section>

        <section className={`container ${styles.player}`}>
          <VideoPlayer videoUrl={episode.videoUrl} title={episode.title} embedded />
        </section>
      </main>

      <Footer
        columns={footerColumns}
        tagline="People who were not supposed to win. Exactly how they did it."
      />
    </div>
  );
}