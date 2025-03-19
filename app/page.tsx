"use client"
import React, { useState, useEffect } from 'react'
import LoginPage from './login/page'
import RegisterForm from './register/page'
import Header from './components/header'
import HeroSection from './components/hero-section'
import Timeline from './components/timeline'
import JobListing from './components/job-listing'
import TestimonialCarousel from './components/testimonial'
import SubmittedData from './components/submitted-data'
import { databases } from './appwrite'

interface Job {
  $id: string;
  department: string;
}

const page = () => {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await databases.listDocuments("67ad9a8000273614f1f6", "67ad9ace00383939ae95");
        const jobs = response.documents as unknown as Job[];
        
        // Extract unique departments from all jobs
        const allDepartments = new Set<string>();
        jobs.forEach(job => {
          if (job.department) {
            allDepartments.add(job.department);
          }
        });
        setCategories(['All', ...Array.from(allDepartments)]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='bg-[#f9fafc]'>
      <Header />
      <div className="tabs-container my-6">
        {isLoading ? (
          <div className="flex justify-center space-x-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        ) : (
          <ul className="flex flex-wrap justify-center space-x-2 sm:space-x-4">
            {categories.map((category) => (
              <li key={category} className="mb-2 sm:mb-0">
                <button
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md ${selectedCategory === category ? 'bg-[#065de8] text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <JobListing category={selectedCategory} />
      <Timeline />
      <TestimonialCarousel />
    </div>
  )
}

export default page
