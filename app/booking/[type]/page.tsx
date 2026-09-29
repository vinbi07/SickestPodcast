import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import BookingForm from '../BookingForm';
import { footerColumns, FOOTER_TAGLINE } from '../../../content/footer';
import { primaryListenHref } from '../../../lib/episode-status';
import { buildMetadata } from '../../../lib/metadata';
import { BOOKING_TYPE_LABELS, BOOKING_TYPE_OPTIONS, isValidBookingType } from '../../../content/booking';

interface BookingTypePageProps {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return BOOKING_TYPE_OPTIONS.map((option) => ({ type: option.value }));
}

export async function generateMetadata({ params }: BookingTypePageProps): Promise<Metadata> {
  const { type } = await params;

  if (!isValidBookingType(type)) {
    return buildMetadata({
      title: 'Booking',
      description: 'Book Paden Sickles for a keynote, advisory program, or speaking inquiry.',
      path: '/booking',
    });
  }

  const option = BOOKING_TYPE_OPTIONS.find((item) => item.value === type)!;

  return buildMetadata({
    title: `${BOOKING_TYPE_LABELS[type]} | Booking`,
    description: `${option.description} Share your event details and get a response within 5-7 business days.`,
    path: `/booking/${type}`,
  });
}

export default async function BookingTypePage({ params }: BookingTypePageProps) {
  const { type } = await params;

  if (!isValidBookingType(type)) {
    notFound();
  }

  return (
    <div>
      <Navbar
        brand={{ prefix: 'THE', highlight: 'SICKEST', suffix: 'PODCAST' }}
        links={[
          { label: 'Episodes', href: '/episodes' },
          { label: 'Guests', href: '/#guests' },
          { label: 'About', href: '/#about' },
          { label: 'Party', href: '/end-of-season-party' },
        ]}
        bookHref="/booking/keynote"
        listenHref={primaryListenHref()}
      />
      <BookingForm initialType={type} />
      <Footer columns={footerColumns} tagline={FOOTER_TAGLINE} />
    </div>
  );
}
