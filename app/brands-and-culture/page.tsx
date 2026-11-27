import { notFound } from "next/navigation";
import { InProgress } from "@/components/InProgress";
import { siteConfig } from "@/site.config";

export const metadata = { title: "Brands & Culture", robots: { index: false, follow: false } };

export default function Page() {
  // Hidden at launch: returns 404 until brandsAndCulture.enabled is true in site.config.ts
  if (!siteConfig.brandsAndCulture.enabled) notFound();
  return <InProgress title="Brands & Culture" stage={4} />;
}
