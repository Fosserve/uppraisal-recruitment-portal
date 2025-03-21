import React from 'react'
import logo from "../../public/img7.jpg"

const HeroSection = () => {
  return (
    <div className='relative mb-16'>
    <main className="lg:relative">
        <div className="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
          <div className="px-6 sm:px-8 lg:w-1/2 xl:pr-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block xl:inline">Find The {' '}<span className="block text-[#065de8] xl:inline">Perfect</span> Job That you Deserved</span>{' '}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
            Find your perfect job with Uppraisal Consultant! Connect with top employers and explore opportunities tailored to your skills and location.
            </p>
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow-sm">
                <a
                  href="/"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#065de8] px-8 py-2 text-base font-medium text-white hover:bg-indigo-700 md:px-10 md:py-3 md:text-lg"
                >
                  Explore Job Listings
                </a>
              </div>
              <div className="mt-3 rounded-md shadow-sm sm:mt-0 sm:ml-3">
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-2 text-base font-medium text-[#065de8] hover:bg-gray-50 md:px-10 md:py-3 md:text-lg"
                >
                  Our Hiring
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
          <img
            alt=""
            src={logo.src}
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </main>
      </div>
  )
}

export default HeroSection
