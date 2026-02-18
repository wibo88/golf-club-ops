import Link from 'next/link';
import PortableTextRenderer from './PortableTextRenderer';
import Subscribe from './Subscribe';
import ArticleCard from './ArticleCard';
import { urlFor } from '@/lib/sanity.image';

interface ContentSection {
  _type: 'contentSection';
  _key: string;
  label?: string;
  body?: any[];
  image?: any;
  imagePath?: string;
  imageCaption?: string;
  imagePosition?: 'left' | 'right';
}

interface PillarItem {
  _key: string;
  icon: string;
  name: string;
  description: string;
}

interface PillarsSection {
  _type: 'pillarsSection';
  _key: string;
  heading?: string;
  pillars?: PillarItem[];
}

interface FeaturedArticlesSection {
  _type: 'featuredArticlesSection';
  _key: string;
  heading?: string;
  maxSecondary?: number;
  viewAllText?: string;
  viewAllLink?: string;
}

interface FamiliarSection {
  _type: 'familiarSection';
  _key: string;
  heading?: string;
  statements?: string[];
  closingText?: string;
}

interface SubscribeSection {
  _type: 'subscribeSection';
  _key: string;
  enabled: boolean;
}

type Section =
  | ContentSection
  | PillarsSection
  | FeaturedArticlesSection
  | FamiliarSection
  | SubscribeSection;

/* ── Content Section ─────────────────────────────────────── */

function ContentSectionBlock({ section }: { section: ContentSection }) {
  const imageUrl = section.image
    ? urlFor(section.image).width(800).quality(80).url()
    : section.imagePath || null;

  const imageAlt = section.image?.alt || 'Section image';
  const imageCaption = section.image?.caption || section.imageCaption || null;
  const isImageLeft = section.imagePosition === 'left';

  const textContent = (
    <div style={{ paddingRight: isImageLeft ? undefined : 'var(--space-lg)', paddingLeft: isImageLeft ? 'var(--space-lg)' : undefined }}>
      {section.label && (
        <span
          className="section-label"
          style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}
        >
          {section.label}
        </span>
      )}
      {section.body && (
        <div className="content-section__body">
          <PortableTextRenderer value={section.body} />
        </div>
      )}
    </div>
  );

  const imageContent = imageUrl ? (
    <div>
      <img
        src={imageUrl}
        alt={imageAlt}
        style={{
          width: '100%',
          borderRadius: '8px',
          objectFit: 'cover',
          aspectRatio: '4/3',
        }}
      />
      {imageCaption && (
        <p
          style={{
            marginTop: 'var(--space-xs)',
            fontSize: '0.85rem',
            opacity: 0.7,
            textAlign: 'center',
          }}
        >
          {imageCaption}
        </p>
      )}
    </div>
  ) : null;

  return (
    <section className="content-section">
      <div className="content-section__grid content-section__grid--with-image">
        {isImageLeft ? (
          <>
            {imageContent}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {imageContent}
          </>
        )}
      </div>
    </section>
  );
}

/* ── Pillars Section ─────────────────────────────────────── */

function PillarsSectionBlock({ section }: { section: PillarsSection }) {
  if (!section.pillars || section.pillars.length === 0) return null;

  return (
    <section className="content-section">
      {section.heading && (
        <h2 className="h3" style={{ marginBottom: 'var(--space-lg)' }}>
          {section.heading}
        </h2>
      )}
      <div className="pillars">
        {section.pillars.map((pillar) => (
          <div key={pillar._key} className="pillar">
            {pillar.icon && (
              <span className="pillar__icon">
                <i className={pillar.icon}></i>
              </span>
            )}
            <h3 className="pillar__name">{pillar.name}</h3>
            <p className="pillar__desc">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Featured Articles Section ───────────────────────────── */

function FeaturedArticlesSectionBlock({
  section,
  articles,
}: {
  section: FeaturedArticlesSection;
  articles?: any[];
}) {
  if (!articles || articles.length === 0) return null;

  const featuredArticle = articles.find((a: any) => a.featured);
  const maxSecondary = section.maxSecondary || 3;
  const secondaryArticles = articles
    .filter((a: any) => !a.featured)
    .slice(0, maxSecondary);

  return (
    <section className="content-section">
      {section.heading && (
        <h2 className="h3" style={{ marginBottom: 'var(--space-lg)' }}>
          {section.heading}
        </h2>
      )}

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

      {secondaryArticles.length > 0 && (
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

      {section.viewAllText && section.viewAllLink && (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Link href={section.viewAllLink} className="view-all-btn">
            {section.viewAllText}
          </Link>
        </div>
      )}
    </section>
  );
}

/* ── Familiar Section ────────────────────────────────────── */

function FamiliarSectionBlock({ section }: { section: FamiliarSection }) {
  if (!section.statements || section.statements.length === 0) return null;

  return (
    <section className="familiar">
      <div className="container">
        {section.heading && <h2 className="h3">{section.heading}</h2>}
        <div className="familiar__statements">
          {section.statements.map((statement, i) => (
            <div key={i} className="familiar__statement">
              &ldquo;{statement}&rdquo;
            </div>
          ))}
        </div>
        {section.closingText && (
          <p className="familiar__closing">{section.closingText}</p>
        )}
      </div>
    </section>
  );
}

/* ── Main Renderer ───────────────────────────────────────── */

export default function PageSectionRenderer({
  sections,
  formspreeId,
  articles,
}: {
  sections: Section[];
  formspreeId?: string;
  articles?: any[];
}) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'contentSection':
            return <ContentSectionBlock key={section._key} section={section as ContentSection} />;
          case 'pillarsSection':
            return <PillarsSectionBlock key={section._key} section={section as PillarsSection} />;
          case 'featuredArticlesSection':
            return (
              <FeaturedArticlesSectionBlock
                key={section._key}
                section={section as FeaturedArticlesSection}
                articles={articles}
              />
            );
          case 'familiarSection':
            return <FamiliarSectionBlock key={section._key} section={section as FamiliarSection} />;
          case 'subscribeSection':
            if ((section as SubscribeSection).enabled) {
              return <Subscribe key={section._key} formspreeId={formspreeId} />;
            }
            return null;
          default:
            return null;
        }
      })}
    </>
  );
}
