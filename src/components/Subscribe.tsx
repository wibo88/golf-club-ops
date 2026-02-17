interface SubscribeProps {
  formspreeId?: string;
}

export default function Subscribe({ formspreeId = 'xnjbvgvq' }: SubscribeProps) {
  return (
    <section className="subscribe">
      <div className="subscribe__decoration">
        <div className="subscribe__hole"></div>
        <div className="subscribe__hole"></div>
        <div className="subscribe__hole"></div>
      </div>
      <div className="subscribe__content">
        <div>
          <h2 className="subscribe__headline">Get the good stuff, monthly.</h2>
          <p className="subscribe__body" style={{ marginTop: '16px' }}>
            One email per month. The latest articles, the sharpest insights, and the occasional
            number that will make you look at your own processes differently. No spam, no sales
            pitches, no attachments that require a webinar to open.
          </p>
        </div>
        <form
          className="subscribe__form"
          action={`https://formspree.io/f/${formspreeId}`}
          method="POST"
        >
          <input
            type="email"
            name="email"
            className="subscribe__input"
            placeholder="Your email address"
            required
          />
          <button type="submit" className="subscribe__button">
            Subscribe
          </button>
        </form>
        <p className="subscribe__micro">
          Free. Monthly. Unsubscribe whenever you like. We&rsquo;re not going to make it weird.
        </p>
      </div>
      <div className="subscribe__decoration subscribe__decoration--right">
        <div className="subscribe__hole"></div>
        <div className="subscribe__hole"></div>
        <div className="subscribe__hole"></div>
      </div>
    </section>
  );
}
