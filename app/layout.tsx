import type { Metadata } from 'next';
import { Manrope, Newsreader } from 'next/font/google';
import { ElectricBackdrop } from '@/components/electric-backdrop';
import './globals.css';
import './animations.css';
import './flow-texture.css';
import './kintsugi.css';

const serif = Newsreader({ subsets: ['latin'], variable: '--font-serif' });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Website Project Studio — Intake',
  description: 'A premium website discovery, scoping, and project reservation experience.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        <ElectricBackdrop />
        {children}
      </body>
    </html>
  );
}
