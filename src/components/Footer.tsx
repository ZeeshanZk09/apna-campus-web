import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='w-full bg-gray-900 text-gray-300 py-6 px-4 sm:px-8 mt-12'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Left - Brand */}
        <div>
          <h2 className='text-lg font-bold text-white'>Apna Campus</h2>
          <p className='mt-2 text-sm text-gray-400 max-w-sm'>
            A modern student management system for a single institute — simplify, manage, and
            empower your educational journey.
          </p>
        </div>

        {/* Center - Links */}
        <div className='flex flex-col md:items-center'>
          <h3 className='text-sm font-semibold text-white mb-3'>Quick Links</h3>
          <ul className='space-y-2 text-sm'>
            <li>
              <a href='#about' className='hover:text-white transition'>
                About
              </a>
            </li>
            <li>
              <a href='#features' className='hover:text-white transition'>
                Features
              </a>
            </li>
            <li>
              <a href='#pricing' className='hover:text-white transition'>
                Pricing
              </a>
            </li>
            <li>
              <a href='#contact' className='hover:text-white transition'>
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Right - Social */}
        <div className='flex flex-col md:items-end'>
          <h3 className='text-sm font-semibold text-white mb-3'>Connect</h3>
          <div className='flex space-x-4'>
            <a href='#' className='hover:text-white transition'>
              <FaFacebookF />
            </a>
            <a href='#' className='hover:text-white transition'>
              <FaTwitter />
            </a>
            <a href='#' className='hover:text-white transition'>
              <FaInstagram />
            </a>
            <a href='#' className='hover:text-white transition'>
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className='mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-500'>
        © {new Date().getFullYear()} Apna Campus, Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
