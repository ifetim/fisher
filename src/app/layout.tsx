import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudentSaver - Stop Overpaying on Campus',
  description: 'Find cheaper food near your university and track your spending habits.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}