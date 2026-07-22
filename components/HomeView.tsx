"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Ticker from "./Ticker";
import FeaturedEpisode from "./FeaturedEpisode";
import Guests from "./Guests";
import Episodes from "./Episodes";
import About from "./About";
import HostSection from "./HostSection";
import Platforms from "./Platforms";
import Footer from "./Footer";
import VideoModal from "./VideoModal";
import { footerColumns, FOOTER_TAGLINE } from "../content/footer";
import { host } from "../content/host";
import { primaryListenHref } from "../lib/episode-status";
import type { Episode, Guest } from "../content/types";
import styles from "./HomePage.module.css";

const pillars = [
  {
    id: 1,
    title: "The Underdog Story",
    description:
      "Where did the odds stack against you, and what did you build when no one was handing you leverage?",
  },
  {
    id: 2,
    title: "The Decision Moment",
    description:
      "The pivot, the risk, the line in the sand that changed everything and demanded full commitment.",
  },
  {
    id: 3,
    title: "The Real Game",
    description:
      "No polished script. Practical systems, high standards, and what actually moves outcomes daily.",
  },
];

interface HomeViewProps {
  episodes: Episode[];
  guests: Guest[];
}

export default function HomeView({ episodes, guests }: HomeViewProps) {
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const featuredEpisode = episodes[0];

  const heroStats = useMemo(
    () => [
      { value: guests.length, label: "Season 1 Guests" },
      { value: pillars.length, label: "Core Pillars" },
      { value: 1, label: "Rule: Go Deeper" },
    ],
    [guests.length],
  );

  return (
    <div className={styles.page}>
      <Navbar
        brand={{ prefix: "THE", highlight: "SICKEST", suffix: "PODCAST" }}
        links={[
          { label: "Episodes", href: "/episodes" },
          { label: "Guests", href: "#guests" },
          { label: "About", href: "#about" },
          { label: "Watch", href: "/episodes" },
        ]}
        bookHref="/booking/keynote"
        listenHref={primaryListenHref()}
      />

      <main>
        <Hero
          titleLines={["THE", "SICKEST", "PODCAST"]}
          subtitle="Real interviews with the underdogs, athletes, and executives who were not supposed to win."
          currentEpisode={featuredEpisode}
          stats={heroStats}
          onPlay={setActiveEpisode}
        />

        <Ticker
          items={[
            "The Sickest Podcast",
            "Paden Sickles",
            "Athletes",
            "Actors",
            "Executives",
            "Builders",
            "The Real Story",
            "The Sickest Podcast",
            "Paden Sickles",
            "Athletes",
            "Actors",
            "Executives",
            "Builders",
            "The Real Story",
          ]}
        />

        <FeaturedEpisode episode={featuredEpisode} onPlay={setActiveEpisode} />
        <Platforms platformLinks={{}} />
        <Guests guests={guests} />
        <Episodes episodes={episodes} onPlay={setActiveEpisode} />

        <About
          quote="People who had to earn every room they walked into."
          body="The Sickest Podcast sits down with athletes, actors, executives, and builders who had to force their way in. Every interview goes beyond headlines to unpack the decisions, discipline, and trade-offs that built real momentum."
          stats={heroStats}
          pillars={pillars}
          bookHref="/booking/speaking"
        />

        <HostSection
          host={host}
          keynoteHref="/booking/keynote"
          advisoryHref="/booking/advisory"
        />
      </main>

      <Footer columns={footerColumns} tagline={FOOTER_TAGLINE} />

      <AnimatePresence>
        {activeEpisode && (
          <VideoModal
            episode={activeEpisode}
            onClose={() => setActiveEpisode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
