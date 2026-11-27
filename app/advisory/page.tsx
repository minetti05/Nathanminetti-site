import type { Metadata } from "next";
import { ClosingCta, PageIntro, ProofList, Steps, pageStyles as s } from "@/components/PageBlocks";
import { Text } from "@/components/Text";
import { getPage } from "@/lib/content";

type Advisory = {
  title: string;
  description: string;
  headline: string;
  subheadline: string;
  intro: string;
  pillars: { title: string; items: string[]; work?: string[] }[];
  whoHeading: string;
  who: string[];
  approachHeading: string;
  steps: string[];
  approachNote: string;
  cta: { label: string; href: string };
};

const page = getPage<Advisory>("advisory");

export const metadata: Metadata = { title: page.title, description: page.description };

export default function AdvisoryPage() {
  return (
    <>
      <PageIntro title={page.headline} sub={page.subheadline} lead={page.intro} />

      <section className={`wrap ${s.section}`} aria-label="Areas of advisory">
        <ul className={s.rows}>
          {page.pillars.map((p) => (
            <li key={p.title} className={s.row}>
              <h2 className={s.rowTitle}>
                <Text>{p.title}</Text>
              </h2>
              <ul className={s.rowList}>
                {p.items.map((item) => (
                  <li key={item}>
                    <Text>{item}</Text>
                  </li>
                ))}
              </ul>
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
        <Steps steps={page.steps} note={page.approachNote} />
      </section>

      <ClosingCta label={page.cta.label} href={page.cta.href} />
    </>
  );
}
