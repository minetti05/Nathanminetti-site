"use client";

import { useState } from "react";
import styles from "./CaseMedia.module.css";

/**
 * The image for a case study card. Uses a supplied still, else the YouTube thumbnail
 * (falling back from max-res to high-quality when YouTube has no max-res version).
 * With no image at all it shows a typographic placeholder that says what is missing.
 */
export function CaseMedia({
  src,
  alt,
  client,
  priority = false,
}: {
  src: string | null;
  alt: string;
  client: string;
  priority?: boolean;
}) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);

  if (!current || failed) {
    return (
      <div className={styles.frame} data-empty>
        <span className={styles.emptyClient} aria-hidden="true">
          {client}
        </span>
        <span className={`ph ${styles.emptyNote}`}>[Still needed]</span>
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={alt}
        className={styles.img}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={(e) => {
          // YouTube returns a 120px grey image instead of a 404 when max-res is missing.
          if (e.currentTarget.naturalWidth <= 120 && current.includes("maxresdefault")) {
            setCurrent(current.replace("maxresdefault", "hqdefault"));
          }
        }}
        onError={() => {
          if (current.includes("maxresdefault")) setCurrent(current.replace("maxresdefault", "hqdefault"));
          else setFailed(true);
        }}
      />
    </div>
  );
}
