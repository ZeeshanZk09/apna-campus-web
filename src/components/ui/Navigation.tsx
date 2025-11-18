'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/ThemeChanger';
import { motion } from 'framer-motion';

export interface NavLinksType {
  id: number;
  label: string;
  path: string;
}

export const navLinksDataMobile: NavLinksType[] = [
  { id: 0, label: 'Home', path: '/' },
  { id: 1, label: 'About', path: '/about' },
  { id: 2, label: 'Testimonials', path: '/testimonials' },
  { id: 3, label: 'FAQs', path: '/faqs' },
  { id: 4, label: 'Contact', path: '/contact' },
  { id: 5, label: 'login', path: '/login' },
  { id: 6, label: 'register', path: '/register' },
];

export const navLinksDataWeb: NavLinksType[] = [
  { id: 0, label: 'Home', path: '/' },
  { id: 1, label: 'About', path: '/about' },
  { id: 2, label: 'Testimonials', path: '/testimonials' },
  { id: 3, label: 'FAQs', path: '/faqs' },
  { id: 4, label: 'Contact', path: '/contact' },
];

export default function Navigation() {
  const { isDarkMode } = useTheme();
  const pathName = usePathname();

  return (
    <nav className='flex gap-8 items-end bg-transparent'>
      {navLinksDataWeb.map(({ id, label, path }) => {
        const isActive = pathName === path;

        return (
          <motion.div
            key={isActive ? `${path}-bounce` : `${path}`}
            animate={isActive ? { y: [0, -6, 0] } : {}}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Link
              key={id}
              href={path}
              className={`relative text-[1.1rem] transition-colors duration-300 no-underline
                ${
                  isDarkMode
                    ? isActive
                      ? 'text-[#00ffea] [text-shadow:_0_0_5px_#00ffea,_0_0_10px_#00ffea]'
                      : 'text-[#bbb] hover:text-white'
                    : isActive
                    ? 'text-[#081015]'
                    : 'text-[#707070] hover:text-black'
                }
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-[#00ffea]
                after:w-0 hover:after:w-full after:transition-all after:duration-300
              `}
            >
              {label}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
