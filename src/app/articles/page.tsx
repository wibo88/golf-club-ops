import type { Metadata } from 'next';
import { client, ARTICLES_QUERY } from '@/lib/sanity';
import ArticleCard from '@/components/ArticleCard';
import Subscribe from '@/components/Subscribe';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'All articles from Golf Club Ops. Operations breakdowns, technology reviews, membership strategy, and revenue insights for golf club operators.',
  openGraph: {
    title: 'Articles — Golf Club Ops',
    description:
      'All articles from Golf Club Ops. Operations breakdowns, technology reviews, and strategy for golf club operators.',
  },
};

async function getArticles() {
  return client.fetch(ARTICLES_QUERY);
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  const featuredArticle = articles?.find((a: any) => a.featured);
  const otherArticles = articles?.filter((a: any) => !a.featured);

  // Split into groups of 3 for grid layout
  const articleGroups: any[][] = [];
  if (otherArticles) {
    for (let i = 0; i < otherArticles.length; i += 3) {
      articleGroups.push(otherArticles.slice(i, i + 3));
    }
  }

  return (
    <>
      {/* Page Header */}
      <section className="articles-page-header">
        <h1 className="h2">Articles</h1>
        <p className="articles-page-header__sub">
          Honest, practical intelligence for golf club operators. No vendor spin, no consultant
          jargon — just the stuff that actually matters.
        </p>
      </section>

      {/* All Articles */}
      <section className="content-section">
        {/* Featured Article */}
        {featuredArticle && (
          <div className="articles-grid articles-grid--featured" style={{ marginBottom: 'var(--space-lg)' }}>
            <ArticleCard
              title={featuredArticle.title}
              slug={featuredArticle.slug.current}
              excerpt={featuredArticle.excerpt}
              category={featuredArticle.category}
              readTime={featuredArticle.readTime}
              heroImage={featuredArticle.heroImage}
              featured
            />
          </div>
        )}

        {/* Article Grids */}
        {articleGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="articles-grid articles-grid--small"
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            {group.map((article: any) => (
              <ArticleCard
                key={article._id}
                title={article.title}
                slug={article.slug.current}
                category={article.category}
                readTime={article.readTime}
                heroImage={article.heroImage}
              />
            ))}
          </div>
        ))}
      </section>

      {/* Newsletter Signup */}
      <Subscribe />
    </>
  );
}
