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
      name: 'callout',
      title: 'Callout Box',
      type: 'object',
      fields: [
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
        {
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 3,
        },
      ],
      preview: {
        select: { title: 'text', subtitle: 'type' },
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
