import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaPlayer } from "@/components/MediaPlayer";
import { Mdx } from "@/components/Mdx";
import { Text } from "@/components/Text";
import { caseImage, getFeaturedWork } from "@/lib/content";
import styles from "../work.module.css";

// One page per featured case study. "More work" entries are short entries on /work.
export const dynamicParams = false;
export function generateStaticParams() {
  return getFeaturedWork().map((c) => ({ slug: c.slug }));
}

const strip = (s?: string) => (s ?? "").replace(/\[[^\]]*\]/g, "").trim();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getFeaturedWork().find((w) => w.slug === slug);
  if (!c) return {};
  return pageMeta(`${c.client}: ${c.project}`, strip(c.dek));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const featured = getFeaturedWork();
  const i = featured.findIndex((w) => w.slug === slug);
  if (i === -1) notFound();
  const c = featured[i];
  const next = featured[(i + 1) % featured.length];
  const poster = await caseImage(c);

  return (
    <article>
      <header className={`wrap ${styles.caseHead}`}>
        <p className={styles.kicker}>
          <Link href="/work" className={styles.kickerLink}>
            Selected Work
          </Link>
        </p>
        <h1 className={styles.caseTitle}>
          <Text>{c.title}</Text>
        </h1>
        <p className={styles.caseDek}>
          <Text>{c.dek}</Text>
        </p>

        {/* Header line: Client · Year · Agency · Role */}
        <dl className={styles.credits}>
          <div>
            <dt>Client</dt>
            <dd>
              <Text>{c.client}</Text>
            </dd>
          </div>
          <div>
            <dt>Project</dt>
            <dd>
              <Text>{c.project}</Text>
            </dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>
              <Text>{c.year}</Text>
            </dd>
          </div>
          <div>
            <dt>Agency</dt>
            <dd>
              <Text>{c.agency}</Text>
            </dd>
          </div>
          <div className={styles.creditsRole}>
            <dt>My role</dt>
            <dd>
              <Text>{c.role}</Text>
            </dd>
          </div>
        </dl>
      </header>

      {c.media?.id && (
        <div className={`wrap ${styles.caseMedia}`}>
          <MediaPlayer
            platform={c.media.platform}
            id={c.media.id}
            title={`${c.client}: ${c.project}`}
            poster={poster ? { src: poster.src, fit: poster.fit } : null}
            client={c.client}
          />
        </div>
      )}

      <div className={`wrap ${styles.caseBody}`}>
        <Mdx source={c.body} />

        {c.press && c.press.length > 0 && (
          <>
            <h2>In the press</h2>
            <ul className={styles.press}>
              {c.press.map((p) => (
                <li key={p.url}>
                  {/^https?:\/\//.test(p.url) ? (
                    <a href={p.url} className="link" target="_blank" rel="noopener noreferrer">
                      {p.outlet}
                    </a>
                  ) : (
                    <>
                      {p.outlet} <Text>{p.url}</Text>
                    </>
                  )}
                  {p.date && <span className={styles.pressDate}>{p.date}</span>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {next && next.slug !== c.slug && (
        <nav aria-label="Next case study" className={`wrap ${styles.next}`}>
          <Link href={`/work/${next.slug}`} className={styles.nextLink}>
            <span className={styles.nextLabel}>Next case study</span>
            <span className={styles.nextClient}>
              <Text>{next.client}</Text>
            </span>
            <span className={styles.nextTitle}>
              <Text>{next.title}</Text>
            </span>
          </Link>
          <Link href="/work" className={`link ${styles.allWork}`}>
            All work
          </Link>
        </nav>
      )}
    </article>
  );
}
