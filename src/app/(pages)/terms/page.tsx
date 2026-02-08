import { AlertTriangle, Calendar, FileText, Mail, Scale } from "lucide-react";
import Link from "next/link";

const lastUpdated = "July 10, 2025";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the Apna Campus platform ('Service'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to these terms, you should not use our platform.",
      "We reserve the right to update or modify these Terms at any time. Continued use of the Service after any changes constitutes your consent to such changes. We will notify users of material changes via email or platform notification.",
    ],
  },
  {
    id: "account",
    title: "2. User Accounts",
    content: [
      "To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.",
      "You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.",
      "We reserve the right to suspend or terminate accounts that violate these Terms, provide false information, or engage in fraudulent activity.",
    ],
  },
  {
    id: "content",
    title: "3. Course Content & Intellectual Property",
    content: [
      "All course content, materials, videos, documents, and other educational resources on the platform are the intellectual property of Apna Campus or our instructors and are protected by copyright laws.",
      "Upon enrollment, you are granted a limited, non-exclusive, non-transferable license to access and view the course content for personal, non-commercial educational purposes only.",
      "You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, download, store, or transmit any course content without prior written consent.",
    ],
  },
  {
    id: "conduct",
    title: "4. User Conduct",
    content: [
      "You agree not to use the Service to: share your account credentials with others, upload harmful or malicious content, harass other users or instructors, or engage in any activity that disrupts the platform.",
      "You must not attempt to gain unauthorized access to any portion of the Service, other users' accounts, or any systems or networks connected to the Service.",
      "Cheating, plagiarism, or any form of academic dishonesty in assessments, assignments, or exams will result in course failure and potential account suspension.",
    ],
  },
  {
    id: "payments",
    title: "5. Payments & Refunds",
    content: [
      "Certain courses require payment. By purchasing a course, you agree to pay the listed price. All prices are in the currency displayed at the time of purchase.",
      "We offer a 7-day money-back guarantee for paid courses. To request a refund, contact our support team within 7 days of purchase. Refunds are processed within 5-10 business days.",
      "We reserve the right to change our pricing at any time. Price changes will not affect courses you have already purchased.",
    ],
  },
  {
    id: "certificates",
    title: "6. Certificates",
    content: [
      "Certificates are awarded upon successful completion of all required course modules and assessments. Certificates are digital and can be verified through our verification portal.",
      "Apna Campus certificates represent completion of our courses and are not equivalent to academic degrees or professional licenses. Any misrepresentation of certificate status may result in revocation.",
    ],
  },
  {
    id: "limitation",
    title: "7. Limitation of Liability",
    content: [
      "The Service is provided 'as is' without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or secure.",
      "In no event shall Apna Campus, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.",
      "Our total liability for any claims arising from or related to these Terms shall not exceed the amount you paid to us in the 12 months preceding the claim.",
    ],
  },
  {
    id: "termination",
    title: "8. Account Termination",
    content: [
      "You may close your account at any time through your account settings. Upon closure, your access to enrolled courses will be revoked and your data will be deleted within 90 days.",
      "We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or if required by law. In case of termination for cause, no refund will be provided for any unused portion of paid courses.",
    ],
  },
  {
    id: "governing-law",
    title: "9. Governing Law",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising from these Terms or the Service shall be resolved through arbitration in Islamabad, Pakistan.",
      "If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Information",
    content: [
      "If you have any questions about these Terms of Service, please contact us at legal@apnacampus.com or write to: Apna Campus Legal Team, 123 Learning Lane, Education City, Islamabad, Pakistan.",
    ],
  },
];

export default function TermsPage(_props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* ── Header ── */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
          <Scale size={16} />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
          <Calendar size={16} />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>

      {/* ── Notice Box ── */}
      <div className="max-w-4xl mx-auto bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 sm:p-8 mb-12 flex gap-4">
        <AlertTriangle
          size={24}
          className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
        />
        <div>
          <h3 className="font-bold text-amber-900 dark:text-amber-300 mb-1">
            Important Notice
          </h3>
          <p className="text-amber-800 dark:text-amber-300/80 text-sm leading-relaxed">
            By creating an account and using Apna Campus, you agree to these
            Terms of Service. Please read them carefully before proceeding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {/* ── Table of Contents ── */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText size={16} />
              Contents
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
                Questions about these terms?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Contact our legal team at{" "}
                <Link
                  href="mailto:legal@apnacampus.com"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                >
                  legal@apnacampus.com
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
