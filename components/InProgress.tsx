import Link from "next/link";

/** Temporary page for routes built in later stages. Removed as each page is built. */
export function InProgress({ title, stage }: { title: string; stage: number }) {
  return (
    <section className="wrap" style={{ paddingTop: "clamp(4rem, 2rem + 8vw, 10rem)", minHeight: "50vh" }}>
      <h1 style={{ fontSize: "var(--fs-h1)", fontWeight: 300, lineHeight: 1.05 }}>{title}</h1>
      <p style={{ marginTop: "1.5rem" }}>
        <span className="ph">[This page is built in stage {stage} of the brief]</span>
      </p>
      <p style={{ marginTop: "2rem" }}>
        <Link href="/" className="link">Home</Link>
      </p>
    </section>
  );
}
