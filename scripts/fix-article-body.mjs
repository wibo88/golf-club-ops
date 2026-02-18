/**
 * fix-article-body.mjs
 * Re-migrates all 5 article bodies to fix:
 *   1. Inline images: [Image: ...] text → localImage blocks with proper src/alt
 *   2. Callouts: missing number field → callout blocks with number + text
 * 
 * Usage:
 *   set SANITY_AUTH_TOKEN=sk-...
 *   node scripts/fix-article-body.mjs
 */

import { createClient } from '@sanity/client';
import { parse } from 'node-html-parser';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';

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

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

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

function parseInlineContent(element) {
  const children = [];
  const markDefs = [];

  function walk(node, activeMarks = []) {
    if (node.nodeType === 3) {
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
        for (const child of node.childNodes) {
          walk(child, activeMarks);
        }
      }
    }
  }

  for (const child of element.childNodes) {
    walk(child);
  }

  if (children.length === 0) {
    children.push({ _type: 'span', _key: key(), text: '', marks: [] });
  }

  return { children, markDefs };
}

function htmlToPortableText(articleBody) {
  const blocks = [];

  for (const node of articleBody.childNodes) {
    if (node.nodeType === 3) {
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
      // ✅ FIX: Convert to localImage block instead of [Image: ...] text
      let src = node.getAttribute('src') || '';
      const alt = node.getAttribute('alt') || '';
      
      // Normalize path: "images/foo.jpg" → "/images/foo.jpg"
      if (src && !src.startsWith('/') && !src.startsWith('http')) {
        src = '/' + src;
      }
      
      blocks.push({
        _type: 'localImage',
        _key: key(),
        src,
        alt,
      });
    } else if (tag === 'div' && node.classList?.contains('callout')) {
      // ✅ FIX: Capture both number and text from callout
      const numberEl = node.querySelector('.callout__number');
      const textEl = node.querySelector('.callout__text');
      
      const numberText = numberEl ? decodeEntities(numberEl.text.trim()) : '';
      const calloutText = textEl ? decodeEntities(textEl.text.trim()) : '';
      
      if (numberText || calloutText) {
        blocks.push({
          _type: 'callout',
          _key: key(),
          number: numberText,
          text: calloutText,
          type: 'info',
        });
      }
    } else if (tag === 'ul' || tag === 'ol') {
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
    id: 'article-golf-software-2026',
  },
  {
    file: 'tee-sheet-software-1999.html',
    slug: 'tee-sheet-software-1999',
    id: 'article-tee-sheet-software-1999',
  },
  {
    file: 'article.html',
    slug: 'visitor-booking-cost',
    id: 'article-visitor-booking-cost',
  },
  {
    file: 'hidden-cost-always-done-it-this-way.html',
    slug: 'hidden-cost-always-done-it-this-way',
    id: 'article-hidden-cost-always-done-it-this-way',
  },
  {
    file: 'gm-guide-committee-tech-change.html',
    slug: 'gm-guide-committee-tech-change',
    id: 'article-gm-guide-committee-tech-change',
  },
];

async function migrate() {
  console.log('🔧 Re-migrating article bodies (fixing images + callouts)...\n');

  const transaction = client.transaction();

  for (const articleDef of articles) {
    const filePath = path.resolve(articleDef.file);
    console.log(`  Processing: ${articleDef.file}`);

    let html;
    try {
      html = readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.log(`    ⚠ File not found: ${filePath}, skipping`);
      continue;
    }

    const root = parse(html);
    const articleBody = root.querySelector('.article-body') || root.querySelector('article');

    if (!articleBody) {
      console.log('    ⚠ No article body found, skipping');
      continue;
    }

    const body = htmlToPortableText(articleBody);

    // Count what we found
    const imageCount = body.filter(b => b._type === 'localImage').length;
    const calloutCount = body.filter(b => b._type === 'callout').length;
    const calloutWithNumber = body.filter(b => b._type === 'callout' && b.number).length;

    console.log(`    → ${body.length} blocks, ${imageCount} images, ${calloutCount} callouts (${calloutWithNumber} with numbers)`);

    // Patch just the body field
    transaction.patch(articleDef.id, (p) => p.set({ body }));
    console.log(`    ✅ Queued: ${articleDef.id}`);
  }

  const result = await transaction.commit();
  console.log(`\n✅ Re-migration complete! ${result.documentIds.length} articles updated.`);
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
