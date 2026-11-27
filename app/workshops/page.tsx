import type { Metadata } from "next";
import { ClosingCta, DraftTag, PageIntro, Steps, pageStyles as s, type Step } from "@/components/PageBlocks";
import { Text } from "@/components/Text";
import { getPage } from "@/lib/content";
import w from "./workshops.module.css";

type Workshop = {
  title: string;
  summary: string;
  format: string;
  draft?: boolean;
  problem?: string;
  attend?: string;
  session?: string;
  outputs: string[];
};

type Workshops = {
  title: string;
  description: string;
  headline: string;
  subheadline: string;
  intro: string;
  labels: { format: string; problem: string; attend: string; session: string; outputs: string };
  workshops: Workshop[];
  processHeading: string;
  steps: Step[];
  stepsDraft?: boolean;
  cta: { label: string; href: string };
};

const page = getPage<Workshops>("workshops");
const L = page.labels;

export const metadata: Metadata = { title: page.title, description: page.description };

function Details({ ws }: { ws: Workshop }) {
  const rows = [
    [L.problem, ws.problem],
    [L.attend, ws.attend],
    [L.session, ws.session],
  ].filter(([, v]) => v) as [string, string][];
  if (rows.length === 0) return null;
  return (
    <dl className={w.details}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className={s.label}>{label}</dt>
          <dd>
            <Text>{value}</Text>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Outputs({ ws }: { ws: Workshop }) {
  return (
    <div className={w.outputsBlock}>
      <h3 className={s.label}>{L.outputs}</h3>
      <ol className={w.outputs}>
        {ws.outputs.map((o) => (
          <li key={o}>
            <Text>{o}</Text>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Meta({ ws }: { ws: Workshop }) {
  return (
    <p className={w.format}>
      <span className={s.label}>{L.format}</span> <Text>{ws.format}</Text>
      <DraftTag show={!!ws.draft} />
    </p>
  );
}

export default function WorkshopsPage() {
  const [flagship, ...others] = page.workshops;

  return (
    <>
      <PageIntro title={page.headline} sub={page.subheadline} lead={page.intro} />

      <section className={`wrap ${s.section}`} aria-label="Workshops">
        {/* Flagship: first and largest */}
        {flagship && (
          <article className={w.flagship}>
            <div className={w.flagshipMain}>
              <Meta ws={flagship} />
              <h2 className={w.flagshipTitle}>
                <Text>{flagship.title}</Text>
              </h2>
              <p className={w.flagshipSummary}>
                <Text>{flagship.summary}</Text>
              </p>
              <Details ws={flagship} />
            </div>
            <div className={w.flagshipAside}>
              <Outputs ws={flagship} />
            </div>
          </article>
        )}

        <div className={w.pair}>
          {others.map((ws) => (
            <article key={ws.title} className={w.workshop}>
              <Meta ws={ws} />
              <h2 className={w.workshopTitle}>
                <Text>{ws.title}</Text>
              </h2>
              <p className={w.workshopSummary}>
                <Text>{ws.summary}</Text>
              </p>
              <Details ws={ws} />
              <Outputs ws={ws} />
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
        <Steps steps={page.steps} draft={page.stepsDraft} />
      </section>

      <ClosingCta label={page.cta.label} href={page.cta.href} />
    </>
  );
}
