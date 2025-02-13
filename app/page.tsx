"use client"
import React, { useState, useEffect } from 'react'
import LoginPage from './login/page'
import RegisterForm from './register/page'
import Header from './components/header'
import HeroSection from './components/hero-section'

import Timeline from './components/timeline'
import JobListing from './components/job-listing'

const page = () => {
  const categories = ['Engineering', 'Marketing', 'Sales', 'Design'];
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Retrieve the selected category from localStorage or default to 'Engineering'
    return localStorage.getItem('selectedCategory') || 'Engineering';
  });

  useEffect(() => {
    // Store the selected category in localStorage whenever it changes
    localStorage.setItem('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  return (
    <div className='bg-white h-screen'>
      <Header />
      {/* <HeroSection /> */}
      <div className="tabs-container my-6">
        <ul className="flex justify-center space-x-4">
          {categories.map((category) => (
            <li key={category}>
              <button
                className={`px-4 py-2 rounded-md ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <JobListing category={selectedCategory} />
      <Timeline />
    </div>
  )
}

export default page
