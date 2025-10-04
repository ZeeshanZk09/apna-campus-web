import Card from '@/components/ui/Testimonials';
import React from 'react';

const Testimonials = (props) => {
  return (
    <section className='px-20 flex   justify-between items-center min-h-screen w-screen'>
      <div className='max-w-[50%] flex flex-col gap-10'>
        <h1 className='text-2xl '>Our Students:</h1>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis omnis repellat voluptas
          autem pariatur molestiae reprehenderit, corrupti nihil praesentium facilis amet inventore
          soluta saepe. Voluptate, eveniet id. Facilis, quaerat officia?
        </p>
      </div>
      <Card />
    </section>
  );
};

export default Testimonials;
