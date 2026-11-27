import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/Photo";
import { getPhotoProjects } from "@/lib/content";
import { siteConfig } from "@/site.config";
import styles from "./photography.module.css";

export const metadata: Metadata = {
  title: "Photography",
  description: "Instant film photography by Nathan Minetti, in four series.",
};

export default function PhotographyIndex() {
  if (!siteConfig.photography.enabled) notFound();
  const projects = getPhotoProjects().filter((p) => p.images.length > 0);

  return (
    <>
      <header className={`wrap ${styles.head}`}>
        <h1 className={styles.title}>Photography</h1>
      </header>

      <ol className={`wrap ${styles.series}`}>
        {projects.map((p, i) => (
          <li key={p.slug} className={styles.seriesItem}>
            <div className={styles.seriesText}>
              <h2 className={styles.seriesTitle}>
                <Link href={`/photography/${p.slug}`} className="stretched">
                  {p.title}
                </Link>
              </h2>
              <p className={styles.count}>{p.images.length} photographs</p>
            </div>
            {/* A contact strip: the first frames at one height, each at its own width. Nothing is cropped. */}
            <div className={styles.strip} aria-hidden="true">
              {p.images.slice(0, 3).map((img) => (
                <Photo
                  key={img.file}
                  src={img.src!}
                  alt=""
                  width={img.width!}
                  height={img.height!}
                  sizes="(min-width: 62rem) 20vw, 30vw"
                  className={styles.stripImg}
                  priority={i === 0}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
