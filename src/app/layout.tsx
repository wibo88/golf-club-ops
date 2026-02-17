import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import './globals.css';

const FAVICON_SVG = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'><path fill='%23FF5700' d='M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24z'/></svg>`;

export const metadata: Metadata = {
  title: {
    default: 'Golf Club Ops — The No-BS Guide to Running a Modern Golf Club',
    template: '%s | Golf Club Ops',
  },
  description:
    'Honest, practical intelligence for golf club operators. Operations breakdowns, technology reviews, membership strategy, and revenue insights — written by people who\'ve actually been inside a clubhouse.',
  metadataBase: new URL('https://www.golfclubops.com'),
  openGraph: {
    type: 'website',
    siteName: 'Golf Club Ops',
    images: ['/images/Golf_Club_Operations_2026-1.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: FAVICON_SVG,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-next-pathname') || '';
  const isStudio = pathname.startsWith('/studio');

  if (isStudio) {
    return (
      <html lang="en">
        <body style={{ margin: 0 }}>{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
