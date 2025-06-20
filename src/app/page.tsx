import GetStart from '@/components/ui/GetStart';
import HeroImgUI from '@/components/ui/HeroImgUI';
import React from 'react';

const Home = () => {
  return (
    <main className='overflow-x-hidden'>
      <section className='px-4 sm:px-6 md:px-8 lg:px-10 w-full py-6 sm:py-8 md:py-10 min-h-[80vh]'>
        {/* Heading - Centered using text-align */}
        <h1 className='text-center text-4xl sm:text-5xl lg:text-5xl font-bold mb-4 sm:mb-6'>
          Unlock Your Future with Quality Learning
        </h1>

        {/* Hero Image - Centered using margin-auto */}
        <div className='w-full text-center'>
          <div className='mx-auto inline-block'>
            <HeroImgUI />
          </div>
        </div>

        {/* Text and CTA - Centered using text-align and margin-auto */}
        <div className='text-center mt-4 sm:mt-6'>
          <p className='sm:text-lg md:text-xl mb-4 sm:mb-6 mx-auto max-w-xl'>
            Join a community of learners who are passionate about gaining new skills and advancing
            their careers
          </p>
          <div className='inline-block'>
            <GetStart />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
