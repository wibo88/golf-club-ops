import PortableTextRenderer from './PortableTextRenderer';
import Subscribe from './Subscribe';
import { urlFor } from '@/lib/sanity.image';

interface ContentSection {
  _type: 'contentSection';
  _key: string;
  label?: string;
  body?: any[];
  image?: any;
  imagePath?: string;
  imageCaption?: string;
  imagePosition?: 'left' | 'right';
}

interface SubscribeSection {
  _type: 'subscribeSection';
  _key: string;
  enabled: boolean;
}

type Section = ContentSection | SubscribeSection;

function ContentSectionBlock({ section }: { section: ContentSection }) {
  const imageUrl = section.image
    ? urlFor(section.image).width(800).quality(80).url()
    : section.imagePath || null;

  const imageAlt = section.image?.alt || 'Section image';
  const imageCaption = section.image?.caption || section.imageCaption || null;
  const isImageLeft = section.imagePosition === 'left';

  const textContent = (
    <div style={{ paddingRight: isImageLeft ? undefined : 'var(--space-lg)', paddingLeft: isImageLeft ? 'var(--space-lg)' : undefined }}>
      {section.label && (
        <span
          className="section-label"
          style={{ marginBottom: 'var(--space-md)', display: 'inline-block' }}
        >
          {section.label}
        </span>
      )}
      {section.body && (
        <div className="content-section__body">
          <PortableTextRenderer value={section.body} />
        </div>
      )}
    </div>
  );

  const imageContent = imageUrl ? (
    <div>
      <img
        src={imageUrl}
        alt={imageAlt}
        style={{
          width: '100%',
          borderRadius: '8px',
          objectFit: 'cover',
          aspectRatio: '4/3',
        }}
      />
      {imageCaption && (
        <p
          style={{
            marginTop: 'var(--space-xs)',
            fontSize: '0.85rem',
            opacity: 0.7,
            textAlign: 'center',
          }}
        >
          {imageCaption}
        </p>
      )}
    </div>
  ) : null;

  return (
    <section className="content-section">
      <div className="content-section__grid content-section__grid--with-image">
        {isImageLeft ? (
          <>
            {imageContent}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {imageContent}
          </>
        )}
      </div>
    </section>
  );
}

export default function PageSectionRenderer({
  sections,
  formspreeId,
}: {
  sections: Section[];
  formspreeId?: string;
}) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'contentSection':
            return <ContentSectionBlock key={section._key} section={section as ContentSection} />;
          case 'subscribeSection':
            if ((section as SubscribeSection).enabled) {
              return <Subscribe key={section._key} formspreeId={formspreeId} />;
            }
            return null;
          default:
            return null;
        }
      })}
    </>
  );
}
