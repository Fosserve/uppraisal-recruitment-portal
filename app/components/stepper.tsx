

"use client"

import type React from "react"
import { useState } from "react"
import { FiUser, FiBriefcase, FiCheckCircle } from "react-icons/fi"
import { useDropzone } from "react-dropzone"
import { databases, ID, storage } from "../appwrite"
import {  APPLICANT_COLLECTION_ID, DATABASE_ID, RESUME_STORAGE_ID  } from "../utils"


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
  jobTitle: string
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ jobTitle }) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    position: jobTitle,
    experience: "",
    resume: null,
    additionalInfo: "",
  })
  const [errors, setErrors] = useState<Errors>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {}
    switch (step) {
      case 1:
        if (!formData.name) newErrors.name = "Name is required"
        if (!formData.email) newErrors.email = "Email is required"
        if (!formData.position) newErrors.position = "Apply position is required"
        break
      case 2:
        if (!formData.resume) newErrors.resume = "Resume is required"
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
      const resumeFile = formData.resume;
      if (resumeFile) {
        const file = await storage.createFile(RESUME_STORAGE_ID, ID.unique(), resumeFile);
        console.log(file)
        const fileUrl = file.$id; // Assuming $id is the correct property to use for the file reference
        const dataToSubmit = {
          name: formData.name,
          email: formData.email,
          position: formData.position,
          phone: formData.phone,
          experience: formData.experience,
          resume: fileUrl,
          additionalInfo: formData.additionalInfo,
        };

        await databases.createDocument(DATABASE_ID, APPLICANT_COLLECTION_ID, ID.unique(), dataToSubmit);

        alert("Application submitted successfully!");
      } else {
        console.error("No resume file selected.");
        alert("Please select a resume file to submit.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
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
                className={`block w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
              id="email"
                type="email"
                placeholder="Email Address"
                className={`block w-full rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
              id="phone"
                type="tel"
                placeholder="Phone Number"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />

              <input
                id='jobposition'
                type="text"
                placeholder="Apply Position"
                className={`block w-full rounded-md border ${errors.position ? "border-red-500" : "border-gray-300"} bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                required
              />
              {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
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
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
              />

              <div className="flex flex-col space-y-2">
                <label className="text-gray-700">Upload Resume</label>
                <div
                  {...getRootProps()}
                  className={`w-full p-4 border-2 text-gray-600 border-dashed rounded-lg ${
                    isDragActive ? "border-indigo-600" : errors.resume ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-indigo-600">Drop the file here ...</p>
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
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Application
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative bg-white py-6 px-2">
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 md:p-8 relative z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center justify-evenly gap-8 w-full">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? "bg-indigo-400 text-white"
                      : currentStep > step
                        ? "bg-indigo-600 text-white"
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
          {currentStep < 3 && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors ml-auto"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobApplicationForm

