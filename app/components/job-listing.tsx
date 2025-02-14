"use client"

import type React from "react"
import { useState, useEffect } from "react"
import JobApplicationStepper from "./stepper"
import { motion, AnimatePresence } from "framer-motion"
import { databases } from "../appwrite"
import { Building2, Clock, MapPin, Briefcase, GraduationCap, Globe } from "lucide-react"

interface Job {
  $id: string
  designation: string
  company: string
  companyWebsite: string
  companyLogo?: string
  experience: string
  location: string
  employmentType: string
  workMode: string
  department: string
  keySkills: string[]
  description: string
  categories: string[]
}

interface JobListingProps {
  category: string
}

const JobListing: React.FC<JobListingProps> = ({ category }) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<"apply" | "view" | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await databases.listDocuments("67ad9a8000273614f1f6", "67ad9ace00383939ae95")
        const fetchedJobs = response.documents as unknown as Job[]
        const filteredJobs =
          category === "All" ? fetchedJobs : fetchedJobs.filter((job) => job.categories.includes(category))
        setJobs(filteredJobs)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      }
    }

    fetchJobs()
  }, [category])

  const handleApply = (job: Job) => {
    setSelectedJob(job)
    setModalContent("apply")
    setShowModal(true)
  }

  const handleView = (job: Job) => {
    setSelectedJob(job)
    setModalContent("view")
    setShowModal(true)
  }

  return (
    <div className="job-listing p-4 sm:p-6 max-w-7xl  my-10 mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        {category === "All" ? "All Job Listings" : `Jobs in ${category}`}
      </h2>

      {jobs.length > 0 ? (
        <div className="space-y-4 max-w-sm shadow-lg">
          {jobs.map((job) => (
            <motion.div
              key={job.$id}
              className="bg-white rounded-lg shadow-lg p-4"
              whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.designation}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <span className="text-sm font-semibold text-gray-500">exp: {job.experience}+ yrs</span>
              </div>
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {job.keySkills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                  {job.keySkills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{job.keySkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleView(job)}
                  className="text-indigo-700 hover:text-indigo-600 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No job listings available in this category.</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && selectedJob && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0  bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div
              className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto relative z-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {modalContent === "apply" ? (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Apply for {selectedJob.designation}</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                      <span className="sr-only">Close</span>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <JobApplicationStepper />
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedJob.designation}</h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span>{selectedJob.company}</span>
                        <span>•</span>
                        <a
                          href={selectedJob.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Website
                        </a>
                      </div>
                    </div>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                      <span className="sr-only">Close</span>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <span>{selectedJob.employmentType}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{selectedJob.experience}+ yrs</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span>{selectedJob.department}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">   
                    <h4 className="text-lg text-gray-900 font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.keySkills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg text-gray-900 font-semibold mb-2">Job Description</h4>
                    <p className="text-gray-600 whitespace-pre-line">{selectedJob.description}</p>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setModalContent("apply")
                      }}
                      className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JobListing

