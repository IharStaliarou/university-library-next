import type { Metadata } from 'next';
import { IBM_Plex_Sans, Bebas_Neue } from 'next/font/google';

import './globals.css';
import { ReactNode } from 'react';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  weight: ['400', '500', '600', '700'],
  style: 'normal',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  weight: '400',
  style: 'normal',
});

export const metadata: Metadata = {
  title: 'University Library',
  description: 'Your world of books',
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang='en'>
      <body
        className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
