"use client"
import React, { useState, useEffect } from 'react';

interface Job {
  $id: string;
  title: string;
  description: string;
  link: string;
  categories: string[];
}

interface JobListingProps {
  category: string;
}

const dummyJobs: Job[] = [
  {
    $id: '1',
    title: 'Software Engineer',
    description: 'Develop and maintain web applications.',
    link: '#',
    categories: ['Engineering', 'Trending'],
  },
  {
    $id: '2',
    title: 'Product Manager',
    description: 'Lead product development teams.',
    link: '#',
    categories: ['Management', 'Trending'],
  },
  {
    $id: '3',
    title: 'UX Designer',
    description: 'Design user-friendly interfaces.',
    link: '#',
    categories: ['Design'],
  },
  {
    $id: '4',
    title: 'Data Scientist',
    description: 'Analyze and interpret complex data.',
    link: '#',
    categories: ['Data', 'Trending'],
  },
  {
    $id: '5',
    title: 'DevOps Engineer',
    description: 'Manage and automate infrastructure.',
    link: '#',
    categories: ['Engineering'],
  },
  {
    $id: '6',
    title: 'Marketing Specialist',
    description: 'Develop and execute marketing strategies.',
    link: '#',
    categories: ['Marketing'],
  },
  {
    $id: '7',
    title: 'Sales Manager',
    description: 'Lead sales teams to achieve targets.',
    link: '#',
    categories: ['Sales'],
  },
  {
    $id: '8',
    title: 'Customer Support',
    description: 'Provide support to customers.',
    link: '#',
    categories: ['Support'],
  },
  {
    $id: '9',
    title: 'Business Analyst',
    description: 'Analyze business processes and requirements.',
    link: '#',
    categories: ['Business'],
  },
  {
    $id: '10',
    title: 'HR Manager',
    description: 'Manage human resources and recruitment.',
    link: '#',
    categories: ['HR'],
  },
];

const JobListing: React.FC<JobListingProps> = ({ category }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicantData, setApplicantData] = useState({ name: '', email: '' });

  useEffect(() => {
    const filteredJobs = category === 'All' 
      ? dummyJobs 
      : dummyJobs.filter(job => job.categories.includes(category));
    setJobs(filteredJobs);
  }, [category]);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
    setShowViewModal(false);
  };

  const handleView = (job: Job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApplicantData({ ...applicantData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Applicant Name: ${applicantData.name}, Email: ${applicantData.email}, Job ID: ${selectedJob?.$id}`);
    setShowApplyModal(false);
    setApplicantData({ name: '', email: '' });
  };

  return (
    <div className="job-listing p-4 sm:p-6 max-w-9xl my-10 container mx-auto">
      <h2 className="text-3xl font-bold mb-16 text-center text-gray-800">Job Listings in {category}</h2>
      {jobs.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {jobs.map((job) => (
            <li key={job.$id} className="p-4 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 max-w-xl">
              <h3 className="text-2xl font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-600 mt-2">{job.description}</p>
              <div className="flex justify-start space-x-4 mt-4">
                <button onClick={() => handleApply(job)} className="px-4 py-2 border text-white bg-blue-500 shadow-md rounded-md hover:bg-blue-700 transition-colors duration-300">
                  Apply Now
                </button>
                <button onClick={() => handleView(job)} className="px-4 py-2 border text-blue-600 bg-white shadow-md rounded-md hover:bg-whitesmoke hover:text-blue-400 transition-colors duration-300">
                  View Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No job listings available in this category.</p>
      )}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10">
            <h3 className="text-xl font-bold mb-4">Apply for {selectedJob.title}</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={applicantData.name}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={applicantData.email}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Submit Application
              </button>
            </form>
            <button onClick={() => setShowApplyModal(false)} className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Close
            </button>
          </div>
        </div>
      )}
      {showViewModal && selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10">
            <h3 className="text-xl font-bold mb-4">Job Details</h3>
            <p><strong>Title:</strong> {selectedJob.title}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <p><strong>Categories:</strong> {selectedJob.categories.join(', ')}</p>
            <button onClick={() => handleApply(selectedJob)} className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Apply Now
            </button>
            <button onClick={() => setShowViewModal(false)} className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListing;
