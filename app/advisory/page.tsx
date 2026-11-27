import type { Metadata } from "next";
import {
  ClosingCta,
  DraftTag,
  PageIntro,
  ProofList,
  Steps,
  pageStyles as s,
  type Step,
} from "@/components/PageBlocks";
import { Text } from "@/components/Text";
import { getPage } from "@/lib/content";

type Advisory = {
  title: string;
  description: string;
  headline: string;
  subheadline: string;
  intro: string;
  introDraft?: boolean;
  pillars: { title: string; draft?: boolean; problem?: string; items: string[]; work?: string[] }[];
  whoHeading: string;
  who: string[];
  approachHeading: string;
  steps: Step[];
  stepsDraft?: boolean;
  approachNote: string;
  cta: { label: string; href: string };
};

const page = getPage<Advisory>("advisory");

export const metadata: Metadata = { title: page.title, description: page.description };

export default function AdvisoryPage() {
  return (
    <>
      <PageIntro title={page.headline} sub={page.subheadline} lead={page.intro} leadDraft={page.introDraft} />

      <section className={`wrap ${s.section}`} aria-label="Areas of advisory">
        <ul className={s.rows}>
          {page.pillars.map((p) => (
            <li key={p.title} className={s.row}>
              <div className={s.rowTitle}>
                <h2>
                  <Text>{p.title}</Text>
                </h2>
                <DraftTag show={!!p.draft} />
              </div>
              <div className={s.rowMain}>
                {p.problem && (
                  <p className={s.problem}>
                    <Text>{p.problem}</Text>
                  </p>
                )}
                <ul className={s.rowList}>
                  {p.items.map((item) => (
                    <li key={item}>
                      <Text>{item}</Text>
                    </li>
                  ))}
                </ul>
              </div>
              {p.work && p.work.length > 0 && (
                <div className={s.rowAside}>
                  <p className={s.label}>Related work</p>
                  <ProofList slugs={p.work} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className={`wrap ${s.section}`} aria-labelledby="who-heading">
        <header className={s.sectionHead}>
          <h2 id="who-heading" className={s.sectionTitle}>
            {page.whoHeading}
          </h2>
        </header>
        <ul className={s.cloud}>
          {page.who.map((w) => (
            <li key={w}>
              <Text>{w}</Text>
            </li>
          ))}
        </ul>
      </section>

      <section className={`wrap ${s.section}`} aria-labelledby="approach-heading">
        <header className={s.sectionHead}>
          <h2 id="approach-heading" className={s.sectionTitle}>
            {page.approachHeading}
          </h2>
        </header>
        <Steps steps={page.steps} note={page.approachNote} draft={page.stepsDraft} />
      </section>

      <ClosingCta label={page.cta.label} href={page.cta.href} />
    </>
  );
}
