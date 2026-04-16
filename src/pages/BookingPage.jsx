import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './BookingPage.module.css';

const footerColumns = [
  { title: 'The Show', items: ['Episodes', 'Season 1 Guests', 'About the Show', 'Watch on YouTube'] },
  { title: 'Paden Sickles', items: ['About Paden', 'Book a Keynote', 'VIP Advisory', 'Speaking Inquiries'] },
  { title: 'SickFit', items: ['Shop SickFit', 'Brand Partners', 'Retail Inquiries', 'sickfitofficial.com'] },
  { title: 'Connect', items: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube'] }
];

export default function BookingPage() {
  const handleBooking = () => {
    alert('Booking feature coming soon');
  };

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
          <div className={styles.overline}>Booking</div>
          <h1>Booking Page Coming Soon</h1>
          <p>
            We are setting up keynote and advisory booking workflows. For immediate requests, email
            hello@sickfitofficial.com.
          </p>
          <div className={styles.actions}>
            <button onClick={handleBooking}>Notify Me</button>
            <Link to="/">Back to Home</Link>
          </div>
        </section>
      </main>

      <Footer
        columns={footerColumns}
        tagline="People who were not supposed to win. Exactly how they did it."
      />
    </div>
  );
}