"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Play,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description:
      "Learn from industry professionals with real-world experience and proven teaching methods.",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description:
      "Earn recognized certificates that boost your resume and validate your skills.",
    color:
      "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    icon: Users,
    title: "Active Community",
    description:
      "Join thousands of learners, share knowledge, collaborate on projects, and grow together.",
    color:
      "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description:
      "Access courses anytime, anywhere. Study on your schedule with lifetime access to content.",
    color:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Get career guidance, mentorship, and job placement support for your professional journey.",
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description:
      "All courses are reviewed and updated regularly to ensure the highest educational standards.",
    color:
      "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
];

const steps = [
  {
    step: "01",
    title: "Browse Courses",
    description:
      "Explore our diverse catalog of courses across multiple disciplines and skill levels.",
  },
  {
    step: "02",
    title: "Enroll & Learn",
    description:
      "Sign up for your chosen course and start learning with interactive content and projects.",
  },
  {
    step: "03",
    title: "Get Certified",
    description:
      "Complete assessments, earn your certificate, and showcase your achievements to the world.",
  },
];

const stats = [
  { value: "15K+", label: "Active Students", icon: GraduationCap },
  { value: "120+", label: "Courses Available", icon: BookOpen },
  { value: "50+", label: "Expert Instructors", icon: Users },
  { value: "95%", label: "Satisfaction Rate", icon: Star },
];

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Software Engineer",
    quote:
      "Apna Campus transformed my career. The courses are practical, well-structured, and the community support is amazing.",
    rating: 5,
    avatar: "SA",
  },
  {
    name: "Ali Hassan",
    role: "Data Analyst",
    quote:
      "The quality of instruction here rivals top universities. I landed my dream job after completing the data science track.",
    rating: 5,
    avatar: "AH",
  },
  {
    name: "Fatima Khan",
    role: "UI/UX Designer",
    quote:
      "Flexible learning at its best. I could study while working full-time and the mentors were always available to help.",
    rating: 5,
    avatar: "FK",
  },
];

export default function HomePage(_props) {
  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8"
          >
            <Sparkles size={16} />
            <span>Trusted by 15,000+ learners worldwide</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight"
          >
            <span className="block text-gray-900 dark:text-white">
              Unlock Your Future
            </span>
            <span className="block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mt-2">
              with Quality Learning
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Join a thriving community of learners. Master new skills with
            expert-led courses, hands-on projects, and industry-recognized
            certificates.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Explore Courses <ArrowRight size={20} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:-translate-y-0.5"
            >
              <Play size={20} className="text-indigo-600" /> Learn More
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-500 dark:text-gray-400"
          >
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> Free to start
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> No credit
              card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" /> Cancel
              anytime
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Why Choose <span className="text-indigo-600">Apna Campus</span>?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need for an exceptional learning experience, all in
            one platform.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="group relative p-8 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex p-3 rounded-xl ${feature.color} mb-5`}
              >
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            >
              Start Learning in{" "}
              <span className="text-indigo-600">3 Simple Steps</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="relative text-center"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-300 to-transparent dark:from-indigo-700" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-indigo-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-indigo-500/25">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-center p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
            >
              <div className="inline-flex p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
                <stat.icon size={28} />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="mt-1 text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
            >
              What Our <span className="text-indigo-600">Students Say</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-gray-600 dark:text-gray-400"
            >
              Hear from learners who transformed their careers with Apna Campus.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={`star-${testimonial.name}-${i}`}
                      size={18}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-12 sm:p-16 text-center text-white"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border border-white/30 rounded-full" />
            <div className="absolute bottom-10 right-10 w-60 h-60 border border-white/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full" />
          </div>

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
              Join thousands of learners who are already building their future
              with Apna Campus. Start learning today — it&apos;s free!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
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
