import type { Metadata } from "next";
import Link from "next/link";
import { CaseMedia } from "@/components/CaseMedia";
import { Text } from "@/components/Text";
import { caseImage, getAllWork, type CaseStudy } from "@/lib/content";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Case studies in strategic partnerships, creative innovation and cultural collaboration for Walmart, Mastercard, Amtrak, Coca-Cola and more.",
};

const watchUrl = (c: CaseStudy, id?: string) => {
  const m = c.media;
  if (!m) return null;
  const vid = id ?? m.id;
  if (m.platform === "youtube") return `https://www.youtube.com/watch?v=${vid}`;
  if (m.platform === "vimeo") return `https://vimeo.com/${vid}`;
  return `https://open.spotify.com/album/${vid}`;
};

async function Entry({ c, priority }: { c: CaseStudy; priority: boolean }) {
  const img = await caseImage(c);
  return (
    <li className={`${styles.entry} ${styles.entryLink}`}>
      <p className={styles.entryYear}>{c.year}</p>
      <div className={styles.entryMedia}>
        {/* Decorative here: the linked title names the case. */}
        <CaseMedia src={img?.src ?? null} alt="" fit={img?.fit} client={c.client} priority={priority} />
      </div>
      <div className={styles.entryText}>
        <p className={styles.entryClient}>
          <Text>{c.client}</Text>
          <span aria-hidden="true"> · </span>
          <Text>{c.project}</Text>
        </p>
        <h2 className={styles.entryTitle}>
          <Link href={`/work/${c.slug}`} className="stretched">
            <Text>{c.title}</Text>
          </Link>
        </h2>
        <p className={styles.entryDek}>
          <Text>{c.dek}</Text>
        </p>
        <p className={styles.entryMeta}>
          <Text>{c.agency}</Text>
        </p>
        <p className={styles.entryRole}>
          <Text>{c.role}</Text>
        </p>
      </div>
    </li>
  );
}

export default function WorkIndex() {
  // Newest first (brief section 6).
  const all = getAllWork();
  const featured = all.filter((c) => c.featured);
  const more = all.filter((c) => !c.featured);

  return (
    <>
      <header className={`wrap ${styles.pageHead}`}>
        <h1 className={styles.pageTitle}>Selected Work</h1>
      </header>

      <section className="wrap" aria-label="Featured case studies">
        <ul className={styles.ledger}>
          {featured.map((c, i) => (
            <Entry key={c.slug} c={c} priority={i < 2} />
          ))}
        </ul>
      </section>

      {more.length > 0 && (
        <section className="wrap" aria-labelledby="more-heading">
          <header className={styles.moreHead}>
            <h2 id="more-heading" className={styles.moreTitle}>
              More work
            </h2>
          </header>
          <ul className={styles.more}>
            {more.map((c) => {
              const url = watchUrl(c);
              return (
                <li key={c.slug} id={c.slug} className={styles.moreItem}>
                  <p className={styles.moreYear}>{c.year}</p>
                  <h3 className={styles.moreName}>
                    <span className={styles.moreClient}>
                      <Text>{c.client}</Text>
                    </span>
                    <Text>{c.project}</Text>
                  </h3>
                  <div className={styles.moreBody}>
                    <p>
                      <Text>{c.summary}</Text>
                    </p>
                    <p className={styles.moreMeta}>
                      <Text>{c.role}</Text>
                      <span aria-hidden="true"> · </span>
                      <Text>{c.agency}</Text>
                    </p>
                    {url && (
                      <p className={styles.moreLinks}>
                        <a href={url} className="link" target="_blank" rel="noopener noreferrer">
                          {c.media?.label ?? "Watch"}
                          <span className="visually-hidden">: {c.project}</span>
                        </a>
                        {c.extraMedia?.map((m) => (
                          <a
                            key={m.id}
                            href={watchUrl(c, m.id) ?? "#"}
                            className="link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {m.label ?? "Watch more"}
                          </a>
                        ))}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </>
  );
}
