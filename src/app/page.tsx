import GetStart from "@/components/ui/GetStart";
import React from "react";

const Home = () => {
  return (
    <main className="overflow-x-hidden">
      <section className="grid grid-rows-[auto_1fr_auto] grid-cols-1 px-4 sm:px-6 md:px-8 lg:px-10 w-full py-6 sm:py-8 md:py-10 min-h-[80vh] items-center justify-center">
        {/* Heading - adjusts size based on screen */}
        <h1 className="row-start-1 row-end-2 text-4xl sm:text-center lg:text-5xl font-bold mb-4 sm:mb-6">
          Unlock Your Future with Quality Learning
        </h1>

        {/* Hero Image - scales appropriately */}
        <div className="row-start-2 row-end-3 w-full h-full flex items-center justify-center my-4 sm:my-6"></div>

        {/* Text and CTA - adjusts spacing and size */}
        <div className="row-start-3 row-end-4 flex flex-col justify-between items-center mt-4 sm:mt-6">
          <p className="text-center sm:text-lg md:text-xl mb-4 sm:mb-6">
            Join a community of learners who are passionate about gaining new
            skills and advancing their careers
          </p>
          <GetStart />
        </div>
      </section>
    </main>
  );
};

export default Home;
