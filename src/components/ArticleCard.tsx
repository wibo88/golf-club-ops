import Link from 'next/link';
import { urlFor } from '@/lib/sanity.image';

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt?: string;
  category?: { name: string };
  readTime?: string;
  heroImage?: any;
  heroImagePath?: string;
  featured?: boolean;
}

export default function ArticleCard({
  title,
  slug,
  excerpt,
  category,
  readTime,
  heroImage,
  heroImagePath,
  featured = false,
}: ArticleCardProps) {
  const imageUrl = heroImage
    ? urlFor(heroImage).width(800).quality(80).url()
    : heroImagePath || '';

  if (featured) {
    return (
      <Link
        href={`/${slug}`}
        className="article-card article-card--featured"
        style={{
          backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="article-card__content">
          <h3 className="article-card__title">{title}</h3>
          {excerpt && <p className="article-card__excerpt">{excerpt}</p>}
          <div className="article-card__meta">
            {category && <span>{category.name}</span>}
            {category && readTime && <span>&middot;</span>}
            {readTime && <span>{readTime}</span>}
          </div>
          <span className="article-card__cta">
            Read article <span>&rarr;</span>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/${slug}`} className="article-card">
      <div
        className="article-card__image"
        style={{
          backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <h3 className="article-card__title">{title}</h3>
      <div className="article-card__meta">
        {category && <span>{category.name}</span>}
        {category && readTime && <span>&middot;</span>}
        {readTime && <span>{readTime}</span>}
      </div>
    </Link>
  );
}
