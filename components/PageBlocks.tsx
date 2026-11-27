import Link from "next/link";
import type { CSSProperties } from "react";
import { CaseMedia } from "./CaseMedia";
import { Text } from "./Text";
import { caseImage, getAllWork } from "@/lib/content";
import styles from "./page.module.css";

export { styles as pageStyles };

/** Small tag marking copy that still needs Nathan's approval (draft: true in content). */
export function DraftTag({ show = true }: { show?: boolean }) {
  if (!show) return null;
  return <span className={`ph ${styles.draftTag}`}>Draft for approval</span>;
}

export function PageIntro({
  title,
  sub,
  lead,
  leadDraft = false,
}: {
  title: string;
  sub?: string;
  lead?: string;
  leadDraft?: boolean;
}) {
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
        <div className={styles.lead}>
          <DraftTag show={leadDraft} />
          <p>
            <Text>{lead}</Text>
          </p>
        </div>
      )}
    </header>
  );
}

export type Step = string | { name: string; text?: string };

export function Steps({ steps, note, draft = false }: { steps: Step[]; note?: string; draft?: boolean }) {
  const list = steps.map((s) => (typeof s === "string" ? { name: s, text: "" } : s));
  return (
    <>
      {draft && (
        <p className={styles.draftLine}>
          <DraftTag />
        </p>
      )}
      <ol className={styles.steps} style={{ "--n": list.length } as CSSProperties}>
        {list.map((s) => (
          <li key={s.name} className={styles.step}>
            <h3 className={styles.stepName}>
              <Text>{s.name}</Text>
            </h3>
            {s.text && (
              <p className={styles.stepText}>
                <Text>{s.text}</Text>
              </p>
            )}
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
        <li key={c.slug} className={styles.proofItem}>
          {/* Image is decorative here: the linked title below names the case. */}
          <CaseMedia src={img?.src ?? null} alt="" fit={img?.fit} client={c.client} />
          <p className={styles.proofClient}>
            <Text>{c.client}</Text>
          </p>
          <h3 className={styles.proofTitle}>
            <Link href={c.featured ? `/work/${c.slug}` : `/work#${c.slug}`} className="stretched">
              <Text>{c.title ?? c.project}</Text>
            </Link>
          </h3>
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
