import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import NavbarMobile from './components/NavbarMobile';
import PaperclipCursor from './components/PaperclipCursor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Paperclip',
  description: 'Paperclip',
  verification: {
    google: 'iYKTFfiq7i4ZJOVTE4IO6zO7PpLc_4M6agNKoEDBBrY',
  },
};

const poppins = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className='hidden md:block'>
          <Navbar
            showNavLinks={false}
            customStyle='w-[361px] 3xl-custom:w-[600px] md:w-[564px] absolute top-10 left-1/2 transform -translate-x-1/2'
          />
        </div>

        <div className='block md:hidden'>
          <NavbarMobile />
        </div>

        {children}
      </body>
    </html>
  );
}
