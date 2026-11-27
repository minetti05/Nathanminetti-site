import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap" style={{ paddingTop: "clamp(4rem, 2rem + 8vw, 10rem)", minHeight: "50vh" }}>
      <h1 style={{ fontSize: "var(--fs-h1)", fontWeight: 300 }}>Page not found</h1>
      <p style={{ marginTop: "2rem" }}>
        <Link href="/" className="link">Home</Link>
      </p>
    </section>
  );
}
