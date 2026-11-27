import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
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
import a from "./advisory.module.css";

type Challenge = {
  title: string;
  situation: string;
  bring: string;
  produces: string;
  proof?: { work: string; line?: string }[];
};

type Advisory = {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  intro: string;
  pov: string;
  bringHeading: string;
  bring: string[];
  challengesHeading: string;
  labels: { situation: string; bring: string; produces: string; proof: string };
  challenges: Challenge[];
  methodHeading: string;
  steps: Step[];
  firstMonth?: {
    heading: string;
    draft?: boolean;
    note: string;
    outputLabel: string;
    weeks: { label: string; stage: string; what: string; output: string }[];
  };
  engagementsHeading: string;
  engagements: { name: string; what: string; goodFor: string }[];
  goodForLabel: string;
  whoHeading: string;
  who: string;
  cta: { label: string; href: string };
};

const page = getPage<Advisory>("advisory");

export const metadata: Metadata = pageMeta(page.title, page.description);

export default function AdvisoryPage() {
  const L = page.labels;
  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.headline} lead={page.intro} />

      {/* Point of view + what I bring */}
      <section className={`wrap ${s.section} ${a.pov}`} aria-label="Point of view">
        <p className={a.povText}>
          <Text>{page.pov}</Text>
        </p>
        <div className={a.bring}>
          <h2 className={s.label}>{page.bringHeading}</h2>
          <ul className={a.bringList}>
            {page.bring.map((b) => (
              <li key={b}>
                <Text>{b}</Text>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Four client challenges */}
      <section className={`wrap ${s.section}`} aria-labelledby="challenges-heading">
        <header className={s.sectionHead}>
          <h2 id="challenges-heading" className={s.sectionTitle}>
            {page.challengesHeading}
          </h2>
        </header>
        <ol className={a.challenges}>
          {page.challenges.map((c, i) => (
            <li key={c.title} className={i < 2 ? `${a.challenge} ${a.challengeLead}` : a.challenge}>
              <div className={a.challengeHead}>
                <span className={a.num} aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className={a.challengeTitle}>
                  <Text>{c.title}</Text>
                </h3>
              </div>
              <div className={a.challengeBody}>
                <dl className={a.facts}>
                  <div>
                    <dt className={s.label}>{L.situation}</dt>
                    <dd>
                      <Text>{c.situation}</Text>
                    </dd>
                  </div>
                  <div>
                    <dt className={s.label}>{L.bring}</dt>
                    <dd>
                      <Text>{c.bring}</Text>
                    </dd>
                  </div>
                  <div>
                    <dt className={s.label}>{L.produces}</dt>
                    <dd>
                      <Text>{c.produces}</Text>
                    </dd>
                  </div>
                </dl>
                {c.proof && c.proof.length > 0 && (
                  <div className={a.proof}>
                    <p className={s.label}>{L.proof}</p>
                    <ProofList items={c.proof} columns={2} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Method */}
      <section className={`wrap ${s.section}`} aria-labelledby="method-heading">
        <header className={s.sectionHead}>
          <h2 id="method-heading" className={s.sectionTitle}>
            {page.methodHeading}
          </h2>
        </header>
        <Steps steps={page.steps} />
      </section>

      {/* A typical first month (illustrative) */}
      {page.firstMonth && (
        <section className={`wrap ${s.section}`} aria-labelledby="month-heading">
          <header className={s.sectionHead}>
            <h2 id="month-heading" className={s.sectionTitle}>
              {page.firstMonth.heading}
            </h2>
          </header>
          <div className={a.monthNote}>
            <DraftTag show={!!page.firstMonth.draft} />
            <p>
              <Text>{page.firstMonth.note}</Text>
            </p>
          </div>
          <ol className={a.weeks}>
            {page.firstMonth.weeks.map((w) => (
              <li key={w.label} className={a.week}>
                <p className={s.label}>
                  {w.label} · {w.stage}
                </p>
                <p className={a.weekWhat}>
                  <Text>{w.what}</Text>
                </p>
                <p className={s.label}>{page.firstMonth!.outputLabel}</p>
                <p className={a.weekOutput}>
                  <Text>{w.output}</Text>
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Engagement types */}
      <section className={`wrap ${s.section}`} aria-labelledby="engage-heading">
        <header className={s.sectionHead}>
          <h2 id="engage-heading" className={s.sectionTitle}>
            {page.engagementsHeading}
          </h2>
        </header>
        <ul className={a.engagements}>
          {page.engagements.map((e) => (
            <li key={e.name} className={a.engagement}>
              <h3 className={a.engagementName}>
                <Text>{e.name}</Text>
              </h3>
              <p className={a.engagementWhat}>
                <Text>{e.what}</Text>
              </p>
              <p className={s.label}>{page.goodForLabel}</p>
              <p className={a.engagementFor}>
                <Text>{e.goodFor}</Text>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Who I work with */}
      <section className={`wrap ${s.section} ${a.who}`} aria-labelledby="who-heading">
        <h2 id="who-heading" className={s.label}>
          {page.whoHeading}
        </h2>
        <p className={a.whoText}>
          <Text>{page.who}</Text>
        </p>
      </section>

      <ClosingCta label={page.cta.label} href={page.cta.href} />
    </>
  );
}
