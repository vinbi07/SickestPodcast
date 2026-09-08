import type { StaticImageData } from "next/image";
import { YoutubeIcon } from "./icons/SocialIcons";
import spotifyIcon from "../assets/icons/spotify-icon.svg";
import appleMusicIcon from "../assets/icons/Apple_Music_icon.svg";
import feedIcon from "../assets/icons/Generic_Feed-icon.svg";
import amazonMusicIcon from "../assets/icons/Amazon_Music_logo.svg";
import styles from "./Platforms.module.css";
import type { PlatformLinks } from "../content/types";

interface PlatformDef {
  label: string;
  key: keyof PlatformLinks;
  icon: StaticImageData | typeof YoutubeIcon;
  type: "img" | "component";
  color?: string;
}

const platformDefs: PlatformDef[] = [
  { label: "Spotify", key: "spotify", icon: spotifyIcon, type: "img" },
  {
    label: "Apple Podcasts",
    key: "applePodcasts",
    icon: appleMusicIcon,
    type: "img",
  },
  {
    label: "YouTube",
    key: "youtube",
    icon: YoutubeIcon,
    type: "component",
    color: "#ff0000",
  },
  {
    label: "Amazon Music",
    key: "amazonMusic",
    icon: amazonMusicIcon,
    type: "img",
  },
  { label: "RSS", key: "rss", icon: feedIcon, type: "img" },
];

interface PlatformsProps {
  platformLinks: PlatformLinks;
  morePlatformsHref?: string;
  transparent?: boolean;
}

export default function Platforms({ platformLinks, morePlatformsHref, transparent }: PlatformsProps) {
  const hasAnyLink = platformDefs.some((platform) =>
    Boolean(platformLinks[platform.key]),
  );

  return (
    <section className={`${styles.section} ${transparent ? styles.transparent : ""}`}>
      <div className={`container ${styles.row}`}>
        <h2>
          {hasAnyLink ? "Listen everywhere" : "Listen everywhere (Coming Soon)"}
        </h2>
        <div>
          {platformDefs.map((platform) => {
            const href = platformLinks[platform.key];
            const icon =
              platform.type === "component" ? (
                <YoutubeIcon size={18} color={platform.color} />
              ) : (
                <img
                  src={(platform.icon as StaticImageData).src}
                  alt=""
                  aria-hidden="true"
                />
              );

            if (href) {
              return (
                <a
                  key={platform.label}
                  className={styles.item}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {icon}
                  <span>{platform.label}</span>
                </a>
              );
            }

            return (
              <span
                key={platform.label}
                className={styles.item}
                aria-disabled="true"
              >
                {icon}
                <span>{platform.label}</span>
              </span>
            );
          })}
          {morePlatformsHref && (
            <a
              className={styles.more}
              href={morePlatformsHref}
              target="_blank"
              rel="noreferrer"
            >
              More Platforms →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
