export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Golf Club Ops',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'The No-BS Guide to Running a Modern Golf Club',
    },
    {
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
      initialValue: 'Independent. Unaffiliated. Occasionally irreverent.',
    },
    {
      name: 'formspreeId',
      title: 'Formspree Form ID',
      type: 'string',
      description: 'The Formspree form ID for newsletter signups (e.g. xnjbvgvq)',
      initialValue: 'xnjbvgvq',
    },
    {
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'href', title: 'URL', type: 'string' },
            {
              name: 'colorClass',
              title: 'Color Class',
              type: 'string',
              options: {
                list: [
                  { title: 'Orange', value: 'nav__link--orange' },
                  { title: 'Green', value: 'nav__link--green' },
                  { title: 'Blue', value: 'nav__link--blue' },
                  { title: 'Yellow', value: 'nav__link--yellow' },
                ],
              },
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    },
    {
      name: 'familiarStatements',
      title: '"Sounds Familiar" Statements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'The quotes shown in the "If any of this sounds familiar" section on the homepage',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
};
