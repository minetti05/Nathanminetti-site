import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftTag } from "@/components/PageBlocks";
import { Photo } from "@/components/Photo";
import { Text } from "@/components/Text";
import { getPage, getPhotoProjects } from "@/lib/content";
import { siteConfig } from "@/site.config";
import styles from "./photography.module.css";

type PhotoPage = { title: string; description: string; intro?: string; introDraft?: boolean };
const page = getPage<PhotoPage>("photography");

export const metadata: Metadata = pageMeta(page.title, page.description);

export default function PhotographyIndex() {
  if (!siteConfig.photography.enabled) notFound();
  const projects = getPhotoProjects().filter((p) => p.images.length > 0);

  return (
    <>
      <header className={`wrap ${styles.head}`}>
        <h1 className={styles.title}>{page.title}</h1>
        {page.intro && (
          <div className={styles.intro}>
            <DraftTag show={!!page.introDraft} />
            <p>
              <Text>{page.intro}</Text>
            </p>
          </div>
        )}
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
            {/* A contact strip: the first three frames, each whole at its own proportions. */}
            <div className={styles.strip}>
              {p.images.slice(0, 3).map((img) => (
                <Photo
                  key={img.file}
                  src={img.src!}
                  alt={img.alt}
                  width={img.width!}
                  height={img.height!}
                  sizes="(min-width: 62rem) 20vw, 30vw"
                  className={styles.stripImg}
                  priority={i === 0}
                />
              ))}
            </div>
            {p.body && (
              <div className={styles.rowStatement}>
                {p.body.split(/\n\s*\n/).map((para, k) => (
                  <p key={k}>
                    <Text>{para}</Text>
                  </p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
