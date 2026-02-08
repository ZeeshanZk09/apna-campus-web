"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Our team will respond within 24 hours.",
    details: ["support@apnacampus.com", "info@apnacampus.com"],
    color:
      "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Available Monday to Friday, 9 AM — 6 PM.",
    details: ["+92 (300) 000-0000", "+92 (321) 000-0000"],
    color:
      "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come say hello at our campus office.",
    details: ["123 Learning Lane, Education City", "Islamabad, Pakistan"],
    color:
      "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    icon: Clock,
    title: "Office Hours",
    description: "We're open during these times.",
    details: ["Mon – Fri: 9:00 AM – 6:00 PM", "Sat: 10:00 AM – 2:00 PM"],
    color:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

const faqs = [
  {
    q: "How long does it take to get a response?",
    a: "We typically respond to all inquiries within 24 business hours.",
  },
  {
    q: "Can I schedule a campus tour?",
    a: "Yes! Contact us via email or phone to schedule a personalized tour.",
  },
  {
    q: "Do you offer technical support?",
    a: "Our tech support team is available 24/7 for enrolled students via the dashboard.",
  },
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function ContactPage(_props) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8"
          >
            <MessageCircle size={16} />
            <span>We&apos;d love to hear from you</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"
          >
            Get in{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Have a question or feedback? Our team is always here to help you
            succeed.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Contact Methods Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {contactMethods.map((method) => (
            <motion.div
              key={method.title}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex p-3 rounded-xl ${method.color} mb-4`}
              >
                <method.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {method.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {method.description}
              </p>
              {method.details.map((detail) => (
                <p
                  key={detail}
                  className="text-sm text-gray-700 dark:text-gray-300 font-medium"
                >
                  {detail}
                </p>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Contact Form + Map ── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          >
            {/* Form */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Fill out the form and we&apos;ll get back to you as soon as
                possible.
              </p>

              {submitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
                  <CheckCircle
                    size={48}
                    className="mx-auto mb-4 text-green-500"
                  />
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right side — FAQ Preview */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Frequently Asked
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Quick answers to common questions.
              </p>

              <div className="space-y-4 mb-10">
                {faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700/50"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {faq.q}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/faqs"
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-3 transition-all"
              >
                View all FAQs <ArrowRight size={16} />
              </Link>

              {/* Social Links */}
              <div className="mt-12">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
