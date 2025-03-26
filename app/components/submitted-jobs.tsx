"use client"

import type React from "react"
import { useState, useEffect, Fragment, useCallback } from "react"
import { Client, Databases, Query, type Models } from "appwrite"
import { format } from "date-fns"
import { Dialog, Transition } from "@headlessui/react"
import { Edit, Trash2, X } from "lucide-react"
import { DataGrid } from "@mui/x-data-grid";
import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";


// Constants
const DATABASE_ID = "67ad9a8000273614f1f6"
const JOB_COLLECTION_ID = "67ad9ace00383939ae95"

// Employment Types and Work Modes
type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance";
type WorkMode = "In-office" | "Remote" | "Hybrid";

const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance"
];

const WORK_MODES: WorkMode[] = [
  "In-office",
  "Remote",
  "Hybrid"
];

// Types
interface Job extends Models.Document {
  designation?: string
  company?: string
  companyWebsite?: string
  experience?: string
  location?: string
  employmentType?: string
  workMode?: string
  department?: string
  keySkills?: string[]
  description?: string
  datePosted?: string
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67ad93cc00138d79087a")

console.log("Appwrite Client Initialized:", client) // Debug log

const databases = new Databases(client)

// Appwrite Service Functions
const getJobs = async (): Promise<Job[]> => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, JOB_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
    ])
    console.log("Raw Appwrite response:", response.documents) // Debug log
    return response.documents as Job[]
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw error
  }
}

const updateJob = async (jobId: string, jobData: Partial<Job>): Promise<Job> => {
  try {
    const response = await databases.updateDocument(DATABASE_ID, JOB_COLLECTION_ID, jobId, jobData)
    return response as Job
  } catch (error) {
    console.error("Error updating job:", error)
    throw error
  }
}

const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await databases.deleteDocument(DATABASE_ID, JOB_COLLECTION_ID, jobId)
  } catch (error) {
    console.error("Error deleting job:", error)
    throw error
  }
}

// Delete Confirmation Dialog Component
function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Delete Job
            </Dialog.Title>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete the job listing for <span className="font-medium text-gray-900">{jobTitle}</span>? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Edit Job Modal Component
function EditJobModal({
  isOpen,
  onClose,
  job,
  onJobUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  onJobUpdated: () => void;
}) {
  const [formData, setFormData] = useState({
    designation: job.designation || "",
    company: job.company || "",
    companyWebsite: job.companyWebsite || "",
    experience: job.experience || "",
    location: job.location || "",
    employmentType: job.employmentType || "Full-time",
    workMode: job.workMode || "In-office",
    department: job.department || "",
    keySkills: job.keySkills || [],
    description: job.description || "",
    featured: job.featured || false,
  });
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!formData.keySkills.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          keySkills: [...prev.keySkills, skillInput.trim()],
        }));
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keySkills: prev.keySkills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateJob(job.$id, formData);
      onJobUpdated();
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Edit Job
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                    Employment Type
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {EMPLOYMENT_TYPES.map((type: EmploymentType) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">
                    Work Mode
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {WORK_MODES.map((mode: WorkMode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Experience
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="keySkills" className="block text-sm font-medium text-gray-700">
                  Key Skills
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="keySkills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillInput}
                    placeholder="Type a skill and press Enter"
                    className="block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.keySkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {skill}</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Job
                </label>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const jobsData = await getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleEditClick = (job: Job) => {
    setSelectedJob(job);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job);
    setIsDeleteDialogOpen(true);
  };

  const handleJobUpdated = () => {
    setIsEditModalOpen(false);
    fetchJobs();
  };

  const handleJobDeleted = async () => {
    if (selectedJob) {
      try {
        await deleteJob(selectedJob.$id);
        setIsDeleteDialogOpen(false);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const columns = [
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "company", headerName: "Company", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex gap-2">
          <IconButton 
            color="primary" 
            onClick={() => handleEditClick(params.row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="h-5 w-5" />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDeleteClick(params.row)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-5 w-5" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Typography variant="h4" gutterBottom>Job Listings</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={jobs}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          getRowId={(row) => row.$id}
          disableRowSelectionOnClick
          autoHeight
        />
      )}

      {/* Edit Modal */}
      {selectedJob && (
        <EditJobModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          job={selectedJob}
          onJobUpdated={handleJobUpdated}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedJob && (
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleJobDeleted}
          jobTitle={selectedJob.designation || "N/A"}
        />
      )}
    </div>
  );
}
