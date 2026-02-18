import type { Metadata } from 'next';
import Link from 'next/link';
import { client, ARTICLES_QUERY, SITE_SETTINGS_QUERY, PAGE_BY_SLUG_QUERY } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity.image';
import ArticleCard from '@/components/ArticleCard';
import PageSectionRenderer from '@/components/PageSectionRenderer';
import Subscribe from '@/components/Subscribe';

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'home' });
  return {
    title: page?.seo?.metaTitle || 'Golf Club Ops — The No-BS Guide to Running a Modern Golf Club',
    description:
      page?.seo?.metaDescription ||
      'Practical intelligence for the next generation of golf club operators.',
    openGraph: {
      title: page?.seo?.metaTitle || 'Golf Club Ops — The No-BS Guide to Running a Modern Golf Club',
      description:
        page?.seo?.metaDescription ||
        'Practical intelligence for the next generation of golf club operators.',
    },
  };
}

async function getData() {
  const [articles, settings, page] = await Promise.all([
    client.fetch(ARTICLES_QUERY),
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'home' }),
  ]);
  return { articles, settings, page };
}

export default async function HomePage() {
  const { articles, settings, page } = await getData();

  // If CMS page document exists, render CMS-driven layout
  if (page) {
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
              {page.heroCtaText && page.heroCtaLink && (
                <Link href={page.heroCtaLink} className="hero__cta">
                  {page.heroCtaText} <span>&rarr;</span>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* CMS Sections */}
        <PageSectionRenderer
          sections={page.sections}
          formspreeId={settings?.formspreeId}
          articles={articles}
        />

        {/* Bottom Subscribe (only if not already in sections) */}
        {page.showSubscribe &&
          !page.sections?.some((s: any) => s._type === 'subscribeSection') && (
            <Subscribe formspreeId={settings?.formspreeId} />
          )}
      </>
    );
  }

  // ── Static fallback (no CMS document yet) ──────────────────

  const featuredArticle = articles?.find((a: any) => a.featured);
  const secondaryArticles = articles
    ?.filter((a: any) => !a.featured)
    .slice(0, 3);

  const familiarStatements = settings?.familiarStatements || [
    "You've processed a visitor booking using a combination of email, phone, a PDF, and a prayer.",
    "You've watched a new hire try to navigate your tee sheet without a 45-minute tutorial.",
    "Your banking app knows you better than your club's member portal knows your members.",
    "You've tried explaining to a committee why 'it works fine' isn't a technology strategy.",
  ];

  return (
    <>
      {/* Hero */}
      <section
        className="hero hero--with-bg"
        style={{ backgroundImage: "url('/images/Golf_Club_Operations_2026-1.jpg')" }}
      >
        <div className="hero__overlay"></div>
        <div className="hero__content">
          <h1 className="h1 hero__headline">
            The no-BS guide to running a modern golf club.
          </h1>
          <p className="hero__sub">
            Practical intelligence for the next generation of golf club operators. Because your
            software shouldn&rsquo;t require a training webinar longer than your back nine.
          </p>
          <Link href="/articles" className="hero__cta">
            Read the latest <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* What This Is */}
      <section className="content-section">
        <div className="content-section__grid content-section__grid--with-image">
          <div style={{ paddingRight: 'var(--space-lg)' }}>
            <span className="section-label" style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}>
              What This Is
            </span>
            <div className="content-section__body">
              <p>
                You manage a multi-million dollar operation with software that looks like it was
                designed during the dial-up era. Your members expect Uber-level convenience, your
                committee expects 1970s-level costs, and your tee sheet expects you to attend a
                47-minute certification webinar before you&rsquo;re allowed to make a booking.
              </p>
              <p>
                We get it. Golf Club Ops exists because nobody else is writing honestly about what
                it takes to run a golf club in 2026 — the operational reality, the technology
                landscape, and the gap between what&rsquo;s available and what&rsquo;s actually good.
              </p>
              <p>
                No vendor spin. No consultant jargon. Just specific, practical, occasionally amusing
                insight from people who&rsquo;ve spent more time inside clubhouses than is probably
                healthy.
              </p>
            </div>
          </div>
          <div>
            <img
              src="/images/Golf_Club_Operations_2026-2.jpg"
              alt="Golf club operations scene"
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', aspectRatio: '4/3' }}
            />
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="content-section">
        <h2 className="h3" style={{ marginBottom: 'var(--space-lg)' }}>
          What We Cover
        </h2>
        <div className="pillars">
          <div className="pillar">
            <span className="pillar__icon"><i className="fa-solid fa-gears"></i></span>
            <h3 className="pillar__name">Operations &amp; Workflows</h3>
            <p className="pillar__desc">Time audits, process comparisons, and the hidden costs nobody talks about.</p>
          </div>
          <div className="pillar">
            <span className="pillar__icon"><i className="fa-solid fa-laptop-code"></i></span>
            <h3 className="pillar__name">Technology &amp; Software</h3>
            <p className="pillar__desc">Honest assessments of golf club tech. The buying guide that doesn&rsquo;t exist yet.</p>
          </div>
          <div className="pillar">
            <span className="pillar__icon"><i className="fa-solid fa-globe"></i></span>
            <h3 className="pillar__name">Visitor &amp; Revenue Strategy</h3>
            <p className="pillar__desc">Maximising visitor revenue without making members feel like an afterthought.</p>
          </div>
          <div className="pillar">
            <span className="pillar__icon"><i className="fa-solid fa-chart-line"></i></span>
            <h3 className="pillar__name">Membership &amp; Retention</h3>
            <p className="pillar__desc">Waitlists, churn, generational shifts, and the economics of belonging.</p>
          </div>
          <div className="pillar">
            <span className="pillar__icon"><i className="fa-solid fa-landmark"></i></span>
            <h3 className="pillar__name">Leadership &amp; Governance</h3>
            <p className="pillar__desc">Committee dynamics, vendor selection, and the art of pitching change.</p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="content-section">
        <h2 className="h3" style={{ marginBottom: 'var(--space-lg)' }}>
          Featured Articles
        </h2>

        {featuredArticle && (
          <div className="articles-grid articles-grid--featured">
            <ArticleCard
              title={featuredArticle.title}
              slug={featuredArticle.slug.current}
              excerpt={featuredArticle.excerpt}
              category={featuredArticle.category}
              readTime={featuredArticle.readTime}
              heroImage={featuredArticle.heroImage}
              heroImagePath={featuredArticle.heroImagePath}
              featured
            />
          </div>
        )}

        {secondaryArticles && secondaryArticles.length > 0 && (
          <div className="articles-grid articles-grid--small">
            {secondaryArticles.map((article: any) => (
              <ArticleCard
                key={article._id}
                title={article.title}
                slug={article.slug.current}
                category={article.category}
                readTime={article.readTime}
                heroImage={article.heroImage}
                heroImagePath={article.heroImagePath}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Link href="/articles" className="view-all-btn">
            View all articles
          </Link>
        </div>
      </section>

      {/* If This Sounds Familiar */}
      <section className="familiar">
        <div className="container">
          <h2 className="h3">If any of this sounds familiar...</h2>
          <div className="familiar__statements">
            {familiarStatements.map((statement: string, i: number) => (
              <div key={i} className="familiar__statement">
                &ldquo;{statement}&rdquo;
              </div>
            ))}
          </div>
          <p className="familiar__closing">Then you&rsquo;re in the right place.</p>
        </div>
      </section>

      {/* Newsletter Signup */}
      <Subscribe formspreeId={settings?.formspreeId} />
    </>
  );
}
