"use client"
import React from 'react'
import LoginPage from './login/page'
import RegisterForm from './register/page'
import Header from './components/header'
import HeroSection from './components/hero-section'
import Explore from './components/ExploreJob'
import PostJob from './components/jobposting'
import Timeline from './components/timeline'
import JobApplicationStepper from './components/stepper'

const page = () => {
  return (
    <div className='bg-white h-screen'>
      <Header />
      <HeroSection />
      {/* <PostJob /> */}
      <Explore />
      <Timeline />
      <JobApplicationStepper/>
      {/* <HorizontalNonLinearStepper /> */}
      
    </div>
  )
}

export default page
