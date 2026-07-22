import type { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BookingForm from './BookingForm';
import { footerColumns, FOOTER_TAGLINE } from '../../content/footer';
import { primaryListenHref } from '../../lib/episode-status';
import { buildMetadata } from '../../lib/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Booking',
  description:
    'Book Paden Sickles for a keynote, advisory program, or speaking inquiry — share your event details and get a response within 5-7 business days.',
  path: '/booking',
});

export default function BookingPage() {
  return (
    <div>
      <Navbar
        brand={{ prefix: 'THE', highlight: 'SICKEST', suffix: 'PODCAST' }}
        links={[
          { label: 'Episodes', href: '/episodes' },
          { label: 'Guests', href: '/#guests' },
          { label: 'About', href: '/#about' },
        ]}
        bookHref="/booking/keynote"
        listenHref={primaryListenHref()}
      />
      <BookingForm />
      <Footer columns={footerColumns} tagline={FOOTER_TAGLINE} />
    </div>
  );
}
