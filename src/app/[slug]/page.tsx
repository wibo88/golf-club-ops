import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client, ARTICLE_BY_SLUG_QUERY, ARTICLE_SLUGS_QUERY } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity.image';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import ArticleCard from '@/components/ArticleCard';
import Subscribe from '@/components/Subscribe';

interface PageProps {
  params: { slug: string };
}

// Generate static paths for all articles at build time
export async function generateStaticParams() {
  const slugs = await client.fetch(ARTICLE_SLUGS_QUERY);
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }));
}

// Generate metadata for each article
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug: params.slug });
  if (!article) return {};

  const ogImage = article.heroImage
    ? urlFor(article.heroImage).width(1200).height(630).url()
    : article.heroImagePath
      ? `https://www.golfclubops.com${article.heroImagePath}`
      : undefined;

  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.excerpt,
    openGraph: {
      title: `${article.title} — Golf Club Ops`,
      description: article.excerpt,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: article.seo?.canonicalUrl || `https://www.golfclubops.com/${params.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug: params.slug });

  if (!article) {
    notFound();
  }

  const heroImageUrl = article.heroImage
    ? urlFor(article.heroImage).width(1600).quality(80).url()
    : article.heroImagePath || null;

  const publishDate = article.publishDate
    ? new Date(article.publishDate).toLocaleDateString('en-AU', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <>
      {/* Article Header */}
      <header className="article-header">
        <h1 className="article-header__title">{article.title}</h1>
        {article.subtitle && (
          <p className="article-header__subtitle">{article.subtitle}</p>
        )}
        <p className="article-header__meta">
          {article.category?.name && <>{article.category.name}</>}
          {article.category?.name && article.readTime && <span> · </span>}
          {article.readTime && <>{article.readTime}</>}
          {(article.category?.name || article.readTime) && publishDate && <span> · </span>}
          {publishDate && <>{publishDate}</>}
        </p>
      </header>

      {/* Hero Image */}
      {heroImageUrl && (
        <div style={{ maxWidth: 'var(--max-reading)', margin: '0 auto', padding: '0 var(--space-md)' }}>
          <img
            src={heroImageUrl}
            alt={article.heroImage?.alt || article.title}
            style={{
              width: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
              aspectRatio: '16/9',
            }}
          />
        </div>
      )}

      {/* Article Body */}
      <article className="article-body">
        <PortableTextRenderer value={article.body} />
      </article>

      {/* Related Articles */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <section className="content-section">
          <h2 className="h3" style={{ marginBottom: 'var(--space-lg)' }}>
            More stories
          </h2>
          <div className="articles-grid articles-grid--small">
            {article.relatedArticles.map((related: any) => (
              <ArticleCard
                key={related._id}
                title={related.title}
                slug={related.slug.current}
                category={related.category}
                readTime={related.readTime}
                heroImage={related.heroImage}
                heroImagePath={related.heroImagePath}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <Subscribe />
    </>
  );
}
