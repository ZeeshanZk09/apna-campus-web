import React from 'react';

const Footer = () => {
  return (
    <footer className='w-screen overflow-hidden flex justify-center items-center '>
      <div className='py-2'>
        © {new Date().getFullYear()} Apna Campus, Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
