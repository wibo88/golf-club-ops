/**
 * Content Migration Script
 * Parses existing HTML articles and pushes them to Sanity as Portable Text.
 * 
 * Usage: node scripts/migrate-content.mjs
 * 
 * Requires: SANITY_AUTH_TOKEN env var or logged-in CLI session
 */

import { createClient } from '@sanity/client';
import { parse } from 'node-html-parser';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

// ── Sanity Client (with write token) ──────────────────────
const client = createClient({
  projectId: 'wxh00ex7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
});

// ── Helper: generate a Sanity-compatible key ──────────────
function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

// ── Helper: decode HTML entities ──────────────────────────
function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&middot;/g, '\u00B7')
    .replace(/&rarr;/g, '\u2192')
    .replace(/&nbsp;/g, ' ');
}

// ── Convert inline HTML to Portable Text spans ────────────
function parseInlineContent(element) {
  const children = [];
  const markDefs = [];

  function walk(node, activeMarks = []) {
    if (node.nodeType === 3) {
      // Text node
      const text = decodeEntities(node.rawText);
      if (text) {
        children.push({
          _type: 'span',
          _key: key(),
          text,
          marks: [...activeMarks],
        });
      }
    } else if (node.nodeType === 1) {
      const tag = node.tagName?.toLowerCase();
      if (tag === 'strong' || tag === 'b') {
        for (const child of node.childNodes) {
          walk(child, [...activeMarks, 'strong']);
        }
      } else if (tag === 'em' || tag === 'i') {
        for (const child of node.childNodes) {
          walk(child, [...activeMarks, 'em']);
        }
      } else if (tag === 'a') {
        const href = node.getAttribute('href');
        const target = node.getAttribute('target');
        const markKey = key();
        markDefs.push({
          _type: 'link',
          _key: markKey,
          href,
          openInNewTab: target === '_blank',
        });
        for (const child of node.childNodes) {
          walk(child, [...activeMarks, markKey]);
        }
      } else {
        // Unknown inline element — just walk children
        for (const child of node.childNodes) {
          walk(child, activeMarks);
        }
      }
    }
  }

  for (const child of element.childNodes) {
    walk(child);
  }

  // Ensure at least one span
  if (children.length === 0) {
    children.push({ _type: 'span', _key: key(), text: '', marks: [] });
  }

  return { children, markDefs };
}

// ── Convert article body HTML to Portable Text blocks ─────
function htmlToPortableText(articleBody) {
  const blocks = [];

  for (const node of articleBody.childNodes) {
    if (node.nodeType === 3) {
      // Skip whitespace-only text nodes
      if (node.rawText.trim()) {
        blocks.push({
          _type: 'block',
          _key: key(),
          style: 'normal',
          ...parseInlineContent(node),
        });
      }
      continue;
    }

    if (node.nodeType !== 1) continue;

    const tag = node.tagName?.toLowerCase();

    if (tag === 'p') {
      const { children, markDefs } = parseInlineContent(node);
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'normal',
        children,
        markDefs,
      });
    } else if (tag === 'h2') {
      const { children, markDefs } = parseInlineContent(node);
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'h2',
        children,
        markDefs,
      });
    } else if (tag === 'h3') {
      const { children, markDefs } = parseInlineContent(node);
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'h3',
        children,
        markDefs,
      });
    } else if (tag === 'h4') {
      const { children, markDefs } = parseInlineContent(node);
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'h4',
        children,
        markDefs,
      });
    } else if (tag === 'blockquote') {
      const { children, markDefs } = parseInlineContent(node);
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'blockquote',
        children,
        markDefs,
      });
    } else if (tag === 'img') {
      // Skip images for now — they'd need to be uploaded to Sanity assets
      // We'll reference them as static images instead
      const src = node.getAttribute('src');
      const alt = node.getAttribute('alt') || '';
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: key(),
            text: `[Image: ${alt || src}]`,
            marks: ['em'],
          },
        ],
        markDefs: [],
      });
    } else if (tag === 'div' && node.classList?.contains('callout')) {
      // Callout box
      const numberEl = node.querySelector('.callout__number');
      const textEl = node.querySelector('.callout__text');
      if (textEl) {
        blocks.push({
          _type: 'callout',
          _key: key(),
          tone: 'info',
          text: decodeEntities(textEl.text.trim()),
        });
      }
    } else if (tag === 'ul' || tag === 'ol') {
      // List items
      const listItems = node.querySelectorAll('li');
      for (const li of listItems) {
        const { children, markDefs } = parseInlineContent(li);
        blocks.push({
          _type: 'block',
          _key: key(),
          style: 'normal',
          listItem: tag === 'ul' ? 'bullet' : 'number',
          level: 1,
          children,
          markDefs,
        });
      }
    } else if (tag === 'table') {
      // Tables — convert to paragraphs with bold headers
      const rows = node.querySelectorAll('tr');
      for (const row of rows) {
        const cells = row.querySelectorAll('td, th');
        const cellTexts = cells.map(c => decodeEntities(c.text.trim()));
        blocks.push({
          _type: 'block',
          _key: key(),
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: key(),
              text: cellTexts.join(' | '),
              marks: row.querySelector('th') ? ['strong'] : [],
            },
          ],
          markDefs: [],
        });
      }
    }
  }

  return blocks;
}

// ── Article definitions ───────────────────────────────────
const articles = [
  {
    file: 'golf-software-2026.html',
    slug: 'golf-software-2026',
    category: 'technology-software',
    readTime: '12 min read',
    featured: true,
    publishDate: '2026-02-01',
  },
  {
    file: 'tee-sheet-software-1999.html',
    slug: 'tee-sheet-software-1999',
    category: 'technology-software',
    readTime: '11 min read',
    featured: false,
    publishDate: '2026-02-03',
  },
  {
    file: 'article.html',
    slug: 'visitor-booking-cost',
    category: 'operations-workflows',
    readTime: '9 min read',
    featured: false,
    publishDate: '2026-02-05',
  },
  {
    file: 'hidden-cost-always-done-it-this-way.html',
    slug: 'hidden-cost-always-done-it-this-way',
    category: 'operations-workflows',
    readTime: '12 min read',
    featured: false,
    publishDate: '2026-02-07',
  },
  {
    file: 'gm-guide-committee-tech-change.html',
    slug: 'gm-guide-committee-tech-change',
    category: 'leadership-governance',
    readTime: '13 min read',
    featured: false,
    publishDate: '2026-02-09',
  },
];

// ── Categories ────────────────────────────────────────────
const categories = [
  {
    _id: 'category-technology-software',
    _type: 'category',
    name: 'Technology & Software',
    slug: { _type: 'slug', current: 'technology-software' },
    description: 'Reviews, comparisons, and analysis of golf club management technology.',
  },
  {
    _id: 'category-operations-workflows',
    _type: 'category',
    name: 'Operations & Workflows',
    slug: { _type: 'slug', current: 'operations-workflows' },
    description: 'Practical breakdowns of how golf clubs actually run day-to-day.',
  },
  {
    _id: 'category-leadership-governance',
    _type: 'category',
    name: 'Leadership & Governance',
    slug: { _type: 'slug', current: 'leadership-governance' },
    description: 'Strategy, committee dynamics, and management insights for club leaders.',
  },
  {
    _id: 'category-membership-revenue',
    _type: 'category',
    name: 'Membership & Revenue',
    slug: { _type: 'slug', current: 'membership-revenue' },
    description: 'Membership models, pricing strategy, and revenue optimisation.',
  },
];

// ── Site Settings ─────────────────────────────────────────
const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'Golf Club Ops',
  tagline: 'The No-BS Guide to Running a Modern Golf Club',
  footerText: 'Independent. Unaffiliated. Occasionally irreverent.',
  formspreeId: 'xnjbvgvq',
  navLinks: [
    { _key: key(), label: 'Home', href: '/', colorClass: 'orange' },
    { _key: key(), label: 'Articles', href: '/articles', colorClass: 'green' },
    { _key: key(), label: 'About', href: '/about', colorClass: 'blue' },
    { _key: key(), label: 'Newsletter', href: '/newsletter', colorClass: 'yellow' },
  ],
  familiarStatements: [
    'We\'ve always done it this way.',
    'The committee won\'t approve that.',
    'Our members don\'t want to book online.',
    'We tried new software once. It was a disaster.',
    'The pro shop handles all of that manually.',
    'We don\'t need a CRM — we know our members.',
    'Our tee sheet works fine... most of the time.',
    'We\'ll look at it next financial year.',
  ],
};

// ── Main migration function ───────────────────────────────
async function migrate() {
  console.log('🏌️ Starting Golf Club Ops content migration...\n');

  // 1. Create categories
  console.log('📂 Creating categories...');
  const transaction = client.transaction();

  for (const cat of categories) {
    transaction.createOrReplace(cat);
    console.log(`   ✓ ${cat.name}`);
  }

  // 2. Create site settings
  console.log('\n⚙️  Creating site settings...');
  transaction.createOrReplace(siteSettings);
  console.log('   ✓ Site settings');

  await transaction.commit();
  console.log('\n✅ Categories and settings committed.\n');

  // 3. Parse and create articles
  console.log('📝 Migrating articles...');

  for (const articleDef of articles) {
    const filePath = path.resolve(articleDef.file);
    console.log(`\n   Processing: ${articleDef.file}`);

    const html = readFileSync(filePath, 'utf-8');
    const root = parse(html);

    // Extract metadata from HTML
    const title = decodeEntities(
      root.querySelector('.article-header__title')?.text?.trim() || 'Untitled'
    );
    const subtitle = decodeEntities(
      root.querySelector('.article-header__subtitle')?.text?.trim() || ''
    );
    const metaDesc =
      root.querySelector('meta[name="description"]')?.getAttribute('content') || subtitle;
    const ogImage =
      root.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

    // Extract article body content
    const articleBody = root.querySelector('.article-body') || root.querySelector('article');

    let body = [];
    if (articleBody) {
      body = htmlToPortableText(articleBody);
      console.log(`   → Converted ${body.length} blocks`);
    } else {
      console.log('   ⚠ No article body found');
    }

    // Build the article document
    const articleDoc = {
      _id: `article-${articleDef.slug}`,
      _type: 'article',
      title,
      slug: { _type: 'slug', current: articleDef.slug },
      subtitle,
      excerpt: metaDesc.slice(0, 200),
      category: {
        _type: 'reference',
        _ref: `category-${articleDef.category}`,
      },
      readTime: articleDef.readTime,
      publishDate: articleDef.publishDate,
      featured: articleDef.featured,
      body,
      seo: {
        metaTitle: title,
        metaDescription: metaDesc,
      },
    };

    try {
      await client.createOrReplace(articleDoc);
      console.log(`   ✓ "${title}" → /${articleDef.slug}`);
    } catch (err) {
      console.error(`   ✗ Failed: ${err.message}`);
    }
  }

  // 4. Set related articles
  console.log('\n🔗 Setting related articles...');

  const relatedMap = {
    'article-golf-software-2026': [
      'article-visitor-booking-cost',
      'article-tee-sheet-software-1999',
      'article-gm-guide-committee-tech-change',
    ],
    'article-tee-sheet-software-1999': [
      'article-golf-software-2026',
      'article-hidden-cost-always-done-it-this-way',
      'article-gm-guide-committee-tech-change',
    ],
    'article-visitor-booking-cost': [
      'article-golf-software-2026',
      'article-hidden-cost-always-done-it-this-way',
      'article-tee-sheet-software-1999',
    ],
    'article-hidden-cost-always-done-it-this-way': [
      'article-visitor-booking-cost',
      'article-gm-guide-committee-tech-change',
      'article-golf-software-2026',
    ],
    'article-gm-guide-committee-tech-change': [
      'article-hidden-cost-always-done-it-this-way',
      'article-golf-software-2026',
      'article-tee-sheet-software-1999',
    ],
  };

  const relatedTx = client.transaction();
  for (const [articleId, relatedIds] of Object.entries(relatedMap)) {
    relatedTx.patch(articleId, (p) =>
      p.set({
        relatedArticles: relatedIds.map((ref) => ({
          _type: 'reference',
          _ref: ref,
          _key: key(),
        })),
      })
    );
  }

  await relatedTx.commit();
  console.log('   ✓ Related articles linked');

  console.log('\n🎉 Migration complete!');
  console.log(`   ${categories.length} categories`);
  console.log(`   ${articles.length} articles`);
  console.log('   1 site settings document');
  console.log('\n   Visit http://localhost:3000/studio to review content.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
