import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

/** Title + description for a page, repeated into its Open Graph and Twitter cards. */
export function pageMeta(title: string, description: string, opts: { absolute?: boolean } = {}): Metadata {
  const full = opts.absolute ? title : `${title} · ${siteConfig.name}`;
  return {
    title: opts.absolute ? { absolute: title } : title,
    description,
    // A page that sets its own openGraph replaces the site's, so the share image is restated here.
    openGraph: {
      title: full,
      description,
      url: "./",
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name}` }],
    },
    twitter: { card: "summary_large_image", title: full, description, images: ["/twitter-image"] },
  };
}
