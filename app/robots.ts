import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.launch.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
