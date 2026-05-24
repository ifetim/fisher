import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import { Providers } from '@/components/Providers';
import './globals.css';
import '@/styles/clearmint-v3.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StudentSaver - Stop Overpaying on Campus',
  description: 'Find cheaper food near your university and track your spending habits.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}