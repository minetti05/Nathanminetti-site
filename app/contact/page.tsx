import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm, type FormCopy } from "@/components/ContactForm";
import { Text } from "@/components/Text";
import { getPage } from "@/lib/content";
import { siteConfig } from "@/site.config";
import c from "./contact.module.css";

type Contact = {
  title: string;
  description: string;
  headline: string;
  copy: string;
  form: FormCopy;
  inquiryTypes: string[];
  workshopOptions: string[];
  alternativesHeading: string;
};

const page = getPage<Contact>("contact");

export const metadata: Metadata = { title: page.title, description: page.description };

export default function ContactPage() {
  return (
    <section className={`wrap ${c.contact}`}>
      <header className={c.head}>
        <h1 className={c.title}>
          <Text>{page.headline}</Text>
        </h1>
        <p className={c.copy}>
          <Text>{page.copy}</Text>
        </p>

        <div className={c.alt}>
          <h2 className={c.altHeading}>{page.alternativesHeading}</h2>
          <ul className={c.altList}>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="link">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.linkedin} className="link" rel="me">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </header>

      <div className={c.formCol}>
        <Suspense fallback={null}>
          <ContactForm copy={page.form} inquiryTypes={page.inquiryTypes} workshopOptions={page.workshopOptions} />
        </Suspense>
      </div>
    </section>
  );
}
