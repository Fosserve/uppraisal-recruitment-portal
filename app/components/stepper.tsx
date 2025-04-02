"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiUser, FiBriefcase, FiCheckCircle } from "react-icons/fi"
import { useDropzone } from "react-dropzone"
import { databases, ID, storage } from "../appwrite"
import {  APPLICANT_COLLECTION_ID, DATABASE_ID, RESUME_STORAGE_ID  } from "../utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type FormData = {
  name: string
  email: string
  phone: string
  position: string
  experience: string
  resume: File | null
  additionalInfo: string
}

type Errors = {
  [key: string]: string
}

interface JobApplicationFormProps {
  jobTitle: string,
  experience: string
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ jobTitle ,experience }) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    position: jobTitle,
    experience: experience,
    resume: null,
    additionalInfo: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,15}$/
    return phoneRegex.test(phone)
  }
  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {}
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.trim()) {
          newErrors.email = "Email is required"
        } else if (!validateEmail(formData.email)) {
          newErrors.email = "Invalid email format"
        }
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone is required"
        } else if (!validatePhone(formData.phone)) {
          newErrors.phone = "Invalid phone number"
        }
        break
      case 2:
        if (!formData.resume) newErrors.resume = "Resume is required"
        if (!formData.experience.trim()) {
          newErrors.experience = "Experience is required"
        } else {
          const experienceValue = parseFloat(formData.experience)
          const minExperience = parseFloat(experience)
          if (isNaN(experienceValue) || experienceValue < minExperience || experienceValue > 50) {
            newErrors.experience = `Experience must be a minimum of  ${minExperience} years for this role`
          }
        }
        break
      default:
        break
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const onDrop = (acceptedFiles: File[]) => {
    setFormData((prev) => ({
      ...prev,
      resume: acceptedFiles[0],
    }))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
    maxFiles: 1,
  })
  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        const resumeFile = formData.resume
        if (!resumeFile) {
          toast.error("Please select a resume file to submit.")
          return
        }

        let fileId = null

        try {
          const uniqueFileId = ID.unique()
          const file = await storage.createFile(RESUME_STORAGE_ID, uniqueFileId, resumeFile)

          if (!file?.$id) {
            throw new Error("File upload failed")
          }

          fileId = file.$id
        } catch (fileError) {
          console.error("Error uploading file:", fileError)
          toast.error("Failed to upload resume. Please try again.")
          return
        }

        try {
          const uniqueDocId = ID.unique()
          const dataToSubmit = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            position: formData.position.trim(),
            phone: formData.phone.trim(),
            experience: formData.experience.trim(),
            resume: fileId,
            additionalInfo: formData.additionalInfo.trim()
          }

          const document = await databases.createDocument(
            DATABASE_ID,
            APPLICANT_COLLECTION_ID,
            uniqueDocId,
            dataToSubmit
          )

          if (!document?.$id) {
            throw new Error("Document creation failed")
          }

          toast.success("Application submitted successfully!")
          setFormData({
            name: "",
            email: "",
            phone: "",
            position: jobTitle,
            experience: "",
            resume: null,
            additionalInfo: "",
          })
          setCurrentStep(1)
          if (isMounted) {
            // Refresh the page to enroute to dashboard after 3 seconds
            setTimeout(() => {
              window.location.href = "/"
            }, 3000)
          }
        } catch (docError) {
          console.error("Error creating document:", docError)
          if (fileId) {
            try {
              await storage.deleteFile(RESUME_STORAGE_ID, fileId)
            } catch (deleteError) {
              console.error("Error deleting file:", deleteError)
            }
          }
          toast.error("Failed to submit application. Please try again.")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        toast.error("An unexpected error occurred. Please try again.")
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
            <div className="space-y-4">
              <input
                id="name"
                type="text"
                placeholder="Full Name"
                className={`block w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#2498ff] focus:outline-none focus:ring-[#2498ff] sm:text-sm`}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                id="email"
                type="email"
                placeholder="Email Address"
                className={`block w-full rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#2498ff] focus:outline-none focus:ring-[#2498ff] sm:text-sm`}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
                id="phone"
                type="tel"
                placeholder="Phone Number"
                className={`block w-full rounded-md border ${errors.phone ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#2498ff] focus:outline-none focus:ring-[#2498ff] sm:text-sm`}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <input
                id='jobposition'
                type="text"
                placeholder="Apply Position"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#2498ff] focus:outline-none focus:ring-[#2498ff] sm:text-sm"
                value={formData.position}
                disabled
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Professional Information</h2>
            <div className="space-y-4">
              <input
                id="experience"
                type="text"
                placeholder="Years of Experience"
                className={`block w-full rounded-md border ${errors.experience ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#2498ff] focus:outline-none focus:ring-[#2498ff] sm:text-sm`}
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
              />
              {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}

              <div className="flex flex-col space-y-2">
                <label className="text-gray-700">Upload Resume</label>
                <div
                  {...getRootProps()}
                  className={`w-full p-4 border-2 text-gray-600 border-dashed rounded-lg ${
                    isDragActive ? "border-[#0d78ff]" : errors.resume ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-[#0d78ff]">Drop the file here ...</p>
                  ) : formData.resume ? (
                    <p>{formData.resume.name}</p>
                  ) : (
                    <p className="text-gray-600 text-sm">Drag 'n' drop your resume here, or click to select a file</p>
                  )}
                </div>
                {errors.resume && <p className="text-red-500 text-sm">{errors.resume}</p>}
              </div>

              <textarea
              id="additionalInfo"
                placeholder="message to us"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#2498ff] focus:outline-none focus:ring-[#2498ff] sm:text-sm"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Review Your Application</h2>
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-700">Personal Information</h3>
                <p className="text-gray-600 text-sm">Name: {formData.name}</p>
                <p className="text-gray-600 text-sm">Email: {formData.email}</p>
                <p className="text-gray-600 text-sm">Phone: {formData.phone}</p>
                <p className="text-gray-600 text-sm">Apply Position: {formData.position}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Professional Information</h3>
                <p className="text-gray-600 text-sm">Experience: {formData.experience}</p>
                <p className="text-gray-600 text-sm">Resume: {formData.resume?.name}</p>
                <p className="text-gray-600 text-sm">Additional Information: {formData.additionalInfo}</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative bg-white px-6 ">
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 md:p-8 relative z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center justify-evenly gap-8 w-full">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? "bg-[#4db9ff] text-white"
                      : currentStep > step
                        ? "bg-[#0d78ff] text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step === 1 ? (
                    <FiUser className="w-5 h-5" />
                  ) : step === 2 ? (
                    <FiBriefcase className="w-5 h-5" />
                  ) : (
                    <FiCheckCircle className="w-5 h-5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">{renderStep()}</div>

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-2 border text-gray-700 border-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#0d78ff] text-white rounded-lg hover:bg-[#2498ff] transition-colors ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobApplicationForm

