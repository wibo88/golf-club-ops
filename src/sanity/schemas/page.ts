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
