"use client";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { useTheme } from "@/hooks/ThemeChanger";
import { useHydrationFix } from "@/lib/utils/HydrationFix";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { isDarkMode } = useTheme();

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  }

  const isHydrated = useHydrationFix(1000);

  if (!isHydrated) return null;

  return (
    <footer
      aria-labelledby="footer-heading"
      className="w-full bg-transparent relative z-10 py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`rounded-2xl backdrop-blur border p-8 mt-8 transition-colors duration-300 ${
            isDarkMode
              ? "bg-white/6 border-white/8"
              : "bg-black/6 border-black/8 shadow-lg"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand */}
            <div className="md:col-span-4">
              <h2
                id="footer-heading"
                className={`text-xl font-semibold transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Apna Campus
              </h2>
              <p
                className={`mt-2 text-sm max-w-sm transition-colors ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Explore our portfolio of educational projects, campus
                initiatives, and innovative learning solutions at Apna Campus.
              </p>

              <div
                className={`mt-4 flex items-center gap-3 text-sm transition-colors ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                <FaEnvelope
                  aria-hidden
                  className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}
                />
                <Link
                  href="mailto:apnacampus.it@gmail.com"
                  className={`hover:underline ${
                    isDarkMode ? "hover:text-white" : "hover:text-gray-900"
                  }`}
                >
                  apnacampus.it@gmail.com
                </Link>
              </div>

              <div
                className={`mt-3 flex items-center gap-3 text-sm transition-colors ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                <FaPhone
                  aria-hidden
                  className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}
                />
                <Link
                  href="tel:+923378568671"
                  className={`hover:underline ${
                    isDarkMode ? "hover:text-white" : "hover:text-gray-900"
                  }`}
                >
                  +92 337 8568671
                </Link>
              </div>
            </div>

            {/* Sitemap / Links */}
            <div className="md:col-span-5 grid grid-cols-2 gap-6">
              <div>
                <h3
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Product
                </h3>
                <ul
                  className={`mt-3 space-y-2 text-sm transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <li>
                    <Link
                      href="/dashboard"
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:text-white"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/students"
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:text-white"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      Students
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/attendance"
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:text-white"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      Attendance
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/fees"
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:text-white"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      Finance
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Resources
                </h3>
                <ul
                  className={`mt-3 space-y-2 text-sm transition-colors ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <li>
                    <Link
                      href="/docs"
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:text-white"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      Docs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:text-white"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/status"
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:text-white"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      System Status
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className={`transition-colors ${
                        isDarkMode
                          ? "hover:text-white"
                          : "hover:text-indigo-600"
                      }`}
                    >
                      Privacy & Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter + Social */}
            <div className="md:col-span-3">
              <h3
                className={`text-sm font-medium transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Stay updated
              </h3>

              <form
                onSubmit={handleSubscribe}
                className="mt-3 flex flex-col sm:flex-row gap-3"
                aria-label="Subscribe to newsletter"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-white/5 border-white/10 placeholder:text-gray-400 text-white focus:ring-indigo-400"
                      : "bg-white border-gray-300 placeholder:text-gray-400 text-gray-900 focus:ring-indigo-500"
                  }`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md font-medium transition-all whitespace-nowrap ${
                    subscribed
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  } text-white`}
                >
                  {subscribed ? "✓ Subscribed" : "Subscribe"}
                </button>
              </form>

              <p
                className={`mt-3 text-xs transition-colors ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No spam — unsubscribe any time.
              </p>

              <div className="mt-4 flex items-center gap-3">
                {[
                  { icon: FaFacebookF, label: "Facebook", href: "#" },
                  { icon: FaTwitter, label: "Twitter", href: "#" },
                  { icon: FaInstagram, label: "Instagram", href: "#" },
                  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    aria-label={label}
                    href={href}
                    className={`p-2 rounded-md transition-colors ${
                      isDarkMode
                        ? "hover:bg-white/10 text-gray-300 hover:text-white"
                        : "hover:bg-gray-100 text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* hr divider */}
        <hr
          className={`mt-6 border-t transition-colors ${
            isDarkMode ? "border-white/8" : "border-black/8"
          }`}
        />

        {/* Bottom row: legal, language, copyright */}
        <div
          className={`mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm transition-colors ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Apna Campus, Inc.</span>
            <Link
              href="/legal"
              className={`transition-colors ${
                isDarkMode
                  ? "hover:text-white hover:underline"
                  : "hover:text-indigo-600 hover:underline"
              }`}
            >
              Legal
            </Link>
            <Link
              href="/cookies"
              className={`transition-colors ${
                isDarkMode
                  ? "hover:text-white hover:underline"
                  : "hover:text-indigo-600 hover:underline"
              }`}
            >
              Cookies
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Language selector */}
            <label htmlFor="locale" className="sr-only">
              Select language
            </label>
            <div
              className={`flex items-center gap-2 rounded-md px-3 py-1 transition-colors ${
                isDarkMode ? "bg-white/5" : "bg-gray-100"
              }`}
            >
              <FaGlobe
                aria-hidden
                className={isDarkMode ? "text-gray-400" : "text-gray-600"}
              />
              <select
                id="locale"
                defaultValue="en"
                className={`bg-transparent text-sm focus:outline-none transition-colors ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <option value="en">English</option>
                <option value="ur">اردو</option>
              </select>
            </div>

            <span
              className={`text-xs transition-colors ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
