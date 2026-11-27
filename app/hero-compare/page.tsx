import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Text } from "@/components/Text";
import { getPage } from "@/lib/content";
import { siteConfig } from "@/site.config";
import styles from "../home.module.css";

// Temporary review page: the current hero beside the alternative supporting line.
// Not linked, not in the sitemap, always noindex, and gone once launch.indexable is on.
export const metadata: Metadata = { title: "Hero comparison", robots: { index: false, follow: false } };

type Home = { hero: { headline: string; copy: string; copyAlternative?: string } };

export default function HeroCompare() {
  if (siteConfig.launch.indexable) notFound();
  const { hero } = getPage<Home>("home");
  const versions = [
    { label: "A · Current (live)", copy: hero.copy },
    { label: "B · Alternative", copy: hero.copyAlternative ?? "" },
  ];
  return (
    <>
      {versions.map((v) => (
        <section key={v.label} className={`wrap ${styles.hero}`} style={{ paddingBottom: "4rem" }}>
          <p
            style={{ gridColumn: "1 / -1", marginBottom: "1.5rem" }}
            className="ph"
          >
            {v.label}
          </p>
          <h2 className={styles.heroHeadline}>
            <Text>{hero.headline}</Text>
          </h2>
          <div className={styles.heroBody}>
            <p className={styles.heroCopy}>
              <Text>{v.copy}</Text>
            </p>
          </div>
        </section>
      ))}
    </>
  );
}
