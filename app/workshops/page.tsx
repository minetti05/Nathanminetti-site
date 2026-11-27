import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { ClosingCta, DraftTag, PageIntro, Steps, pageStyles as s, type Step } from "@/components/PageBlocks";
import { Text } from "@/components/Text";
import { getPage } from "@/lib/content";
import w from "./workshops.module.css";

type Workshop = {
  title: string;
  lines: string[];
  problem: string;
  attend: string;
  method: string;
  deliverables: string[];
  outcome: string;
};

type Workshops = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  intro: string;
  howHeading: string;
  how: { label: string; value: string }[];
  labels: { problem: string; attend: string; method: string; deliverables: string; outcome: string };
  workshops: Workshop[];
  agenda?: {
    heading: string;
    draft?: boolean;
    note: string;
    beforeLabel: string;
    before: string;
    afterLabel: string;
    after: string;
    items: { time: string; title: string; detail?: string }[];
  };
  methodHeading: string;
  steps: Step[];
  cta: { label: string; href: string };
};

const page = getPage<Workshops>("workshops");
const L = page.labels;

export const metadata: Metadata = pageMeta(page.title, page.description);

/** Problem, audience, methodology, deliverables and outcome: the same template for every workshop. */
function WorkshopBody({ ws }: { ws: Workshop }) {
  return (
    <div className={w.body}>
      <dl className={w.details}>
        <div>
          <dt className={s.label}>{L.problem}</dt>
          <dd>
            <Text>{ws.problem}</Text>
          </dd>
        </div>
        <div>
          <dt className={s.label}>{L.attend}</dt>
          <dd>
            <Text>{ws.attend}</Text>
          </dd>
        </div>
        <div>
          <dt className={s.label}>{L.method}</dt>
          <dd>
            <Text>{ws.method}</Text>
          </dd>
        </div>
      </dl>
      <div className={w.deliverables}>
        <h4 className={s.label}>{L.deliverables}</h4>
        <ol className={w.outputs}>
          {ws.deliverables.map((o) => (
            <li key={o}>
              <Text>{o}</Text>
            </li>
          ))}
        </ol>
      </div>
      <div className={w.outcome}>
        <h4 className={s.label}>{L.outcome}</h4>
        <p className={w.outcomeText}>
          <Text>{ws.outcome}</Text>
        </p>
      </div>
    </div>
  );
}

export default function WorkshopsPage() {
  const [flagship, ...others] = page.workshops;

  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.headline} lead={page.intro} />

      {/* How the workshops work */}
      <section className={`wrap ${s.section}`} aria-labelledby="how-heading">
        <header className={s.sectionHead}>
          <h2 id="how-heading" className={s.sectionTitle}>
            {page.howHeading}
          </h2>
        </header>
        <dl className={w.how}>
          {page.how.map((h) => (
            <div key={h.label}>
              <dt className={s.label}>{h.label}</dt>
              <dd>
                <Text>{h.value}</Text>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`wrap ${s.section}`} aria-label="Workshops">
        {/* Flagship: first and largest */}
        {flagship && (
          <article className={w.flagship}>
            <header className={w.flagshipHead}>
              <h3 className={w.flagshipTitle}>
                <Text>{flagship.title}</Text>
              </h3>
              <ul className={w.lines}>
                {flagship.lines.map((l) => (
                  <li key={l}>
                    <Text>{l}</Text>
                  </li>
                ))}
              </ul>
            </header>
            <WorkshopBody ws={flagship} />
          </article>
        )}

        {/* Sample agenda for the flagship (illustrative) */}
        {page.agenda && (
          <section className={w.agenda} aria-labelledby="agenda-heading">
            <header className={w.agendaHead}>
              <h3 id="agenda-heading" className={w.agendaTitle}>
                {page.agenda.heading}
              </h3>
              <DraftTag show={!!page.agenda.draft} />
              <p className={w.agendaNote}>
                <Text>{page.agenda.note}</Text>
              </p>
            </header>
            <div className={w.agendaBody}>
              <p className={w.agendaEdge}>
                <span className={s.label}>{page.agenda.beforeLabel}</span>
                <Text>{page.agenda.before}</Text>
              </p>
              <ol className={w.agendaList}>
                {page.agenda.items.map((it) => (
                  <li key={it.time} className={w.agendaItem}>
                    <span className={w.agendaTime}>{it.time}</span>
                    <span>
                      <span className={w.agendaItemTitle}>
                        <Text>{it.title}</Text>
                      </span>
                      {it.detail && (
                        <span className={w.agendaDetail}>
                          <Text>{it.detail}</Text>
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
              <p className={w.agendaEdge}>
                <span className={s.label}>{page.agenda.afterLabel}</span>
                <Text>{page.agenda.after}</Text>
              </p>
            </div>
          </section>
        )}

        {others.map((ws) => (
          <article key={ws.title} className={w.workshop}>
            <header className={w.workshopHead}>
              <h3 className={w.workshopTitle}>
                <Text>{ws.title}</Text>
              </h3>
              <ul className={w.lines}>
                {ws.lines.map((l) => (
                  <li key={l}>
                    <Text>{l}</Text>
                  </li>
                ))}
              </ul>
            </header>
            <WorkshopBody ws={ws} />
          </article>
        ))}
      </section>

      <section className={`wrap ${s.section}`} aria-labelledby="method-heading">
        <header className={s.sectionHead}>
          <h2 id="method-heading" className={s.sectionTitle}>
            {page.methodHeading}
          </h2>
        </header>
        <Steps steps={page.steps} />
      </section>

      <ClosingCta label={page.cta.label} href={page.cta.href} />
    </>
  );
}
