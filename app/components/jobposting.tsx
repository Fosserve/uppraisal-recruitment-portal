"use client"

import { useState } from "react"
import { client, ID } from "../appwrite"
import { Databases } from "appwrite"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { XCircle } from "lucide-react"

// Define employment types and work modes as constants
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"] as const

const WORK_MODES = ["In-office", "Remote", "Hybrid"] as const

// TypeScript types
type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]
type WorkMode = (typeof WORK_MODES)[number]

interface JobData {
  designation: string
  company: string
  companyWebsite: string
  companyLogo?: string
  experience: string
  location: string
  employmentType: EmploymentType
  workMode: WorkMode
  department: string
  keySkills: string[]
  description: string
}

export default function PostJob() {
  const [jobData, setJobData] = useState<JobData>({
    designation: "",
    company: "",
    companyWebsite: "",
    experience: "",
    location: "",
    employmentType: "Full-time",
    workMode: "In-office",
    department: "",
    keySkills: [],
    description: "",
  })

  const [skillInput, setSkillInput] = useState("")
  const [previewLogo, setPreviewLogo] = useState<string>("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value })
  }

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      if (!jobData.keySkills.includes(skillInput.trim())) {
        setJobData({
          ...jobData,
          keySkills: [...jobData.keySkills, skillInput.trim()],
        })
      }
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setJobData({
      ...jobData,
      keySkills: jobData.keySkills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string)
        setJobData({ ...jobData, companyLogo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const databases = new Databases(client)

      await databases.createDocument("67ad9a8000273614f1f6", "67ad9ace00383939ae95", ID.unique(), jobData)

      alert("Job posted successfully!")
      router.push("/")
    } catch (error) {
      console.error("Error posting job:", error)
      alert("Failed to post job. Please try again.")
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Company Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={jobData.company}
                    onChange={handleChange}
                    required
                    className="block mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>

                <div>
                  <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
                    Company Website *
                  </label>
                  <input
                    type="url"
                    id="companyWebsite"
                    name="companyWebsite"
                    value={jobData.companyWebsite}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com"
                    className="block mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <div className="flex items-center space-x-6">
                  {previewLogo && (
                    <div className="relative w-20 h-20">
                      <Image
                        src={previewLogo || "/placeholder.svg"}
                        alt="Company logo preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Job Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={jobData.designation}
                    onChange={handleChange}
                    required
                    className="block mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department *
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={jobData.department}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Engineering, Marketing, Sales"
                    className="block mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>

                <div>
                  <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                    Employment Type *
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={jobData.employmentType}
                    onChange={handleChange}
                    required
                    className="block mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">
                    Work Mode *
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    value={jobData.workMode}
                    onChange={handleChange}
                    required
                    className="block mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    {WORK_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Experience Required *
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={jobData.experience}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 2-4 years"
                    className="block mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    required
                    className="block mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="keySkills" className="block text-sm font-medium text-gray-700 mb-2">
                  Key Skills *
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    id="keySkills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillInput}
                    placeholder="Type a skill and press Enter"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <div className="flex flex-wrap gap-2">
                    {jobData.keySkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 mt-2 inline-flex items-center"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Describe the role, responsibilities, requirements, and any other relevant details..."
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

