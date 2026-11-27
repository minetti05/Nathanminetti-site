import Link from "next/link";
import { contactItem, getNavItems, siteConfig, type NavItem } from "@/site.config";
import styles from "./chrome.module.css";

function NavList({ items, className }: { items: NavItem[]; className: string }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={styles.navLink}>
            {item.label}
          </Link>
        </li>
      ))}
      <li className={styles.contactItem}>
        <Link href={contactItem.href} className={`btn btn-secondary ${styles.contactBtn}`}>
          {contactItem.label}
        </Link>
      </li>
    </ul>
  );
}

export function SiteHeader() {
  const nav = getNavItems();
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.headerInner}`}>
        <Link href="/" className={styles.wordmark}>
          {siteConfig.name}
        </Link>

        {/*
          A single navigation landmark. Wide screens show the inline list; small screens show
          the same links in a no-JavaScript disclosure. The hidden one is display:none, so
          screen readers and keyboards only ever meet one list.
        */}
        <nav aria-label="Main" className={styles.nav}>
          <NavList items={nav} className={styles.navInline} />
          <details className={styles.menu}>
            <summary className={styles.menuButton}>Menu</summary>
            <NavList items={nav} className={styles.navStacked} />
          </details>
        </nav>
      </div>
    </header>
  );
}
