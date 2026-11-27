import type { Metadata } from "next";
import { ClosingCta, PageIntro, Steps, pageStyles as s } from "@/components/PageBlocks";
import { Text } from "@/components/Text";
import { getPage } from "@/lib/content";
import w from "./workshops.module.css";

type Workshops = {
  title: string;
  description: string;
  headline: string;
  subheadline: string;
  intro: string;
  format: { label: string; value: string };
  workshops: { title: string; summary: string; outputs: string[] }[];
  outputsLabel: string;
  processHeading: string;
  steps: string[];
  cta: { label: string; href: string };
};

const page = getPage<Workshops>("workshops");

export const metadata: Metadata = { title: page.title, description: page.description };

export default function WorkshopsPage() {
  const [flagship, ...others] = page.workshops;

  return (
    <>
      <PageIntro title={page.headline} sub={page.subheadline} lead={page.intro} />

      <section className={`wrap ${s.section}`} aria-label="Workshops">
        {/* Flagship: first and largest */}
        {flagship && (
          <article className={w.flagship}>
            <p className={w.format}>
              <span className={s.label}>{page.format.label}</span> <Text>{page.format.value}</Text>
            </p>
            <h2 className={w.flagshipTitle}>
              <Text>{flagship.title}</Text>
            </h2>
            <p className={w.flagshipSummary}>
              <Text>{flagship.summary}</Text>
            </p>
            <div className={w.flagshipOutputs}>
              <p className={s.label}>{page.outputsLabel}</p>
              <ol className={w.outputs}>
                {flagship.outputs.map((o) => (
                  <li key={o}>
                    <Text>{o}</Text>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        )}

        <div className={w.pair}>
          {others.map((ws) => (
            <article key={ws.title} className={w.workshop}>
              <p className={w.format}>
                <span className={s.label}>{page.format.label}</span> <Text>{page.format.value}</Text>
              </p>
              <h2 className={w.workshopTitle}>
                <Text>{ws.title}</Text>
              </h2>
              <p className={w.workshopSummary}>
                <Text>{ws.summary}</Text>
              </p>
              <p className={s.label}>{page.outputsLabel}</p>
              <ol className={w.outputs}>
                {ws.outputs.map((o) => (
                  <li key={o}>
                    <Text>{o}</Text>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className={`wrap ${s.section}`} aria-labelledby="process-heading">
        <header className={s.sectionHead}>
          <h2 id="process-heading" className={s.sectionTitle}>
            {page.processHeading}
          </h2>
        </header>
        <Steps steps={page.steps} />
      </section>

      <ClosingCta label={page.cta.label} href={page.cta.href} />
    </>
  );
}
