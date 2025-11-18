'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/ThemeChanger';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function About() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  return (
    <div
      className={`${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }  max-w-7xl space-y-10 sm:mx-auto px-4 sm:px-6 lg:px-8  text-gray-200`}
    >
      {/* Hero */}
      <section
        className={`flex flex-col sm:flex-row smm:gap-2 sm:justify-between items-center min-h-[78vh] rounded-2xl ${
          isDarkMode
            ? 'bg-white/6 backdrop-blur border border-white/8'
            : 'bg-black/6 backdrop-blur border border-black/8'
        } px-4 sm:px-16 mt-2 shadow-lg`}
      >
        <div className='md:h-[70vh] flex flex-col gap-2 sm:justify-between items-start'>
          <div className='flex flex-col gap-4'>
            <motion.h1
              className='text-4xl font-bold'
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Empowering Learners, One Course at a Time
            </motion.h1>
            <p className='text-lg sm:max-w-md'>
              Our mission is to make high-quality IT education accessible, engaging, and affordable
              for everyone worldwide.
            </p>
          </div>
          <button
            className={`
             inline-flex items-center justify-center rounded-md border border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300
            `}
            type='button'
            onClick={() => router.push('/courses')}
          >
            Explore courses
          </button>
        </div>
        <Image
          className='aspect-square w-full sm:w-2/5  object-cover rounded-2xl shadow-lg'
          src={'/images/course_8.jpg'}
          alt='About Image'
          loading='lazy'
          width={200}
          height={200}
        />
      </section>

      {/* Mission */}
      <section
        className={`flex flex-col sm:flex-row justify-between items-center min-h-[80vh] rounded-2xl ${
          isDarkMode
            ? 'bg-white/6 backdrop-blur border border-white/8'
            : 'bg-black/6 backdrop-blur border border-black/8'
        } px-4 py-6 sm:px-16 mt-2 shadow-lg`}
      >
        <h2 className='text-3xl font-semibold mb-4'>Our Mission</h2>
        <p className='text-gray-600 max-w-3xl mx-auto'>
          We are redefining online IT education by combining expert instruction with an interactive
          and adaptive platform that supports learners of all backgrounds.
        </p>
      </section>

      {/* Stats */}
      <section className='bg-gray-50 py-16'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
          {[
            { label: 'Students Enrolled', value: '15K+' },
            { label: 'Courses Available', value: '120+' },
            { label: 'Instructors', value: '50+' },
          ].map((stat) => (
            <div key={stat.label}>
              <h3 className='text-4xl font-bold text-indigo-600'>{stat.value}</h3>
              <p className='text-gray-600'>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='text-center py-20'>
        <h2 className='text-2xl font-semibold mb-4'>Join our community of learners</h2>
        <button className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition'>
          Get Started
        </button>
      </section>
    </div>
  );
}
