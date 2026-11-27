import type { MetadataRoute } from "next";
import { getFeaturedWork, getPhotoProjects } from "@/lib/content";
import { siteConfig } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${siteConfig.url}${p}`;
  const pages = ["", "/advisory", "/workshops", "/work", "/about", "/contact"];
  if (siteConfig.photography.enabled) pages.push("/photography");
  // Brands & Culture is never listed while hidden.
  if (siteConfig.brandsAndCulture.enabled) pages.push("/brands-and-culture");

  return [
    ...pages.map((p) => ({ url: u(p), changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...getFeaturedWork().map((c) => ({ url: u(`/work/${c.slug}`), changeFrequency: "yearly" as const, priority: 0.7 })),
    ...(siteConfig.photography.enabled
      ? getPhotoProjects()
          .filter((p) => p.images.length > 0)
          .map((p) => ({ url: u(`/photography/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.6 }))
      : []),
  ];
}
