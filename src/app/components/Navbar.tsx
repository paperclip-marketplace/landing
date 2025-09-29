import Image from 'next/image';
import { paperclipLogoSmall } from '@/utils/assets';
import Link from 'next/link';
import { navLinks } from '@/constants/data';

export default function Navbar({
  customStyle,
  showNavLinks,
}: {
  customStyle?: string;
  showNavLinks: boolean;
}) {
  return (
    <nav
      className={`flex items-center justify-between px-3 3xl-custom:py-4 py-2 shadow-soft bg-white rounded-[100px] z-50 mx-auto ${
        customStyle ?? ''
      }`}
    >
      {/* Logo */}
      <Link href={'/'}>
        <div className='flex items-center'>
          <Image
            src={paperclipLogoSmall}
            alt='Paperclip Logo'
            width={120}
            height={40}
          />
        </div>
      </Link>

      {/* Navigation Links */}
      <div className='flex items-center space-x-1 mx-2 md:mx-6 font-poppins font-bold text-[14px] leading-[16px] text-gray-700'>
        {showNavLinks &&
          navLinks.map((navLink) => (
            <Link
              key={navLink.title}
              href={navLink.path}
              target='_blank'
              className='px-2'
            >
              {navLink.title}
            </Link>
          ))}
      </div>

      {/* Marketplace Link */}
      <Link href={'/marketplace'}>
        <div className='flex items-center space-x-2 bg-[#FFF2F3] px-3 py-1 rounded-[100px] font-poppins font-bold text-[14px] leading-[16px] mr-2'>
          <span className='text-gray-700 font-semibold'>Shop</span>
        </div>
      </Link>

      {/* Pro Badge */}
      <Link href={'/get-started'}>
        <div className='flex items-center space-x-2 bg-[#FFF2F3] px-3 py-1 rounded-[100px] font-poppins font-bold text-[14px] leading-[16px]'>
          <span className='text-gray-700 font-semibold'>Pro</span>
          <span className='bg-[#F71D3B] text-white px-2 py-0.5 rounded-md text-xs font-bold'>
            FREE
          </span>
        </div>
      </Link>
    </nav>
  );
}
