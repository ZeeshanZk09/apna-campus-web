"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  CreditCard,
  HelpCircle,
  Laptop,
  Lock,
  MessageCircle,
  Search,
  Shield,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  icon: typeof UserCircle;
  color: string;
  faqs: FAQ[];
}

const categories: FAQCategory[] = [
  {
    name: "Account & Registration",
    icon: UserCircle,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          'Click the "Register" button on the homepage, fill in your details, verify your email address, and you\'re all set to start learning.',
      },
      {
        question: "Can I change my email address after registration?",
        answer:
          "Yes, go to Settings → Profile in your dashboard and update your email. You'll need to verify the new email address.",
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer:
          'Click "Forgot Password" on the login page, enter your registered email, and follow the link sent to your inbox to create a new password.',
      },
      {
        question: "Can I have multiple accounts?",
        answer:
          "Each person should have one account. Multiple accounts may be suspended. If you need to change your account type, contact support.",
      },
    ],
  },
  {
    name: "Payments & Billing",
    icon: CreditCard,
    color:
      "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept credit/debit cards (Visa, Mastercard), JazzCash, EasyPaisa, and bank transfers for Pakistani users. International payments via Stripe.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Yes, we offer a 7-day money-back guarantee for all paid courses. If you're not satisfied, contact support within 7 days of purchase.",
      },
      {
        question: "Are there any free courses available?",
        answer:
          "Absolutely! We offer several free introductory courses across various disciplines. Look for the 'Free' badge on the courses page.",
      },
      {
        question: "Do you offer installment plans?",
        answer:
          "Yes, for courses above a certain price point, we offer 2-4 month installment plans with no additional fees.",
      },
    ],
  },
  {
    name: "Course Access & Content",
    icon: Laptop,
    color:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
    faqs: [
      {
        question: "How long do I have access to a course?",
        answer:
          "Once enrolled, you have lifetime access to the course content, including any future updates made by the instructor.",
      },
      {
        question: "Can I download course materials?",
        answer:
          "Most course resources (PDFs, slides, code files) are downloadable. Video lectures are available for streaming only.",
      },
      {
        question: "Do I get a certificate after completing a course?",
        answer:
          "Yes! Upon completing all modules and passing the final assessment, you receive a verified digital certificate you can share on LinkedIn.",
      },
      {
        question: "Can I access courses on mobile?",
        answer:
          "Yes, our platform is fully responsive. You can learn on any device — phone, tablet, or desktop browser.",
      },
    ],
  },
  {
    name: "Technical Support",
    icon: Shield,
    color:
      "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
    faqs: [
      {
        question: "Video is not playing. What should I do?",
        answer:
          "Try clearing your browser cache, disabling extensions, or switching to a different browser. If the issue persists, contact our tech support.",
      },
      {
        question: "What browsers are supported?",
        answer:
          "We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend Chrome.",
      },
      {
        question: "I'm experiencing slow loading times.",
        answer:
          "Check your internet connection speed. For video lectures, we recommend at least 5 Mbps. Try lowering the video quality in the player settings.",
      },
    ],
  },
  {
    name: "Certificates & Verification",
    icon: Lock,
    color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
    faqs: [
      {
        question: "Are the certificates recognized?",
        answer:
          "Our certificates are industry-recognized and can be shared on LinkedIn, added to your resume, and verified by employers through our verification portal.",
      },
      {
        question: "How can an employer verify my certificate?",
        answer:
          "Each certificate has a unique verification ID. Employers can visit our verification page and enter the ID to confirm its authenticity.",
      },
      {
        question: "Can I get a physical certificate?",
        answer:
          "Currently we issue digital certificates. Physical certificates may be available for premium programs — check with support for details.",
      },
    ],
  },
];

function FAQAccordion({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 dark:border-gray-700/50 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white pr-4">
          {faq.question}
        </span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-white dark:bg-gray-800/50">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQsPage(_props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (faq) =>
          searchQuery === "" ||
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter(
      (cat) =>
        cat.faqs.length > 0 && (!activeCategory || cat.name === activeCategory),
    );

  const totalFaqs = categories.reduce((sum, cat) => sum + cat.faqs.length, 0);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8"
          >
            <HelpCircle size={16} />
            <span>{totalFaqs} answers to your questions</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          >
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-400"
          >
            Find quick answers to the most common questions about our platform.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 relative max-w-xl mx-auto"
          >
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a question..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white text-lg transition-all shadow-sm"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Category Tabs ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === null
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : "bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.name}
              onClick={() =>
                setActiveCategory(activeCategory === cat.name ? null : cat.name)
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.name
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              }`}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQ Content ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            <Search
              size={48}
              className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try a different search term or browse all categories.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            {filteredCategories.map((category) => (
              <motion.div
                key={category.name}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`inline-flex p-2 rounded-lg ${category.color}`}
                  >
                    <category.icon size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.name}
                  </h2>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    ({category.faqs.length})
                  </span>
                </div>
                <div className="space-y-3">
                  {category.faqs.map((faq) => (
                    <FAQAccordion key={faq.question} faq={faq} />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Contact CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
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
          </div>
          <div className="relative">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-80" />
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-indigo-100 max-w-xl mx-auto mb-8">
              Can&apos;t find what you&apos;re looking for? Our support team is
              here to help you out.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Contact Support <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
