"use client"
import type React from "react"
import { useState, useEffect } from "react"
import JobApplicationStepper from "./stepper"
import { motion, AnimatePresence } from "framer-motion"
import { databases } from "../appwrite"


interface Job {
  $id: string
  title: string
  description: string
  link: string
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
        const response = await databases.listDocuments('67ad9a8000273614f1f6', '67ad9ace00383939ae95')
        const fetchedJobs = response.documents as unknown as Job[]
        const filteredJobs = category === "All" ? fetchedJobs : fetchedJobs.filter((job) => job.categories.includes(category))
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
    <div className="job-listing p-4 sm:p-6 max-w-7xl my-10 container mx-auto">
      <h2 className="text-3xl font-bold mb-16 text-center text-gray-800">Job Listings in {category}</h2>
      {jobs.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {jobs.map((job) => (
            <motion.li
              key={job.$id}
              className="p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 max-w-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-600 mt-2">{job.description}</p>
              <div className="flex justify-start space-x-4 mt-4">
                <button
                  onClick={() => handleApply(job)}
                  className="px-4 py-2 border text-white bg-indigo-600 shadow-md rounded-md hover:bg-indigo-500 transition-colors duration-300"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => handleView(job)}
                  className="px-4 py-2 border text-indigo-600 bg-white shadow-md rounded-md hover:bg-whitesmoke hover:text-indigo-500 transition-colors duration-300"
                >
                  View Details
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No job listings available in this category.</p>
      )}
      <AnimatePresence>
        {showModal && selectedJob && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-[100%] z-10 max-w-3xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl text-gray-700 font-bold ">
                  {modalContent === "apply" ? `Apply for ${selectedJob.title}` : "Job Details"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Close
                </button>
              </div>
              {modalContent === "apply" ? (
                <JobApplicationStepper />
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-gray-700"><strong>Title:</strong> {selectedJob.title}</p>
                  <p className="text-lg text-gray-700"><strong>Description:</strong> {selectedJob.description}</p>
                  <p className="text-lg text-gray-700"><strong>Categories:</strong> {selectedJob.categories.join(", ")}</p>
                  <button
                    onClick={() => handleApply(selectedJob)}
                    className="px-4 py-2 border text-white bg-indigo-600 shadow-md rounded-md hover:bg-indigo-500 transition-colors duration-300"
                  >
                    Apply Now
                  </button>
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

