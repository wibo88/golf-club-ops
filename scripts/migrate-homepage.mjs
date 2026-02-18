/**
 * migrate-homepage.mjs
 * Creates the Homepage page document in Sanity with all sections
 * 
 * Usage:
 *   set SANITY_AUTH_TOKEN=sk-...
 *   node scripts/migrate-homepage.mjs
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

// ── Homepage ────────────────────────────────────────────────

const homePage = {
  _id: 'page-home',
  _type: 'page',
  title: 'Home',
  slug: { _type: 'slug', current: 'home' },
  heroImagePath: '/images/Golf_Club_Operations_2026-1.jpg',
  heroHeadline: 'The no-BS guide to running a modern golf club.',
  heroSubtitle: "Practical intelligence for the next generation of golf club operators. Because your software shouldn't require a training webinar longer than your back nine.",
  heroCtaText: 'Read the latest',
  heroCtaLink: '/articles',
  showSubscribe: false, // Subscribe is in sections instead
  sections: [
    // 1. "What This Is" content section
    {
      _type: 'contentSection',
      _key: 'home-what-this-is',
      label: 'What This Is',
      imagePosition: 'right',
      imagePath: '/images/Golf_Club_Operations_2026-2.jpg',
      body: [
        textBlock("You manage a multi-million dollar operation with software that looks like it was designed during the dial-up era. Your members expect Uber-level convenience, your committee expects 1970s-level costs, and your tee sheet expects you to attend a 47-minute certification webinar before you're allowed to make a booking."),
        textBlock("We get it. Golf Club Ops exists because nobody else is writing honestly about what it takes to run a golf club in 2026 — the operational reality, the technology landscape, and the gap between what's available and what's actually good."),
        textBlock("No vendor spin. No consultant jargon. Just specific, practical, occasionally amusing insight from people who've spent more time inside clubhouses than is probably healthy."),
      ],
    },
    // 2. "What We Cover" pillars section
    {
      _type: 'pillarsSection',
      _key: 'home-pillars',
      heading: 'What We Cover',
      pillars: [
        {
          _key: 'pillar-ops',
          icon: 'fa-solid fa-gears',
          name: 'Operations & Workflows',
          description: 'Time audits, process comparisons, and the hidden costs nobody talks about.',
        },
        {
          _key: 'pillar-tech',
          icon: 'fa-solid fa-laptop-code',
          name: 'Technology & Software',
          description: "Honest assessments of golf club tech. The buying guide that doesn't exist yet.",
        },
        {
          _key: 'pillar-visitor',
          icon: 'fa-solid fa-globe',
          name: 'Visitor & Revenue Strategy',
          description: 'Maximising visitor revenue without making members feel like an afterthought.',
        },
        {
          _key: 'pillar-membership',
          icon: 'fa-solid fa-chart-line',
          name: 'Membership & Retention',
          description: 'Waitlists, churn, generational shifts, and the economics of belonging.',
        },
        {
          _key: 'pillar-leadership',
          icon: 'fa-solid fa-landmark',
          name: 'Leadership & Governance',
          description: 'Committee dynamics, vendor selection, and the art of pitching change.',
        },
      ],
    },
    // 3. Featured Articles section
    {
      _type: 'featuredArticlesSection',
      _key: 'home-featured-articles',
      heading: 'Featured Articles',
      maxSecondary: 3,
      viewAllText: 'View all articles',
      viewAllLink: '/articles',
    },
    // 4. "If any of this sounds familiar" section
    {
      _type: 'familiarSection',
      _key: 'home-familiar',
      heading: 'If any of this sounds familiar...',
      statements: [
        "You've processed a visitor booking using a combination of email, phone, a PDF, and a prayer.",
        "You've watched a new hire try to navigate your tee sheet without a 45-minute tutorial.",
        "Your banking app knows you better than your club's member portal knows your members.",
        "You've tried explaining to a committee why 'it works fine' isn't a technology strategy.",
      ],
      closingText: "Then you're in the right place.",
    },
    // 5. Subscribe section
    {
      _type: 'subscribeSection',
      _key: 'home-subscribe',
      enabled: true,
    },
  ],
  seo: {
    metaTitle: 'Golf Club Ops — The No-BS Guide to Running a Modern Golf Club',
    metaDescription: 'Practical intelligence for the next generation of golf club operators. Honest analysis of golf club operations, technology, and strategy.',
  },
};

// ── Run Migration ───────────────────────────────────────────

async function migrate() {
  console.log('🚀 Migrating homepage to Sanity...\n');

  const result = await client.createOrReplace(homePage);
  console.log(`  ✅ Homepage created: ${result._id}`);

  console.log('\n✅ Homepage migration complete!');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
