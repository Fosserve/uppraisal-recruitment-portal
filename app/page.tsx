"use client"
import React, { useState, useEffect } from 'react'
import LoginPage from './login/page'
import RegisterForm from './register/page'
import Header from './components/header'
import HeroSection from './components/hero-section'

import Timeline from './components/timeline'
import JobListing from './components/job-listing'
import JobApplicationStepper from './components/stepper'

const page = () => {
  const categories = ['All', 'Trending', 'Engineering', 'Marketing', 'Sales', 'Design'];
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Retrieve the selected category from localStorage or default to 'All'
    return localStorage.getItem('selectedCategory') || 'All';
  });

  useEffect(() => {
    // Store the selected category in localStorage whenever it changes
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  return (
    <div className='bg-white'>
      <Header />
      <Timeline />

      {/* <HeroSection /> */}
      <div className="tabs-container my-6">
        <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
          {categories.map((category) => (
            <li key={category} className="mb-2 sm:mb-0">
              <button
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <JobListing category={selectedCategory} />
      {/* <JobApplicationStepper/> */}
      {/* <HorizontalNonLinearStepper /> */}
      
    </div>
  )
}

export default page
