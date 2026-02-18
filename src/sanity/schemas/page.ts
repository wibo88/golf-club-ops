export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
    {
      name: 'heroImagePath',
      title: 'Hero Image Path (local)',
      type: 'string',
      description: 'Path to a local image in /public (e.g. /images/photo.jpg). Used when not uploading to Sanity CDN.',
    },
    {
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
    },
    {
      name: 'heroCtaText',
      title: 'Hero CTA Button Text',
      type: 'string',
      description: 'Text for the call-to-action button in the hero (e.g. "Read the latest")',
    },
    {
      name: 'heroCtaLink',
      title: 'Hero CTA Button Link',
      type: 'string',
      description: 'URL for the CTA button (e.g. /articles)',
    },
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          name: 'contentSection',
          title: 'Content Section',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Section Label',
              type: 'string',
              description: 'Small label above the content (e.g. "Our mission", "What you get")',
            },
            {
              name: 'body',
              title: 'Body',
              type: 'blockContent',
            },
            {
              name: 'image',
              title: 'Side Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', title: 'Alt Text', type: 'string' },
                { name: 'caption', title: 'Caption', type: 'string' },
              ],
            },
            {
              name: 'imagePath',
              title: 'Side Image Path (local)',
              type: 'string',
              description: 'Path to a local image in /public (e.g. /images/photo.jpg)',
            },
            {
              name: 'imageCaption',
              title: 'Image Caption',
              type: 'string',
              description: 'Caption text shown below the image',
            },
            {
              name: 'imagePosition',
              title: 'Image Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Right', value: 'right' },
                  { title: 'Left', value: 'left' },
                ],
              },
              initialValue: 'right',
            },
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }: { title: string }) {
              return { title: title || 'Content Section' };
            },
          },
        },
        {
          name: 'pillarsSection',
          title: 'Pillars / Feature Grid',
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              description: 'e.g. "What We Cover"',
            },
            {
              name: 'pillars',
              title: 'Pillars',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'icon',
                      title: 'Font Awesome Icon Class',
                      type: 'string',
                      description: 'e.g. fa-solid fa-gears',
                    },
                    {
                      name: 'name',
                      title: 'Pillar Name',
                      type: 'string',
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: { title: 'name', subtitle: 'description' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }: { title: string }) {
              return { title: title || '🏛️ Pillars Section' };
            },
          },
        },
        {
          name: 'featuredArticlesSection',
          title: 'Featured Articles',
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              description: 'e.g. "Featured Articles"',
            },
            {
              name: 'maxSecondary',
              title: 'Max Secondary Articles',
              type: 'number',
              description: 'Number of non-featured articles to show (default: 3)',
              initialValue: 3,
            },
            {
              name: 'viewAllText',
              title: '"View All" Button Text',
              type: 'string',
              initialValue: 'View all articles',
            },
            {
              name: 'viewAllLink',
              title: '"View All" Button Link',
              type: 'string',
              initialValue: '/articles',
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }: { title: string }) {
              return { title: title || '📰 Featured Articles Section' };
            },
          },
        },
        {
          name: 'familiarSection',
          title: '"Sounds Familiar" Section',
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              description: 'e.g. "If any of this sounds familiar..."',
            },
            {
              name: 'statements',
              title: 'Statements',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'The quoted statements shown in this section',
            },
            {
              name: 'closingText',
              title: 'Closing Text',
              type: 'string',
              description: 'Text shown after the statements (e.g. "Then you\'re in the right place.")',
            },
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }: { title: string }) {
              return { title: title || '💬 Familiar Section' };
            },
          },
        },
        {
          name: 'subscribeSection',
          title: 'Subscribe / Newsletter Signup',
          type: 'object',
          fields: [
            {
              name: 'enabled',
              title: 'Show Subscribe Form',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            prepare() {
              return { title: '📧 Subscribe Section' };
            },
          },
        },
      ],
    },
    {
      name: 'showSubscribe',
      title: 'Show Subscribe at Bottom',
      type: 'boolean',
      description: 'Show the newsletter subscribe form at the bottom of the page',
      initialValue: true,
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
        { name: 'canonicalUrl', title: 'Canonical URL', type: 'url' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
};
