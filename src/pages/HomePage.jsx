import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import FeaturedEpisode from '../components/FeaturedEpisode';
import Guests from '../components/Guests';
import Episodes from '../components/Episodes';
import About from '../components/About';
import HostSection from '../components/HostSection';
import Platforms from '../components/Platforms';
import Footer from '../components/Footer';
import VideoModal from '../components/VideoModal';
import { episodes } from '../data/podcasts';
import { guests } from '../data/guests';
import { BOOKING_TYPES, DEFAULT_BOOKING_TYPE } from '../data/booking';
import styles from './HomePage.module.css';

const pillars = [
  {
    id: 1,
    title: 'The Underdog Story',
    description:
      'Where did the odds stack against you, and what did you build when no one was handing you leverage?'
  },
  {
    id: 2,
    title: 'The Decision Moment',
    description:
      'The pivot, the risk, the line in the sand that changed everything and demanded full commitment.'
  },
  {
    id: 3,
    title: 'The Real Game',
    description:
      'No polished script. Practical systems, high standards, and what actually moves outcomes daily.'
  }
];

const footerColumns = [
  { title: 'The Show', items: ['Episodes', 'Season 1 Guests', 'About the Show', 'Watch on YouTube'] },
  { title: 'Paden Sickles', items: ['About Paden', 'Book a Keynote', 'VIP Advisory', 'Speaking Inquiries'] },
  { title: 'SickFit', items: ['Shop SickFit', 'Brand Partners', 'Retail Inquiries', 'sickfitofficial.com'] },
  { title: 'Connect', items: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube'] }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeEpisode, setActiveEpisode] = useState(null);

  const featuredEpisode = episodes[0];
  const heroStats = useMemo(
    () => [
      { value: guests.length, label: 'Season 1 Guests' },
      { value: pillars.length, label: 'Core Pillars' },
      { value: 1, label: 'Rule: Go Deeper' }
    ],
    []
  );

  const handleBooking = (type = DEFAULT_BOOKING_TYPE) => {
    navigate(`/booking?type=${encodeURIComponent(type)}`);
  };

  const handleOpenEpisode = (episodeId) => {
    navigate(`/episodes/${episodeId}`);
  };

  return (
    <div className={styles.page}>
      <Navbar
        brand={{ prefix: 'THE', highlight: 'SICKEST', suffix: 'PODCAST' }}
        links={[
          { label: 'Episodes', href: '#episodes' },
          { label: 'Guests', href: '#guests' },
          { label: 'About', href: '#about' },
          { label: 'Watch', href: '#episodes' }
        ]}
        onBook={handleBooking}
      />

      <main>
        <Hero
          titleLines={['THE', 'SICKEST', 'PODCAST']}
          subtitle="People who were not supposed to win. Exactly how they did it."
          currentEpisode={featuredEpisode}
          stats={heroStats}
          onPlay={setActiveEpisode}
        />

        <Ticker
          items={[
            'The Sickest Podcast',
            'Paden Sickles',
            'Athletes',
            'Actors',
            'Executives',
            'Builders',
            'The Real Story',
            'The Sickest Podcast',
            'Paden Sickles',
            'Athletes',
            'Actors',
            'Executives',
            'Builders',
            'The Real Story'
          ]}
        />

        <FeaturedEpisode episode={featuredEpisode} onPlay={setActiveEpisode} />
                <Platforms items={['Spotify', 'Apple Podcasts', 'YouTube', 'Amazon Music', 'RSS']} />
        <Guests guests={guests} onOpenEpisode={handleOpenEpisode} />
        <Episodes episodes={episodes} onPlay={setActiveEpisode} />

        <About
          quote="People who had to earn every room they walked into."
          body="The Sickest Podcast sits down with athletes, actors, executives, and builders who had to force their way in. Every conversation goes beyond headlines to unpack the decisions, discipline, and trade-offs that built real momentum."
          stats={heroStats}
          pillars={pillars}
          onBook={() => handleBooking(BOOKING_TYPES.SPEAKING)}
        />

        <HostSection
          host={{
            firstName: 'Paden',
            lastName: 'Sickles',
            bio: 'Army veteran and founder of SickFit. She left a defining career, built a brand from scratch, and brings that same direct operator lens to every interview.',
            credentials: [
              '11-year Army Engineer Officer, Captain',
              'Founder and CEO of SickFit',
              'Goldman Sachs 10KSB Alumna',
              'MBA Finance · PMP · LSSBB'
            ],
            quote:
              'I left a career that defined me to bet everything on a sock company. I would do it again.'
          }}
          onBook={handleBooking}
        />

      </main>

      <Footer
        columns={footerColumns}
        tagline="People who were not supposed to win. Exactly how they did it."
      />

      <AnimatePresence>
        {activeEpisode && <VideoModal episode={activeEpisode} onClose={() => setActiveEpisode(null)} />}
      </AnimatePresence>
    </div>
  );
}