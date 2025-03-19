"use client"

import type React from "react"
import { useState, useEffect, Fragment } from "react"
import { Client, Databases, Query, type Models } from "appwrite"
import { format } from "date-fns"
import { Edit, Trash2, X } from "lucide-react"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Button, Modal, Box, IconButton, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { DATABASE_ID, JOB_COLLECTION_ID } from "../utils"
import { databases } from "../appwrite"




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
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  jobTitle: string
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-confirmation-modal"
      aria-describedby="delete-confirmation-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 400,
          maxWidth: '90%',
        }}
      >
        <Typography id="delete-confirmation-modal" variant="h6" component="h2" gutterBottom>
          Delete Confirmation
        </Typography>
        <Typography id="delete-confirmation-description" variant="body1" sx={{ mb: 3 }}>
          Are you sure you want to delete the job listing <strong>{jobTitle}</strong>?
          This action cannot be undone.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            sx={{
              backgroundColor: 'error.main',
              '&:hover': {
                backgroundColor: 'error.dark',
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

// Edit Job Modal Component
function EditJobModal({
  isOpen,
  onClose,
  job,
  onJobUpdated,
}: {
  isOpen: boolean
  onClose: () => void
  job: Job
  onJobUpdated: () => void
}) {
  const [formData, setFormData] = useState({
    designation: job.designation || job.title || "",
    company: job.company || "",
    companyWebsite: job.companyWebsite || "",
    experience: job.experience || "",
    location: job.location || "",
    employmentType: job.employmentType || "Full-time",
    workMode: job.workMode || "In-office",
    department: job.department || job.category || "",
    keySkills: job.keySkills || [],
    description: job.description || "",
  })
  const [skillInput, setSkillInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      if (!formData.keySkills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          keySkills: [...formData.keySkills, skillInput.trim()],
        })
      }
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      keySkills: formData.keySkills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateJob(job.$id, formData)
      onJobUpdated()
    } catch (error) {
      console.error("Error updating job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="edit-job-modal"
      aria-describedby="edit-job-form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: '100%',
          maxWidth: '800px',
          mx: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            Edit Job
          </Typography>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Designation"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="e.g. Engineering, Marketing, Sales"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Website"
                id="companyWebsite"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  label="Employment Type"
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Internship">Internship</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Work Mode</InputLabel>
                <Select
                  label="Work Mode"
                  id="workMode"
                  name="workMode"
                  value={formData.workMode}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                >
                  <MenuItem value="In-office">In-office</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 2-4 years"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Key Skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillInput}
                  placeholder="Type a skill and press Enter"
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {formData.keySkills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => removeSkill(skill)}
                      deleteIcon={<X />}
                    />
                  ))}
                </Box>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={5}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

// Main Jobs Page Component
export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const jobsData = await getJobs();
      console.log("Retrieved jobs data:", jobsData); // Debug log
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message); // Log the error message
      }
      alert("Failed to fetch jobs. Please check the console for details."); // Display error message
    } finally {
      setIsLoading(false);
    }
  };


  const handleEditClick = (job: Job) => {
    setSelectedJob(job)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job)
    setIsDeleteDialogOpen(true)
  }

  const handleJobUpdated = () => {
    setIsEditModalOpen(false)
    fetchJobs()
  }

  const handleJobDeleted = async () => {
    if (selectedJob) {
      try {
        await deleteJob(selectedJob.$id)
        setIsDeleteDialogOpen(false)
        fetchJobs()
      } catch (error) {
        console.error("Error deleting job:", error)
      }
    }
  }

  // Helper function to get job title (handles both designation and title fields)
  const getJobTitle = (job: Job) => {
    return job.designation || job.title || "N/A"
  }

  // Helper function to get department (handles both department and category fields)
  const getDepartment = (job: Job) => {
    return job.department || job.category || "N/A"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Job Listings</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Designation
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Department
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Posted Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  jobs.map((job, index) => (
                    <tr key={job.$id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700/50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {getJobTitle(job)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {getDepartment(job)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {job.company || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(job.$createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(job)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(job)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedJob && (
          <>
            <EditJobModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              job={selectedJob}
              onJobUpdated={handleJobUpdated}
            />

            <DeleteConfirmDialog
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              onConfirm={handleJobDeleted}
              jobTitle={getJobTitle(selectedJob)}
            />
          </>
        )}
      </div>
    </div>
  )
}