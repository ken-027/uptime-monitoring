import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import NavBarLayout from '@/components/client/common/layout/navbar.layout';

export const metadata: Metadata = {
  title: 'Uptime Monitoring – Website Health Checker',
  description:
    'Track and monitor your website’s uptime and performance. Get instant alerts and insights when your services go down.',
  metadataBase: new URL('https://uptime-monitoring.ksoftdev.site'),
  openGraph: {
    title: 'Uptime Monitoring – Website Health Checker',
    description:
      'Track and monitor your website’s uptime and performance. Get instant alerts and insights when your services go down.',
    url: 'https://uptime-monitoring.ksoftdev.site',
    siteName: 'Uptime Monitoring',
    images: [
      {
        url: '/og-image.png',
        width: 1668,
        height: 996,
        alt: 'Uptime Monitoring – Website Health Checker',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uptime Monitoring – Website Health Checker',
    description:
      'Track and monitor your website’s uptime and performance. Get instant alerts and insights when your services go down.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/uptime-logo.svg',
  },
  themeColor: '#0f172a',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/uptime-logo.svg" sizes="any" />
      </head>
      <body className={`antialiased p-4 max-w-[2000px] mx-auto`}>
        <AntdRegistry>
          <NavBarLayout />
        </AntdRegistry>
        {children}
        <footer className="text-center text-xs text-gray-400 mt-10 mb-4">
          ⚠️ This project is a functional prototype created for demonstration purposes and portfolio
          showcasing. While you’re free to explore and test it, it’s not intended for long-term or
          production use.
        </footer>
      </body>
    </html>
  );
}
