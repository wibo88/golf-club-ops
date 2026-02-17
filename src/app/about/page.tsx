import type { Metadata } from 'next';
import { client, PAGE_BY_SLUG_QUERY } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity.image';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import Subscribe from '@/components/Subscribe';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Golf Club Ops exists because nobody else is writing honestly about what it takes to run a golf club in 2026.',
  openGraph: {
    title: 'About — Golf Club Ops',
    description:
      'Golf Club Ops exists because nobody else is writing honestly about what it takes to run a golf club in 2026.',
  },
};

export default async function AboutPage() {
  const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'about' });

  // If no CMS content yet, render the static fallback
  if (!page) {
    return (
      <>
        <section
          className="hero hero--with-bg"
          style={{ backgroundImage: "url('/images/Golf_Club_Operations_2026-29.jpg')" }}
        >
          <div className="hero__overlay"></div>
          <div className="hero__content">
            <h1 className="h1 hero__headline">About Golf Club Ops</h1>
            <p className="hero__sub">
              We exist because nobody else is writing honestly about what it takes to run a golf
              club in 2026.
            </p>
          </div>
        </section>

        <section className="content-section">
          <div className="content-section__grid content-section__grid--with-image">
            <div style={{ paddingRight: 'var(--space-lg)' }}>
              <span
                className="section-label"
                style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}
              >
                Our mission
              </span>
              <div className="content-section__body">
                <p>
                  Golf Club Ops is an independent publication for the people who actually run golf
                  clubs — the general managers, operations managers, and administrators who navigate
                  the daily reality of ageing software, committee politics, and member expectations
                  that somehow include both &ldquo;don&rsquo;t change anything&rdquo; and &ldquo;why
                  isn&rsquo;t this more like my banking app?&rdquo;
                </p>
                <p>
                  We write honest, practical, occasionally pointed analysis of golf club operations,
                  technology, and strategy. No vendor partnerships. No sponsored content. No
                  consultant-speak.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/images/Golf_Club_Operations_2026-9.jpg"
                alt="Golf club scene"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  aspectRatio: '4/3',
                }}
              />
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="content-section__grid content-section__grid--with-image">
            <div>
              <img
                src="/images/minesweeper-tee-sheet.png"
                alt="Minesweeper resemblance to tee sheet"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  aspectRatio: '4/3',
                }}
              />
              <p
                style={{
                  marginTop: 'var(--space-xs)',
                  fontSize: '0.85rem',
                  opacity: 0.7,
                  textAlign: 'center',
                }}
              >
                The resemblance is uncanny.
              </p>
            </div>
            <div style={{ paddingLeft: 'var(--space-lg)' }}>
              <span
                className="section-label"
                style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}
              >
                Our approach
              </span>
              <div className="content-section__body">
                <p>
                  Every article starts with a simple question: &ldquo;Would this actually help
                  someone running a golf club make a better decision?&rdquo;
                </p>
                <p>
                  We time actual processes. We compare real platforms. We talk to real operators. And
                  we write it up in a way that respects your intelligence and your time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Subscribe />
      </>
    );
  }

  // CMS-driven about page
  const heroImageUrl = page.heroImage
    ? urlFor(page.heroImage).width(1600).quality(80).url()
    : null;

  return (
    <>
      {heroImageUrl && (
        <section
          className="hero hero--with-bg"
          style={{ backgroundImage: `url('${heroImageUrl}')` }}
        >
          <div className="hero__overlay"></div>
          <div className="hero__content">
            <h1 className="h1 hero__headline">{page.title}</h1>
          </div>
        </section>
      )}

      <article className="article-body">
        <PortableTextRenderer value={page.body} />
      </article>

      <Subscribe />
    </>
  );
}
