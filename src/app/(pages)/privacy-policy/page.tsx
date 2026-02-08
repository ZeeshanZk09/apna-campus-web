import { Calendar, Mail, Shield } from "lucide-react";
import Link from "next/link";

const lastUpdated = "July 10, 2025";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "We collect information you provide directly to us, such as when you create an account, enroll in a course, make a purchase, participate in interactive features, contact us, or otherwise communicate with us.",
      "The types of information we may collect include: your name, email address, phone number, billing address, payment information, profile picture, and any other information you choose to provide.",
      "We automatically collect certain information when you use our platform, including your IP address, browser type, operating system, device identifiers, pages viewed, links clicked, and the date and time of your visit.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Your Information",
    content: [
      "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices, updates, security alerts, and support messages.",
      "We may use your information to personalize your learning experience, recommend courses, track your progress, and communicate with you about products, services, and events offered by us.",
      "We use analytics data to understand how our platform is used and to improve the overall user experience, ensuring our educational content remains relevant and effective.",
    ],
  },
  {
    id: "information-sharing",
    title: "3. Information Sharing",
    content: [
      "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:",
      "With instructors for courses you are enrolled in, so they can track your progress and provide feedback. With service providers who assist us in operating our platform (hosting, payment processing, analytics).",
      "When required by law or to protect the rights, property, or safety of Apna Campus, our users, or the public.",
    ],
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS/SSL) and at rest, secure password hashing, and access controls.",
      "While we strive to protect your personal information, no method of transmission over the Internet is 100% secure. We encourage you to use strong passwords and enable two-factor authentication on your account.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking Technologies",
    content: [
      "We use cookies and similar tracking technologies to collect and track information about your usage of our platform. Cookies help us remember your preferences, understand how you interact with our services, and improve your experience.",
      "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some features of our platform may not function properly.",
    ],
  },
  {
    id: "your-rights",
    title: "6. Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal information at any time through your account settings. You can also request a copy of all data we hold about you.",
      "You may opt out of receiving promotional communications from us by following the instructions in those messages. Even if you opt out, we may still send you non-promotional communications, such as transaction confirmations.",
      "If you are located in the EU/EEA, you may have additional rights under GDPR, including the right to data portability and the right to lodge a complaint with a supervisory authority.",
    ],
  },
  {
    id: "data-retention",
    title: "7. Data Retention",
    content: [
      "We retain your personal information for as long as your account is active or as needed to provide you services. We will also retain information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.",
      "If you close your account, we will delete or anonymize your personal data within 90 days, unless we are required to retain it for legal or legitimate business purposes.",
    ],
  },
  {
    id: "childrens-privacy",
    title: "8. Children's Privacy",
    content: [
      "Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected information from a child under 13, we will delete it promptly.",
      "For users between 13-18, we recommend parental supervision. Parents or guardians can create and manage accounts through our Parent Portal feature.",
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: [
      "We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last Updated' date.",
      "We encourage you to review this privacy policy periodically for any changes. Your continued use of our platform after we post any modifications constitutes your acknowledgment of the modifications.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      "If you have any questions about this Privacy Policy, please contact our Data Protection team at privacy@apnacampus.com or write to us at: Apna Campus, 123 Learning Lane, Education City, Islamabad, Pakistan.",
    ],
  },
];

export default function PrivacyPolicyPage(_props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* ── Header ── */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
          <Shield size={16} />
          <span>Your privacy matters</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
          <Calendar size={16} />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* ── Table of Contents ── */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="lg:col-span-3">
          {/* Summary Box */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-6 sm:p-8 mb-12">
            <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3">
              Policy Summary
            </h2>
            <p className="text-indigo-800 dark:text-indigo-300/80 leading-relaxed">
              At Apna Campus, we are committed to protecting your privacy. We
              collect only the information necessary to provide our educational
              services, we never sell your data to third parties, and we
              implement industry-standard security measures. You have full
              control over your data and can access, modify, or delete it at any
              time.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.map((paragraph) => (
                    <p
                      key={paragraph.substring(0, 50)}
                      className="text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Card */}
          <div className="mt-16 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="inline-flex p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                Questions about this policy?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Contact our data protection team at{" "}
                <Link
                  href="mailto:privacy@apnacampus.com"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  privacy@apnacampus.com
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
