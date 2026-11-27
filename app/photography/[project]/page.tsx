import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Photo } from "@/components/Photo";
import { Text } from "@/components/Text";
import { getPhotoProjects } from "@/lib/content";
import { siteConfig } from "@/site.config";
import styles from "../photography.module.css";

const projects = () => getPhotoProjects().filter((p) => p.images.length > 0);

export const dynamicParams = false;
export function generateStaticParams() {
  return projects().map((p) => ({ project: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ project: string }> }): Promise<Metadata> {
  const { project } = await params;
  const p = projects().find((x) => x.slug === project);
  return p ? { title: `${p.title} · Photography`, description: `${p.title}: ${p.images.length} instant film photographs by Nathan Minetti.` } : {};
}

export default async function Gallery({ params }: { params: Promise<{ project: string }> }) {
  if (!siteConfig.photography.enabled) notFound();
  const { project } = await params;
  const all = projects();
  const i = all.findIndex((x) => x.slug === project);
  if (i === -1) notFound();
  const p = all[i];
  const next = all[(i + 1) % all.length];
  const total = String(p.images.length).padStart(2, "0");

  return (
    <article>
      <header className={`wrap ${styles.galleryHead}`}>
        <p className={styles.kicker}>
          <Link href="/photography" className={styles.kickerLink}>
            Photography
          </Link>
        </p>
        <h1 className={styles.galleryTitle}>{p.title}</h1>
        <p className={styles.count}>{p.images.length} photographs</p>
        {p.body && (
          <p className={styles.statement}>
            <Text>{p.body}</Text>
          </p>
        )}
      </header>

      {/* One photograph at a time, like the pages of a book. Original order and proportions. */}
      <ol className={`wrap ${styles.plates}`}>
        {p.images.map((img, n) => (
          <li key={img.file} className={styles.plate}>
            <figure className={styles.figure}>
              <Photo
                src={img.src!}
                alt={img.alt}
                width={img.width!}
                height={img.height!}
                sizes="(min-width: 62rem) 60vw, 92vw"
                className={styles.plateImg}
                priority={n === 0}
              />
              <figcaption className={styles.plateNum}>
                {String(n + 1).padStart(2, "0")} / {total}
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>

      {next && next.slug !== p.slug && (
        <nav aria-label="Next series" className={`wrap ${styles.next}`}>
          <Link href={`/photography/${next.slug}`} className={styles.nextLink}>
            <span className={styles.nextLabel}>Next series</span>
            <span className={styles.nextTitle}>{next.title}</span>
          </Link>
          <Link href="/photography" className={`link ${styles.allLink}`}>
            All series
          </Link>
        </nav>
      )}
    </article>
  );
}
