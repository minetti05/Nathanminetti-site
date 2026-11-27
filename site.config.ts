/**
 * Site-wide settings. This is the one file to change when you switch a feature on or off.
 * Page copy does not live here: it lives in /content.
 */
export const siteConfig = {
  name: "Nathan Minetti",
  url: "https://nathanminetti.com",
  email: "nathanminetti@gmail.com",
  linkedin: "https://www.linkedin.com/in/nathanminetti",

  /**
   * Brands & Culture is built but hidden at launch.
   * false → removed from the nav, homepage, footer and sitemap; the page returns 404.
   * true  → appears everywhere automatically.
   */
  brandsAndCulture: {
    enabled: false,
  },

  /**
   * Photography: off until the original image files are in /public/images/photography.
   * false → removed from the nav, homepage and footer; the pages return 404.
   * true  → appears everywhere. Only projects that have images listed are shown.
   */
  photography: {
    enabled: false,
  },
} as const;

export type NavItem = { label: string; href: string };

/** Main navigation, in order. Contact is rendered separately as a button. */
export function getNavItems(): NavItem[] {
  const items: NavItem[] = [
    { label: "Advisory", href: "/advisory" },
    { label: "Workshops", href: "/workshops" },
    { label: "Selected Work", href: "/work" },
    ...(siteConfig.photography.enabled ? [{ label: "Photography", href: "/photography" }] : []),
    { label: "About", href: "/about" },
  ];
  if (siteConfig.brandsAndCulture.enabled) {
    items.push({ label: "Brands & Culture", href: "/brands-and-culture" });
  }
  return items;
}

export const contactItem: NavItem = { label: "Contact", href: "/contact" };
