'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Globe,
  GraduationCap,
  Heart,
  Lightbulb,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const values = [
  {
    icon: Heart,
    title: 'Student First',
    description:
      "Every decision we make starts with what's best for our learners' growth and success.",
    color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We continuously evolve our platform with cutting-edge technology and teaching methods.',
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description:
      'Quality education should be available to everyone, regardless of location or background.',
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    icon: Zap,
    title: 'Excellence',
    description:
      'We maintain the highest standards in course content, instruction, and student experience.',
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
  },
];

const milestones = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'Apna Campus was founded with a vision to democratize IT education in Pakistan.',
  },
  {
    year: '2021',
    title: 'First 1,000 Students',
    description: 'Reached our first milestone of 1,000 enrolled students across 15 courses.',
  },
  {
    year: '2022',
    title: 'Platform Launch',
    description: 'Launched our full-featured LMS platform with live classes and assessments.',
  },
  {
    year: '2023',
    title: 'Community Growth',
    description: 'Grew to 10,000+ students with partnerships across leading tech companies.',
  },
  {
    year: '2024',
    title: 'Certification Program',
    description: 'Introduced industry-recognized certification programs and career services.',
  },
  {
    year: '2025',
    title: '15K+ Learners',
    description: 'Serving 15,000+ active learners with 120+ courses and 50+ expert instructors.',
  },
];

const team = [
  {
    name: 'Muhammad Zeeshan',
    role: 'Founder & CEO',
    bio: 'Full-stack engineer with a passion for making education accessible through technology.',
    avatar: 'MZ',
  },
  {
    name: 'Ayesha Malik',
    role: 'Head of Academics',
    bio: 'Former professor with 10+ years designing curricula for top universities.',
    avatar: 'AM',
  },
  {
    name: 'Usman Ali',
    role: 'Lead Instructor',
    bio: 'Senior software engineer at a FAANG company, dedicated to mentoring the next generation.',
    avatar: 'UA',
  },
  {
    name: 'Hira Fatima',
    role: 'Student Success Manager',
    bio: 'Ensures every learner gets the support they need to achieve their goals.',
    avatar: 'HF',
  },
];

const achievements = [
  { value: '15K+', label: 'Students Enrolled', icon: GraduationCap },
  { value: '120+', label: 'Courses Offered', icon: BookOpen },
  { value: '50+', label: 'Expert Instructors', icon: Users },
  { value: '98%', label: 'Completion Rate', icon: Trophy },
];

export default function AboutPage(props) {
  return (
    <div className='overflow-hidden'>
      {/* ── Hero Section ── */}
      <section className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28'>
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute top-0 right-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl' />
          <div className='absolute bottom-0 left-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl' />
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
            <Target size={16} />
            <span>Our Story</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white'
          >
            Empowering Learners,{' '}
            <span className='bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent'>
              One Course at a Time
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed'
          >
            We&apos;re on a mission to make high-quality IT education accessible, engaging, and
            affordable for everyone worldwide. We believe that the right education can transform
            lives.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className='bg-gray-50 dark:bg-gray-900/50 py-20 sm:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
            className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16'
          >
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className='bg-white dark:bg-gray-800/50 rounded-2xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700/50'
            >
              <div className='inline-flex p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6'>
                <Target size={28} />
              </div>
              <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                Our Mission
              </h2>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-lg'>
                To redefine online IT education by combining expert instruction with an interactive
                and adaptive platform that supports learners of all backgrounds. We strive to bridge
                the gap between traditional education and real-world industry needs.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className='bg-white dark:bg-gray-800/50 rounded-2xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700/50'
            >
              <div className='inline-flex p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6'>
                <Award size={28} />
              </div>
              <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                Our Vision
              </h2>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed text-lg'>
                To become the leading educational platform in South Asia, empowering millions of
                learners with the skills and knowledge they need to succeed in the digital economy
                and shape the future of technology.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28'>
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
            Our Core <span className='text-indigo-600'>Values</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'
          >
            The principles that guide everything we do at Apna Campus.
          </motion.p>
        </motion.div>

        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={staggerContainer}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className='text-center p-8 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
            >
              <div className={`inline-flex p-4 rounded-2xl ${value.color} mb-5`}>
                <value.icon size={28} />
              </div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                {value.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Timeline ── */}
      <section className='bg-gray-50 dark:bg-gray-900/50 py-20 sm:py-28'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
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
              Our <span className='text-indigo-600'>Journey</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
            className='relative'
          >
            <div className='absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-indigo-200 dark:bg-indigo-800 sm:-translate-x-0.5' />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className={`relative flex items-start gap-6 sm:gap-0 mb-12 last:mb-0 ${
                  index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                <div className='absolute left-4 sm:left-1/2 w-3 h-3 bg-indigo-600 rounded-full -translate-x-1.5 sm:-translate-x-1.5 mt-2 ring-4 ring-indigo-100 dark:ring-indigo-900' />
                <div
                  className={`ml-10 sm:ml-0 sm:w-1/2 ${
                    index % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'
                  }`}
                >
                  <span className='inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-full mb-2'>
                    {milestone.year}
                  </span>
                  <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                    {milestone.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 mt-1'>{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team Grid ── */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28'>
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
            Meet Our <span className='text-indigo-600'>Team</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='mt-4 text-lg text-gray-600 dark:text-gray-400'
          >
            The passionate people behind Apna Campus.
          </motion.p>
        </motion.div>

        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={staggerContainer}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className='text-center bg-white dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
            >
              <div className='w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4'>
                {member.avatar}
              </div>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white'>{member.name}</h3>
              <p className='text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-3'>
                {member.role}
              </p>
              <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
                {member.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Achievements ── */}
      <section className='bg-gray-50 dark:bg-gray-900/50 py-20 sm:py-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={staggerContainer}
            className='grid grid-cols-2 lg:grid-cols-4 gap-8'
          >
            {achievements.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className='text-center p-8 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50'
              >
                <div className='inline-flex p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4'>
                  <stat.icon size={28} />
                </div>
                <div className='text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white'>
                  {stat.value}
                </div>
                <div className='mt-1 text-gray-600 dark:text-gray-400 font-medium'>
                  {stat.label}
                </div>
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
              Join Our Community of Learners
            </h2>
            <p className='text-lg text-indigo-100 max-w-2xl mx-auto mb-8'>
              Be part of a growing community of 15,000+ students building their futures with Apna
              Campus.
            </p>
            <Link
              href='/register'
              className='inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5'
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
