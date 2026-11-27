import Link from "next/link";
import { contactItem, getNavItems, siteConfig } from "@/site.config";
import styles from "./chrome.module.css";

export function SiteFooter() {
  const nav = [...getNavItems(), contactItem];
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.footerGrid}`}>
        <p className={styles.footerMark}>{siteConfig.name}</p>

        <div>
          <h2 className={styles.footerLabel}>Pages</h2>
          <ul className={styles.footerList}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={styles.footerLabel}>Contact</h2>
          <ul className={styles.footerList}>
            <li>
              <a href={`mailto:${siteConfig.email}`} className={styles.footerLink}>
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.linkedin} className={styles.footerLink} rel="me">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={`wrap ${styles.footerBase}`}>
        <p>
          © {year} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
