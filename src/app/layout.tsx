import type { Metadata } from 'next';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import NavBarLayout from '@/components/client/common/layout/navbar.layout';

export const metadata: Metadata = {
  title: 'Uptime Monitoring',
  description: 'where your sites check statuses',
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
