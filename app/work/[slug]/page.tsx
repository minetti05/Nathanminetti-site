import { notFound } from "next/navigation";
import { InProgress } from "@/components/InProgress";
import { getAllWork } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return getAllWork().map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getAllWork().find((w) => w.slug === slug);
  if (!c) notFound();
  return <InProgress title={`${c.client}: ${c.project}`} stage={3} />;
}
