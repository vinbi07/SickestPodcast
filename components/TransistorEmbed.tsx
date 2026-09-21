import styles from "./TransistorEmbed.module.css";

const EMBEDS = {
  latest: {
    src: "https://share.transistor.fm/e/the-sickest-podcast/latest",
    height: 190,
    title: "Latest episode of The Sickest Podcast",
  },
  playlist: {
    src: "https://share.transistor.fm/e/the-sickest-podcast/playlist",
    height: 390,
    title: "The Sickest Podcast episode playlist",
  },
} as const;

interface TransistorEmbedProps {
  variant: keyof typeof EMBEDS;
  heading?: string;
  transparent?: boolean;
  /** Render just the iframe, without the section wrapper, for use inside another section. */
  inline?: boolean;
}

export default function TransistorEmbed({
  variant,
  heading,
  transparent,
  inline,
}: TransistorEmbedProps) {
  const embed = EMBEDS[variant];

  const frame = (
    <iframe
      className={styles.frame}
      width="100%"
      height={embed.height}
      src={embed.src}
      title={embed.title}
      loading="lazy"
      scrolling="no"
      style={{ border: 0 }}
    />
  );

  if (inline) return frame;

  return (
    <section
      className={`${styles.section} ${transparent ? styles.transparent : ""}`}
    >
      <div className="container">
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {frame}
      </div>
    </section>
  );
}
