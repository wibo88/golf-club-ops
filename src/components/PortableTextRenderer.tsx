import { PortableText, PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity.image';

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="h3">{children}</h2>,
    h3: ({ children }) => <h3 className="h4">{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ value, children }) => {
      const { href, openInNewTab } = value || {};
      return openInNewTab ? (
        <a href={href} target="_blank" rel="noopener">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      );
    },
  },
  types: {
    // Sanity CDN image (uploaded asset)
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value).width(1200).quality(80).url();
      return (
        <figure style={{ margin: 'var(--space-lg) 0' }}>
          <img
            src={imageUrl}
            alt={value.alt || ''}
            style={{
              width: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
          {value.caption && (
            <figcaption
              style={{
                marginTop: 'var(--space-xs)',
                fontSize: '0.85rem',
                opacity: 0.7,
                textAlign: 'center',
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Local image (path to /public/images/)
    localImage: ({ value }) => {
      if (!value?.src) return null;
      return (
        <figure style={{ margin: 'var(--space-lg) 0' }}>
          <img
            src={value.src}
            alt={value.alt || ''}
            style={{
              width: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
              aspectRatio: '16/9',
            }}
            loading="lazy"
          />
          {value.caption && (
            <figcaption
              style={{
                marginTop: 'var(--space-xs)',
                fontSize: '0.85rem',
                opacity: 0.7,
                textAlign: 'center',
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // Callout box with optional big number/stat
    callout: ({ value }) => {
      // If it has a number, render the full callout with number + text
      if (value.number) {
        return (
          <div className="callout">
            <div className="callout__number">{value.number}</div>
            <div className="callout__text">{value.text}</div>
          </div>
        );
      }

      // Fallback: simple bordered callout without number
      const typeStyles: Record<string, string> = {
        info: 'var(--bg-blue)',
        warning: 'var(--bg-accent)',
        tip: 'var(--bg-green)',
      };
      const borderColor = typeStyles[value.type] || typeStyles.info;
      return (
        <div
          style={{
            borderLeft: `4px solid ${borderColor}`,
            padding: 'var(--space-sm) var(--space-md)',
            margin: 'var(--space-lg) 0',
            borderRadius: '0 8px 8px 0',
            background: 'var(--bg-secondary)',
          }}
        >
          <p>{value.text}</p>
        </div>
      );
    },

    // Pull quote
    pullQuote: ({ value }) => (
      <blockquote
        style={{
          borderLeft: '4px solid var(--bg-accent)',
          padding: 'var(--space-sm) var(--space-md)',
          margin: 'var(--space-lg) 0',
          fontFamily: 'var(--font-serif)',
          fontSize: '1.3rem',
          fontStyle: 'italic',
        }}
      >
        <p>&ldquo;{value.text}&rdquo;</p>
        {value.attribution && (
          <footer style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: 'var(--space-xs)' }}>
            &mdash; {value.attribution}
          </footer>
        )}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

interface PortableTextRendererProps {
  value: any;
}

export default function PortableTextRenderer({ value }: PortableTextRendererProps) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
