import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
});

// ── GROQ Queries ──────────────────────────────────────────

export const ARTICLES_QUERY = `*[_type == "article"] | order(publishDate desc) {
  _id,
  title,
  slug,
  subtitle,
  excerpt,
  readTime,
  publishDate,
  featured,
  heroImage,
  heroImagePath,
  "category": category->{ name, slug }
}`;

export const FEATURED_ARTICLES_QUERY = `*[_type == "article" && featured == true] | order(publishDate desc) [0...1] {
  _id,
  title,
  slug,
  subtitle,
  excerpt,
  readTime,
  publishDate,
  heroImage,
  heroImagePath,
  "category": category->{ name, slug }
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  subtitle,
  excerpt,
  readTime,
  publishDate,
  heroImage,
  heroImagePath,
  body,
  "category": category->{ name, slug },
  "relatedArticles": relatedArticles[]->{
    _id, title, slug, excerpt, readTime, heroImage, heroImagePath,
    "category": category->{ name, slug }
  },
  seo
}`;

export const ARTICLE_SLUGS_QUERY = `*[_type == "article"] { "slug": slug.current }`;

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  heroImage,
  heroImagePath,
  heroHeadline,
  heroSubtitle,
  heroCtaText,
  heroCtaLink,
  sections,
  showSubscribe,
  body,
  seo
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  siteName,
  tagline,
  footerText,
  formspreeId,
  navLinks,
  familiarStatements
}`;

export const CATEGORIES_QUERY = `*[_type == "category"] | order(name asc) {
  _id,
  name,
  slug,
  description
}`;
