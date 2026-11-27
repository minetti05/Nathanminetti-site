import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CaseMedia } from "@/components/CaseMedia";
import { Text } from "@/components/Text";
import { caseImage, getFeaturedWork, getPage, getPhotoProjects, type CaseStudy } from "@/lib/content";
import { siteConfig } from "@/site.config";
import styles from "./home.module.css";

type Cta = { label: string; href: string };
type HomeContent = {
  title: string;
  description: string;
  hero: { headline: string; copy: string; primaryCta: Cta; secondaryCta: Cta };
  whatIDo: {
    heading: string;
    items: { title: string; line: string; href: string; requires?: "brandsAndCulture" }[];
  };
  selectedWork: { heading: string; linkLabel: string };
  recognition: { heading: string; items: string[] };
  photography: { heading: string; linkLabel: string };
  closing: { headline: string; cta: Cta };
};

const home = getPage<HomeContent>("home");

export const metadata: Metadata = {
  title: { absolute: home.title },
  description: home.description,
};

function WorkEntry({ c, lead = false }: { c: CaseStudy; lead?: boolean }) {
  const img = caseImage(c);
  return (
    <article className={lead ? styles.workLead : styles.workItem}>
      <Link href={`/work/${c.slug}`} className={styles.workLink}>
        <div className={styles.workMedia}>
          <CaseMedia src={img?.src ?? null} alt={img?.alt ?? ""} client={c.client} priority={lead} />
        </div>
        <div className={styles.workText}>
          <p className={styles.workClient}>
            <Text>{c.client}</Text>
            <span aria-hidden="true"> · </span>
            <Text>{c.project}</Text>
          </p>
          <h3 className={styles.workTitle}>
            <Text>{c.title}</Text>
          </h3>
          <p className={styles.workDek}>
            <Text>{c.dek}</Text>
          </p>
          <p className={styles.workMeta}>
            <Text>{c.year}</Text>
            <span aria-hidden="true"> · </span>
            <Text>{c.agency}</Text>
          </p>
          <p className={styles.workRole}>
            <Text>{c.role}</Text>
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function HomePage() {
  const { hero, whatIDo, selectedWork, recognition, photography, closing } = home;

  const services = whatIDo.items.filter(
    (item) => !item.requires || siteConfig[item.requires].enabled,
  );
  const [leadCase, ...otherCases] = getFeaturedWork().slice(0, 6);
  const projects = getPhotoProjects();
  const leadProject = projects.find((p) => p.homepageLead) ?? projects[0];
  const otherProjects = projects.filter((p) => p !== leadProject);
  const leadImage = leadProject?.images[0];

  return (
    <>
      {/* Hero */}
      <section className={`wrap ${styles.hero}`} aria-labelledby="hero-heading">
        <h1 id="hero-heading" className={styles.heroHeadline}>
          <Text>{hero.headline}</Text>
        </h1>
        <div className={styles.heroBody}>
          <p className={styles.heroCopy}>
            <Text>{hero.copy}</Text>
          </p>
          <div className={styles.ctas}>
            <Link href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label}
            </Link>
            <Link href={hero.secondaryCta.href} className="btn btn-secondary">
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* What I Do */}
      <section className={`wrap ${styles.section}`} aria-labelledby="what-heading">
        <header className={styles.sectionHead}>
          <h2 id="what-heading" className={styles.sectionTitle}>
            {whatIDo.heading}
          </h2>
        </header>
        <ul className={styles.services}>
          {services.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className={styles.service}>
                <h3 className={styles.serviceTitle}>
                  <Text>{s.title}</Text>
                </h3>
                <p className={styles.serviceLine}>
                  <Text>{s.line}</Text>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Selected Work */}
      <section className={`wrap ${styles.section}`} aria-labelledby="work-heading">
        <header className={styles.sectionHead}>
          <h2 id="work-heading" className={styles.sectionTitle}>
            {selectedWork.heading}
          </h2>
          <Link href="/work" className={`link ${styles.sectionLink}`}>
            {selectedWork.linkLabel}
          </Link>
        </header>
        {leadCase && <WorkEntry c={leadCase} lead />}
        <div className={styles.workGrid}>
          {otherCases.map((c) => (
            <WorkEntry key={c.slug} c={c} />
          ))}
        </div>
      </section>

      {/* Recognition */}
      <section className={styles.recognition} aria-labelledby="recognition-heading">
        <div className={`wrap ${styles.recognitionInner}`}>
          <h2 id="recognition-heading" className={styles.recognitionLabel}>
            {recognition.heading}
          </h2>
          <ul className={styles.awards}>
            {recognition.items.map((a) => (
              <li key={a}>
                <Text>{a}</Text>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Photography */}
      {leadProject && (
        <section className={`wrap ${styles.section}`} aria-labelledby="photo-heading">
          <header className={styles.sectionHead}>
            <h2 id="photo-heading" className={styles.sectionTitle}>
              {photography.heading}
            </h2>
            <Link href="/photography" className={`link ${styles.sectionLink}`}>
              {photography.linkLabel}
            </Link>
          </header>
          <div className={styles.photo}>
            <Link href={`/photography/${leadProject.slug}`} className={styles.photoLead}>
              {leadImage?.src && leadImage.width && leadImage.height ? (
                // Shown at its original aspect ratio: never cropped.
                <Image
                  src={leadImage.src}
                  alt={leadImage.alt}
                  width={leadImage.width}
                  height={leadImage.height}
                  sizes="(min-width: 62rem) 66vw, 100vw"
                  className={styles.photoImg}
                />
              ) : (
                <div className={styles.photoEmpty}>
                  <span className={styles.photoEmptyTitle} aria-hidden="true">
                    {leadProject.title}
                  </span>
                  <span className="ph">[Photographs needed: original files for this project]</span>
                </div>
              )}
              <h3 className={styles.photoTitle}>{leadProject.title}</h3>
            </Link>
            <ol className={styles.photoIndex}>
              {otherProjects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/photography/${p.slug}`} className={styles.photoIndexLink}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Closing */}
      <section className={`wrap ${styles.closing}`} aria-labelledby="closing-heading">
        <h2 id="closing-heading" className={styles.closingHeadline}>
          <Text>{closing.headline}</Text>
        </h2>
        <Link href={closing.cta.href} className={`btn btn-primary ${styles.closingBtn}`}>
          {closing.cta.label}
        </Link>
      </section>
    </>
  );
}
