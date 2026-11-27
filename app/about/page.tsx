import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { ClosingCta, pageStyles as s } from "@/components/PageBlocks";
import { Photo } from "@/components/Photo";
import { Text } from "@/components/Text";
import { getPage } from "@/lib/content";
import { imageSize } from "image-size";
import fs from "node:fs";
import path from "node:path";
import a from "./about.module.css";

type Role = { years: string; title: string; company: string; clients?: string };
type About = {
  title: string;
  description: string;
  headline: string;
  intro: string[];
  portrait?: { src: string; alt: string };
  timelineHeading: string;
  timeline: Role[];
  earlier?: { years: string; text: string };
  clientsLabel: string;
  cta: { label: string; href: string };
};

const page = getPage<About>("about");

export const metadata: Metadata = pageMeta(page.title, page.description);

/** Reads the portrait's real size so it is shown at its own proportions. */
function portraitSize(src: string) {
  const file = path.join(process.cwd(), "public", src);
  if (!fs.existsSync(file)) return null;
  const { width, height } = imageSize(fs.readFileSync(file));
  return width && height ? { width, height } : null;
}

export default function AboutPage() {
  const size = page.portrait ? portraitSize(page.portrait.src) : null;
  const [first, ...rest] = page.intro;

  return (
    <>
      <header className={`wrap ${a.head}`}>
        <h1 className={a.title}>
          <Text>{page.headline}</Text>
        </h1>
      </header>

      <section className={`wrap ${a.bio}`} aria-label="Biography">
        {page.portrait && size && (
          <div className={a.portrait}>
            <Photo
              src={page.portrait.src}
              alt={page.portrait.alt}
              width={size.width}
              height={size.height}
              sizes="(min-width: 62rem) 38vw, 100vw"
              className={a.portraitImg}
              priority
            />
          </div>
        )}
        <div className={a.bioText}>
          {first && (
            <p className={a.bioLead}>
              <Text>{first}</Text>
            </p>
          )}
          {rest.map((para) => (
            <p key={para} className={a.bioPara}>
              <Text>{para}</Text>
            </p>
          ))}
        </div>
      </section>

      <section className={`wrap ${s.section}`} aria-labelledby="experience-heading">
        <header className={s.sectionHead}>
          <h2 id="experience-heading" className={s.sectionTitle}>
            {page.timelineHeading}
          </h2>
        </header>
        <ol className={a.timeline}>
          {page.timeline.map((r) => (
            <li key={`${r.company}-${r.years}`} className={a.role}>
              <p className={a.years}>{r.years}</p>
              <div className={a.roleMain}>
                <h3 className={a.company}>
                  <Text>{r.company}</Text>
                </h3>
                <p className={a.roleTitle}>
                  <Text>{r.title}</Text>
                </p>
              </div>
              {r.clients && (
                <p className={a.clients}>
                  <span className={s.label}>{page.clientsLabel}</span>
                  <Text>{r.clients}</Text>
                </p>
              )}
            </li>
          ))}
          {page.earlier && (
            <li className={`${a.role} ${a.earlier}`}>
              <p className={a.years}>{page.earlier.years}</p>
              <p className={a.earlierText}>
                <Text>{page.earlier.text}</Text>
              </p>
            </li>
          )}
        </ol>
      </section>

      <ClosingCta label={page.cta.label} href={page.cta.href} />
    </>
  );
}
