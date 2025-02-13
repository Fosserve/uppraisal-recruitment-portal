"use client"
import React, { useState, useEffect } from 'react'
import LoginPage from './login/page'
import RegisterForm from './register/page'
import Header from './components/header'
import HeroSection from './components/hero-section'

import Timeline from './components/timeline'

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
      <HeroSection />
      {/* <PostJob /> */}
      <Explore />
      <Timeline />
      
    </div>
  )
}

export default page
