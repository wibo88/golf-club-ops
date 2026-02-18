export default {
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule: any) =>
                  Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
              },
              {
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
    },
    {
      name: 'localImage',
      title: 'Local Image',
      type: 'object',
      description: 'Reference to an image in /public/images/ (not uploaded to Sanity CDN)',
      fields: [
        {
          name: 'src',
          title: 'Image Path',
          type: 'string',
          description: 'Path relative to /public, e.g. /images/photo.jpg',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
        },
      ],
      preview: {
        select: { title: 'alt', subtitle: 'src' },
        prepare({ title, subtitle }: { title: string; subtitle: string }) {
          return { title: title || 'Image', subtitle };
        },
      },
    },
    {
      name: 'callout',
      title: 'Callout Box',
      type: 'object',
      fields: [
        {
          name: 'number',
          title: 'Number / Stat',
          type: 'string',
          description: 'The big number or stat displayed prominently (e.g. "22 min", "$47k", "146 hrs")',
        },
        {
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 3,
        },
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Tip', value: 'tip' },
            ],
          },
          initialValue: 'info',
        },
      ],
      preview: {
        select: { title: 'number', subtitle: 'text' },
        prepare({ title, subtitle }: { title: string; subtitle: string }) {
          return { title: title || 'Callout', subtitle };
        },
      },
    },
    {
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Quote Text',
          type: 'string',
        },
        {
          name: 'attribution',
          title: 'Attribution',
          type: 'string',
        },
      ],
      preview: {
        select: { title: 'text' },
        prepare({ title }: { title: string }) {
          return { title: `"${title}"` };
        },
      },
    },
  ],
};
