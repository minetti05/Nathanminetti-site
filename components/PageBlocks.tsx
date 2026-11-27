import Link from "next/link";
import type { CSSProperties } from "react";
import { CaseMedia } from "./CaseMedia";
import { Text } from "./Text";
import { caseImage, getAllWork } from "@/lib/content";
import styles from "./page.module.css";

export { styles as pageStyles };

export function PageIntro({ title, sub, lead }: { title: string; sub?: string; lead?: string }) {
  return (
    <header className={`wrap ${styles.intro}`}>
      <h1 className={styles.title}>
        <Text>{title}</Text>
      </h1>
      {sub && (
        <p className={styles.sub}>
          <Text>{sub}</Text>
        </p>
      )}
      {lead && (
        <p className={styles.lead}>
          <Text>{lead}</Text>
        </p>
      )}
    </header>
  );
}

export function Steps({ steps, note }: { steps: string[]; note?: string }) {
  return (
    <>
      <ol className={styles.steps} style={{ "--n": steps.length } as CSSProperties}>
        {steps.map((s) => (
          <li key={s} className={styles.step}>
            <span className={styles.stepName}>
              <Text>{s}</Text>
            </span>
          </li>
        ))}
      </ol>
      {note && (
        <p className={styles.note}>
          <Text>{note}</Text>
        </p>
      )}
    </>
  );
}

/** Small linked case studies, by file name in /content/work. */
export async function ProofList({ slugs }: { slugs: string[] }) {
  const all = getAllWork();
  const cases = slugs.map((s) => all.find((c) => c.slug === s)).filter((c) => c !== undefined);
  const items = await Promise.all(cases.map(async (c) => ({ c, img: await caseImage(c) })));
  return (
    <ul className={styles.proof}>
      {items.map(({ c, img }) => (
        <li key={c.slug}>
          <Link href={c.featured ? `/work/${c.slug}` : `/work#${c.slug}`} className={styles.proofLink}>
            <CaseMedia src={img?.src ?? null} alt={img?.alt ?? ""} fit={img?.fit} client={c.client} />
            <span className={styles.proofClient}>
              <Text>{c.client}</Text>
            </span>
            <span className={styles.proofTitle}>
              <Text>{c.title ?? c.project}</Text>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ClosingCta({ label, href }: { label: string; href: string }) {
  return (
    <section className={`wrap ${styles.cta}`}>
      <Link href={href} className={styles.ctaLink}>
        {label}
      </Link>
    </section>
  );
}
