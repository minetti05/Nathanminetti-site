import { notFound } from "next/navigation";
import { InProgress } from "@/components/InProgress";
import { getPhotoProjects } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;
export function generateStaticParams() {
  if (!siteConfig.photography.enabled) return [{ project: "_" }];
  return getPhotoProjects().map((p) => ({ project: p.slug }));
}

export default async function Page({ params }: { params: Promise<{ project: string }> }) {
  if (!siteConfig.photography.enabled) notFound();
  const { project } = await params;
  const p = getPhotoProjects().find((x) => x.slug === project);
  if (!p) notFound();
  return <InProgress title={p.title} stage={4} />;
}
