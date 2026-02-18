/**
 * migrate-pages.mjs
 * Creates About and Newsletter page documents in Sanity
 * 
 * Usage:
 *   set SANITY_AUTH_TOKEN=sk-...
 *   node scripts/migrate-pages.mjs
 */

import { createClient } from '@sanity/client';

const token = process.env.SANITY_AUTH_TOKEN;
if (!token) {
  console.error('❌ Set SANITY_AUTH_TOKEN environment variable first');
  process.exit(1);
}

const client = createClient({
  projectId: 'wxh00ex7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Helper to create a Portable Text block
function textBlock(text, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style,
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: Math.random().toString(36).slice(2, 10),
        text,
        marks: [],
      },
    ],
  };
}

// Helper to create a block with mixed content (text with marks)
function richBlock(children, style = 'normal', markDefs = []) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2, 10),
    style,
    markDefs,
    children: children.map(child => ({
      _type: 'span',
      _key: Math.random().toString(36).slice(2, 10),
      ...child,
    })),
  };
}

// ── About Page ──────────────────────────────────────────────

const aboutPage = {
  _id: 'page-about',
  _type: 'page',
  title: 'About Golf Club Ops',
  slug: { _type: 'slug', current: 'about' },
  heroImagePath: '/images/Golf_Club_Operations_2026-29.jpg',
  heroHeadline: 'About Golf Club Ops',
  heroSubtitle: 'We exist because nobody else is writing honestly about what it takes to run a golf club in 2026.',
  showSubscribe: true,
  sections: [
    {
      _type: 'contentSection',
      _key: 'about-mission',
      label: 'Our mission',
      imagePosition: 'right',
      imagePath: '/images/Golf_Club_Operations_2026-9.jpg',
      body: [
        textBlock('Golf Club Ops is an independent publication for the people who actually run golf clubs — the general managers, operations managers, and administrators who navigate the daily reality of ageing software, committee politics, and member expectations that somehow include both "don\'t change anything" and "why isn\'t this more like my banking app?"'),
        textBlock('We write honest, practical, occasionally pointed analysis of golf club operations, technology, and strategy. No vendor partnerships. No sponsored content. No consultant-speak.'),
      ],
    },
    {
      _type: 'contentSection',
      _key: 'about-approach',
      label: 'Our approach',
      imagePosition: 'left',
      imagePath: '/images/minesweeper-tee-sheet.png',
      body: [
        textBlock('Every article starts with a simple question: "Would this actually help someone running a golf club make a better decision?"'),
        textBlock('We time actual processes. We compare real platforms. We talk to real operators. And we write it up in a way that respects your intelligence and your time.'),
      ],
    },
  ],
  seo: {
    metaTitle: 'About — Golf Club Ops',
    metaDescription: 'Golf Club Ops exists because nobody else is writing honestly about what it takes to run a golf club in 2026.',
  },
};

// ── Newsletter Page ─────────────────────────────────────────

const newsletterPage = {
  _id: 'page-newsletter',
  _type: 'page',
  title: 'Newsletter',
  slug: { _type: 'slug', current: 'newsletter' },
  heroImagePath: '/images/Golf_Club_Operations_2026-32.jpg',
  heroHeadline: 'Stay in the loop.',
  heroSubtitle: 'One email per month. The latest articles, the sharpest insights, and the occasional number that will make you look at your own processes differently.',
  showSubscribe: true,
  sections: [
    {
      _type: 'subscribeSection',
      _key: 'newsletter-subscribe',
      enabled: true,
    },
    {
      _type: 'contentSection',
      _key: 'newsletter-what-you-get',
      label: 'What you get',
      imagePosition: 'right',
      imagePath: '/images/Golf_Club_Operations_2026-11.jpg',
      body: [
        textBlock('Every month, we send one email. It includes our latest articles, a curated link or two from elsewhere in the industry, and occasionally a number that will make you look at your own club\'s operations differently.'),
        textBlock('No spam. No sales pitches. No "exclusive webinar invitations." Just useful content for people who run golf clubs.'),
        textBlock('Unsubscribe whenever you like. We\'re not going to make it weird.'),
      ],
    },
  ],
  seo: {
    metaTitle: 'Newsletter — Golf Club Ops',
    metaDescription: 'Subscribe to Golf Club Ops. One email per month with the latest articles, sharpest insights, and the occasional number that will make you rethink your processes.',
  },
};

// ── Run Migration ───────────────────────────────────────────

async function migrate() {
  console.log('🚀 Migrating pages to Sanity...\n');

  const transaction = client.transaction();

  transaction.createOrReplace(aboutPage);
  console.log('  ✅ About page prepared');

  transaction.createOrReplace(newsletterPage);
  console.log('  ✅ Newsletter page prepared');

  const result = await transaction.commit();
  console.log(`\n✅ Migration complete! ${result.documentIds.length} pages created.`);
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
