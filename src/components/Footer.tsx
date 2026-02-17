import Link from 'next/link';

interface FooterProps {
  footerText?: string;
}

export default function Footer({
  footerText = 'Independent. Unaffiliated. Occasionally irreverent.',
}: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <span>Golf Club</span>
        <br />
        <span>Ops</span>
      </div>
      <div className="footer__content">
        <div className="footer__links">
          <div>
            <span className="footer__col-label">Links</span>
            <div className="footer__col-links">
              <Link href="/">Home</Link>
              <Link href="/articles">Articles</Link>
              <Link href="/about">About</Link>
              <Link href="/newsletter">Newsletter</Link>
            </div>
          </div>
          <div>
            <span className="footer__col-label">Connect</span>
            <div className="footer__col-links">
              <a href="mailto:hello@golfclubops.com">Email</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Golf Club Ops</p>
          <p>{footerText}</p>
        </div>
      </div>
    </footer>
  );
}
