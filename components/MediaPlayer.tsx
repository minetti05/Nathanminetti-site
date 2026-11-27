"use client";

import { useState } from "react";
import styles from "./MediaPlayer.module.css";

type Props = {
  platform: "youtube" | "vimeo" | "spotify";
  id: string;
  title: string;
  poster: { src: string; fit?: "cover" | "contain" } | null;
  client: string;
};

/**
 * Click-to-play facade. Nothing from YouTube, Vimeo or Spotify loads until the
 * visitor presses play, which keeps pages fast and avoids third-party cookies.
 */
export function MediaPlayer({ platform, id, title, poster, client }: Props) {
  const [active, setActive] = useState(false);
  const [posterSrc, setPosterSrc] = useState(poster?.src ?? null);
  const isAudio = platform === "spotify";

  const src =
    platform === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
      : platform === "vimeo"
        ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`
        : `https://open.spotify.com/embed/album/${id}?utm_source=generator`;

  if (active) {
    return (
      <div className={isAudio ? styles.audioFrame : styles.frame}>
        <iframe
          src={src}
          title={title}
          className={styles.iframe}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.frame}
      data-fit={poster?.fit ?? "cover"}
      onClick={() => setActive(true)}
      aria-label={`${isAudio ? "Play album" : "Play video"}: ${title}`}
    >
      {posterSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterSrc}
          alt=""
          className={styles.poster}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth <= 120 && posterSrc.includes("maxresdefault")) {
              setPosterSrc(posterSrc.replace("maxresdefault", "hqdefault"));
            }
          }}
          onError={() => {
            if (posterSrc.includes("maxresdefault")) setPosterSrc(posterSrc.replace("maxresdefault", "hqdefault"));
            else setPosterSrc(null);
          }}
        />
      ) : (
        <span className={styles.posterEmpty} aria-hidden="true">
          {client}
        </span>
      )}
      <span className={styles.play} aria-hidden="true">
        <span className={styles.playMark} />
        {isAudio ? "Play album" : "Play video"}
      </span>
    </button>
  );
}
