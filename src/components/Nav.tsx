import Link from 'next/link';
import HamburgerMenu from './HamburgerMenu';
import ThemeToggle from './ThemeToggle';

interface NavLink {
  label: string;
  href: string;
  colorClass: string;
}

interface NavProps {
  links?: NavLink[];
}

const defaultLinks: NavLink[] = [
  { label: 'Home', href: '/', colorClass: 'nav__link--orange' },
  { label: 'Articles', href: '/articles', colorClass: 'nav__link--green' },
  { label: 'About', href: '/about', colorClass: 'nav__link--blue' },
  { label: 'Newsletter', href: '/newsletter', colorClass: 'nav__link--yellow' },
];

export default function Nav({ links = defaultLinks }: NavProps) {
  return (
    <div className="nav-wrapper">
      <nav className="nav">
        <Link href="/" className="nav__logo">
          Golf Club Ops
        </Link>
        <HamburgerMenu>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`nav__link ${link.colorClass}`}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </HamburgerMenu>
      </nav>
    </div>
  );
}
