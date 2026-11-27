import { notFound } from "next/navigation";
import { InProgress } from "@/components/InProgress";
import { siteConfig } from "@/site.config";

export const metadata = { title: "Photography" };

export default function Page() {
  // Hidden until the original image files are in the repo (photography.enabled in site.config.ts).
  if (!siteConfig.photography.enabled) notFound();
  return <InProgress title="Photography" stage={4} />;
}
