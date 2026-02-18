import type { Metadata } from 'next';
import { client, PAGE_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity.image';
import PageSectionRenderer from '@/components/PageSectionRenderer';
import Subscribe from '@/components/Subscribe';

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'newsletter' });
  return {
    title: page?.seo?.metaTitle || page?.title || 'Newsletter',
    description:
      page?.seo?.metaDescription ||
      'Subscribe to Golf Club Ops. One email per month with the latest articles, sharpest insights, and the occasional number that will make you rethink your processes.',
    openGraph: {
      title: page?.seo?.metaTitle || 'Newsletter — Golf Club Ops',
      description:
        page?.seo?.metaDescription ||
        'Subscribe to Golf Club Ops. One email per month with the latest articles and sharpest insights.',
    },
  };
}

export default async function NewsletterPage() {
  const [page, settings] = await Promise.all([
    client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'newsletter' }),
    client.fetch(SITE_SETTINGS_QUERY),
  ]);

  // If no CMS content yet, render the static fallback
  if (!page) {
    return (
      <>
        {/* Hero */}
        <section
          className="hero hero--with-bg"
          style={{ backgroundImage: "url('/images/Golf_Club_Operations_2026-32.jpg')" }}
        >
          <div className="hero__overlay"></div>
          <div className="hero__content">
            <h1 className="h1 hero__headline">Stay in the loop.</h1>
            <p className="hero__sub">
              One email per month. The latest articles, the sharpest insights, and the occasional
              number that will make you look at your own processes differently.
            </p>
          </div>
        </section>

        {/* Newsletter Signup */}
        <Subscribe />

        {/* What You Get */}
        <section className="content-section">
          <div className="content-section__grid content-section__grid--with-image">
            <div style={{ paddingRight: 'var(--space-lg)' }}>
              <span
                className="section-label"
                style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}
              >
                What you get
              </span>
              <div className="content-section__body">
                <p>
                  Every month, we send one email. It includes our latest articles, a curated link or
                  two from elsewhere in the industry, and occasionally a number that will make you
                  look at your own club&rsquo;s operations differently.
                </p>
                <p>
                  No spam. No sales pitches. No &ldquo;exclusive webinar invitations.&rdquo; Just
                  useful content for people who run golf clubs.
                </p>
                <p>Unsubscribe whenever you like. We&rsquo;re not going to make it weird.</p>
              </div>
            </div>
            <div>
              <img
                src="/images/Golf_Club_Operations_2026-11.jpg"
                alt="Golf club newsletter"
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
      </>
    );
  }

  // CMS-driven page
  const heroImageUrl = page.heroImage
    ? urlFor(page.heroImage).width(1600).quality(80).url()
    : page.heroImagePath || null;

  return (
    <>
      {/* Hero */}
      {(heroImageUrl || page.heroHeadline) && (
        <section
          className="hero hero--with-bg"
          style={heroImageUrl ? { backgroundImage: `url('${heroImageUrl}')` } : undefined}
        >
          <div className="hero__overlay"></div>
          <div className="hero__content">
            {page.heroHeadline && (
              <h1 className="h1 hero__headline">{page.heroHeadline}</h1>
            )}
            {page.heroSubtitle && (
              <p className="hero__sub">{page.heroSubtitle}</p>
            )}
          </div>
        </section>
      )}

      {/* Sections */}
      <PageSectionRenderer
        sections={page.sections}
        formspreeId={settings?.formspreeId}
      />

      {/* Bottom Subscribe (only if not already in sections) */}
      {page.showSubscribe && !page.sections?.some((s: any) => s._type === 'subscribeSection') && (
        <Subscribe formspreeId={settings?.formspreeId} />
      )}
    </>
  );
}
