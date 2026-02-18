/**
 * fix-images.mjs
 * Adds heroImagePath to all articles and imageCaption to About page minesweeper section
 * 
 * Usage:
 *   set SANITY_AUTH_TOKEN=sk-...
 *   node scripts/fix-images.mjs
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

async function fix() {
  console.log('🔧 Fixing images and captions...\n');

  const transaction = client.transaction();

  // ── 1. Add heroImagePath to all articles ──────────────────
  const articleImages = {
    'article-golf-software-2026': '/images/Golf_Club_Operations_2026-3.jpg',
    'article-tee-sheet-software-1999': '/images/Golf_Club_Operations_2026-17.jpg',
    'article-visitor-booking-cost': '/images/Golf_Club_Operations_2026-6.jpg',
    'article-hidden-cost-always-done-it-this-way': '/images/Golf_Club_Operations_2026-22.jpg',
    'article-gm-guide-committee-tech-change': '/images/Golf_Club_Operations_2026-20.jpg',
  };

  for (const [articleId, imagePath] of Object.entries(articleImages)) {
    transaction.patch(articleId, (p) => p.set({ heroImagePath: imagePath }));
    console.log(`  ✅ ${articleId} → ${imagePath}`);
  }

  // ── 2. Fix About page: add imageCaption to minesweeper section ──
  // Fetch current about page to get sections
  const aboutPage = await client.fetch('*[_id == "page-about"][0]');
  if (aboutPage && aboutPage.sections) {
    const updatedSections = aboutPage.sections.map((section) => {
      if (section._key === 'about-approach') {
        return {
          ...section,
          imageCaption: 'The resemblance is uncanny.',
        };
      }
      return section;
    });
    transaction.patch('page-about', (p) => p.set({ sections: updatedSections }));
    console.log('  ✅ About page: added minesweeper caption');
  }

  const result = await transaction.commit();
  console.log(`\n✅ Done! Updated ${result.documentIds.length} documents.`);
}

fix().catch((err) => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});
