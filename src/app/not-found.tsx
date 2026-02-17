import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="content-section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1 className="h1" style={{ marginBottom: 'var(--space-md)' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)', maxWidth: '500px' }}>
        This page has gone the way of the fax machine in the pro shop. It doesn&rsquo;t exist
        anymore (or maybe it never did).
      </p>
      <Link href="/" className="hero__cta">
        Back to the clubhouse <span>&rarr;</span>
      </Link>
    </section>
  );
}
