import { notFound } from "next/navigation";
import { InProgress } from "@/components/InProgress";
import { getPhotoProjects } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return getPhotoProjects().map((p) => ({ project: p.slug }));
}

export default async function Page({ params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const p = getPhotoProjects().find((x) => x.slug === project);
  if (!p) notFound();
  return <InProgress title={p.title} stage={4} />;
}
