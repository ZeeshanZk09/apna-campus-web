'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  Quote,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

type Category = 'All' | 'Career Change' | 'Skill Building' | 'Student' | 'Professional';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
  category: Category;
  courseTaken: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Ahmed',
    role: 'Software Engineer',
    company: 'TechVentures',
    avatar: 'SA',
    quote:
      'Apna Campus completely transformed my career trajectory. I went from a non-tech background to landing a software engineering role within 6 months. The project-based curriculum was incredibly practical.',
    rating: 5,
    category: 'Career Change',
    courseTaken: 'Full-Stack Development',
  },
  {
    name: 'Ali Hassan',
    role: 'Data Scientist',
    company: 'FinTech Corp',
    avatar: 'AH',
    quote:
      'The data science track at Apna Campus is world-class. The instructors are industry professionals who bring real-world problems into the classroom. I highly recommend it to anyone looking to break into data science.',
    rating: 5,
    category: 'Professional',
    courseTaken: 'Data Science & ML',
  },
  {
    name: 'Fatima Khan',
    role: 'UI/UX Designer',
    company: 'DesignHub',
    avatar: 'FK',
    quote:
      'As a working professional, the flexible schedule was a game-changer. I could study at my own pace while maintaining my job. The mentorship support was incredible and always available when I needed guidance.',
    rating: 5,
    category: 'Skill Building',
    courseTaken: 'UI/UX Design',
  },
  {
    name: 'Usman Malik',
    role: 'CS Student',
    company: 'FAST University',
    avatar: 'UM',
    quote:
      'The courses here complement my university education perfectly. The hands-on projects gave me practical skills that set me apart during internship interviews. Got placed at a top company!',
    rating: 5,
    category: 'Student',
    courseTaken: 'Python Programming',
  },
  {
    name: 'Hira Fatima',
    role: 'Product Manager',
    company: 'StartupPK',
    avatar: 'HF',
    quote:
      'I took the product management course to upskill and it exceeded my expectations. The case studies were from real companies and the peer community is incredibly supportive and collaborative.',
    rating: 5,
    category: 'Professional',
    courseTaken: 'Product Management',
  },
  {
    name: 'Bilal Raza',
    role: 'Freelance Developer',
    company: 'Self-Employed',
    avatar: 'BR',
    quote:
      'After completing the web development track, I started freelancing and now earn more than my previous full-time job. The certificate from Apna Campus gave me credibility with international clients.',
    rating: 5,
    category: 'Career Change',
    courseTaken: 'Web Development',
  },
  {
    name: 'Ayesha Siddiqui',
    role: 'Machine Learning Engineer',
    company: 'AI Solutions',
    avatar: 'AS',
    quote:
      'The depth of the machine learning curriculum is impressive. From basic statistics to deploying production models, every aspect was covered. The instructors are truly passionate about teaching.',
    rating: 5,
    category: 'Skill Building',
    courseTaken: 'Machine Learning',
  },
  {
    name: 'Zain Ahmed',
    role: 'IT Student',
    company: 'COMSATS University',
    avatar: 'ZA',
    quote:
      'Apna Campus helped me build a strong portfolio before graduating. The projects I completed here became talking points in every job interview. Highly recommend to all students!',
    rating: 4,
    category: 'Student',
    courseTaken: 'Mobile App Development',
  },
  {
    name: 'Nadia Pervez',
    role: 'Digital Marketer',
    company: 'GrowthLab',
    avatar: 'NP',
    quote:
      'I transitioned from teaching to digital marketing through Apna Campus. The supportive community and structured learning path made the switch much smoother than I expected.',
    rating: 5,
    category: 'Career Change',
    courseTaken: 'Digital Marketing',
  },
];

const filterCategories: Category[] = [
  'All',
  'Career Change',
  'Skill Building',
  'Student',
  'Professional',
];

const stats = [
  { value: '4.9/5', label: 'Average Rating', icon: Star },
  { value: '15K+', label: 'Happy Students', icon: Users },
  { value: '95%', label: 'Would Recommend', icon: Heart },
  { value: '89%', label: 'Career Impact', icon: TrendingUp },
];

const successStories = [
  {
    icon: Briefcase,
    title: 'Career Changers',
    stat: '73%',
    description: 'of career changers landed a new role within 6 months of completing their course.',
  },
  {
    icon: TrendingUp,
    title: 'Salary Increase',
    stat: '45%',
    description: 'average salary increase reported by graduates within their first year.',
  },
  {
    icon: Award,
    title: 'Certifications',
    stat: '12K+',
    description: 'verified certificates awarded to successful graduates across all programs.',
  },
];

export default function TestimonialsPage(props) {
  const [activeFilter, setActiveFilter] = useState<Category>('All');

  const filteredTestimonials =
    activeFilter === 'All' ? testimonials : testimonials.filter((t) => t.category === activeFilter);

  return (
    <div className='overflow-hidden'>
      {/* ── Hero ── */}
      <section className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24'>
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl' />
          <div className='absolute bottom-0 right-1/3 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl' />
        </div>

        <motion.div
          initial='hidden'
          animate='visible'
          variants={staggerContainer}
          className='text-center max-w-4xl mx-auto'
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8'
          >
            <MessageCircle size={16} />
            <span>Real stories from real learners</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white'
          >
            Student{' '}
            <span className='bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent'>
              Success Stories
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'
          >
            Discover how Apna Campus has helped thousands of learners transform their careers and
            achieve their goals.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Rating Summary ── */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={staggerContainer}
          className='grid grid-cols-2 lg:grid-cols-4 gap-6'
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className='text-center p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50'
            >
              <div className='inline-flex p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-3'>
                <stat.icon size={24} />
              </div>
              <div className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white'>
                {stat.value}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Filters ── */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8'>
        <div className='flex flex-wrap items-center justify-center gap-3'>
          {filterCategories.map((category) => (
            <button
              type='button'
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === category
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* ── Testimonial Grid ── */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={staggerContainer}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
        >
          {filteredTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className='bg-white dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col'
            >
              <Quote size={32} className='text-indigo-200 dark:text-indigo-800 mb-4' />

              <div className='flex gap-1 mb-4'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`${testimonial.name}-star-${i}`}
                    size={16}
                    className={
                      i < testimonial.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200 dark:text-gray-700'
                    }
                  />
                ))}
              </div>

              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-6 flex-1 italic'>
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className='flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700/50'>
                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                  {testimonial.avatar}
                </div>
                <div className='min-w-0'>
                  <div className='font-semibold text-gray-900 dark:text-white truncate'>
                    {testimonial.name}
                  </div>
                  <div className='text-sm text-gray-500 dark:text-gray-400 truncate'>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>

              <div className='mt-4 inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full w-fit'>
                <GraduationCap size={12} />
                {testimonial.courseTaken}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTestimonials.length === 0 && (
          <div className='text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50'>
            <MessageCircle size={48} className='mx-auto mb-4 text-gray-300 dark:text-gray-600' />
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
              No testimonials in this category
            </h3>
            <p className='text-gray-500 dark:text-gray-400'>Try selecting a different filter.</p>
          </div>
        )}
      </section>

      {/* ── Success Stories ── */}
      <section className='bg-gray-50 dark:bg-gray-900/50 py-20 sm:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
            className='text-center mb-16'
          >
            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'
            >
              Impact by the <span className='text-indigo-600'>Numbers</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
            className='grid grid-cols-1 md:grid-cols-3 gap-8'
          >
            {successStories.map((story) => (
              <motion.div
                key={story.title}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className='text-center bg-white dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50'
              >
                <div className='inline-flex p-4 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4'>
                  <story.icon size={28} />
                </div>
                <div className='text-4xl font-extrabold text-gray-900 dark:text-white mb-2'>
                  {story.stat}
                </div>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                  {story.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
                  {story.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28'>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-12 sm:p-16 text-center text-white'
        >
          <div className='absolute top-0 left-0 w-full h-full opacity-10'>
            <div className='absolute top-10 left-10 w-40 h-40 border border-white/30 rounded-full' />
            <div className='absolute bottom-10 right-10 w-60 h-60 border border-white/20 rounded-full' />
          </div>
          <div className='relative'>
            <h2 className='text-3xl sm:text-4xl font-extrabold mb-4'>
              Ready to Write Your Success Story?
            </h2>
            <p className='text-lg text-indigo-100 max-w-2xl mx-auto mb-8'>
              Join thousands of learners who have already transformed their careers with Apna
              Campus. Your success story starts here.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link
                href='/register'
                className='inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5'
              >
                Start Learning Today <ArrowRight size={20} />
              </Link>
              <Link
                href='/courses'
                className='inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all'
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
