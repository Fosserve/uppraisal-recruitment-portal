import React, { useState } from "react";
import {
  FiCheck,
  FiUser,
  FiBriefcase,
  FiSettings,
  FiCheckCircle,
} from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { databases } from "../appwrite";

type FormData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  professionalInfo: {
    jobTitle: string;
    experience: string;
    employers: string[];
    skills: string[];
  };
  preferences: {
    roles: string[];
    location: string[];
    salary: string;
    employmentType: string;
  };
};

type Errors = {
  [key: string]: string;
};

const JobApplicationStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
    professionalInfo: {
      jobTitle: "",
      experience: "",
      employers: [],
      skills: [],
    },
    preferences: {
      roles: [],
      location: [],
      salary: "",
      employmentType: "",
    },
  });
  const [errors, setErrors] = useState<Errors>({});
  const [resume, setResume] = useState<File | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};
    switch (step) {
      case 1:
        if (!formData.personalInfo.fullName)
          newErrors.fullName = "Name is required";
        if (!formData.personalInfo.email) newErrors.email = "Email is required";
        if (!formData.personalInfo.phone) newErrors.phone = "Phone is required";
        if (!formData.personalInfo.location) newErrors.location = "Location is required";
        break;
      case 2:
        if (!formData.professionalInfo.jobTitle)
          newErrors.jobTitle = "Job title is required";
        if (!formData.professionalInfo.experience)
          newErrors.experience = "Experience is required";
        break;
      case 3:
        if (!formData.preferences.roles.length)
          newErrors.roles = "Preferred roles are required";
        if (!formData.preferences.salary)
          newErrors.salary = "Salary expectation is required";
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section] as any,
        [field]: [...(prev[section][field] as string[]), value],
      },
    }));
  };

  const onDrop = (acceptedFiles: File[]) => {
    setResume(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': []
    },
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Personal Information
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.personalInfo.fullName}
                onChange={(e) =>
                  handleInputChange("personalInfo", "fullName", e.target.value)
                }
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}

              <input
                type="email"
                placeholder="Email Address"
                className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.personalInfo.email}
                onChange={(e) =>
                  handleInputChange("personalInfo", "email", e.target.value)
                }
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <input
                type="tel"
                placeholder="Phone Number"
                className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.personalInfo.phone}
                onChange={(e) =>
                  handleInputChange("personalInfo", "phone", e.target.value)
                }
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}

              <select
                className="block w-full rounded-md border  bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300"
                value={formData.personalInfo.location}
                onChange={(e) =>
                  handleInputChange("personalInfo", "location", e.target.value)
                }
              >
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Professional Background
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Current Job Title"
                className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  errors.jobTitle ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.professionalInfo.jobTitle}
                onChange={(e) =>
                  handleInputChange(
                    "professionalInfo",
                    "jobTitle",
                    e.target.value
                  )
                }
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-sm">{errors.jobTitle}</p>
              )}

              <input
                type="number"
                placeholder="Years of Experience"
                className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  errors.experience ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.professionalInfo.experience}
                onChange={(e) =>
                  handleInputChange(
                    "professionalInfo",
                    "experience",
                    e.target.value
                  )
                }
              />
              {errors.experience && (
                <p className="text-red-500 text-sm">{errors.experience}</p>
              )}

              <input
                type="text"
                placeholder="Previous Employers"
                className="block w-full rounded-md border  bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300"
                value=""
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleArrayInputChange("professionalInfo", "employers", (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <div>
                {formData.professionalInfo.employers.map((employer, index) => (
                  <p key={index}>{employer}</p>
                ))}
              </div>

              <input
                type="text"
                placeholder="Skills"
                className="block w-full rounded-md border  bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300"
                value=""
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleArrayInputChange("professionalInfo", "skills", (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <div>
                {formData.professionalInfo.skills.map((skill, index) => (
                  <p key={index}>{skill}</p>
                ))}
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-gray-700">Upload Resume</label>
                <div
                  {...getRootProps()}
                  className={`w-full p-4 border-2 border-dashed rounded-lg ${
                    isDragActive ? "border-indigo-600" : "border-gray-300"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-indigo-600">Drop the files here ...</p>
                  ) : resume ? (
                    <p>{resume.name}</p>
                  ) : (
                    <p>Drag 'n' drop a file here, or click to select a file</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Job Preferences
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Preferred Job Roles"
                className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
                  errors.roles ? "border-red-500" : "border-gray-300"
                }`}
                value=""
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleArrayInputChange("preferences", "roles", (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <div>
                {formData.preferences.roles.map((role, index) => (
                  <p key={index}>{role}</p>
                ))}
              </div>
              {errors.roles && (
                <p className="text-red-500 text-sm">{errors.roles}</p>
              )}

              <input
                type="text"
                placeholder="Desired Work Location"
                className="block w-full rounded-md border  bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300"
                value=""
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleArrayInputChange("preferences", "location", (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <div>
                {formData.preferences.location.map((loc, index) => (
                  <p key={index}>{loc}</p>
                ))}
              </div>

              <input
                type="text"
                placeholder="Salary Expectations"
                className={`block w-full rounded-md border bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm ${
                  errors.salary ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.preferences.salary}
                onChange={(e) =>
                  handleInputChange("preferences", "salary", e.target.value)
                }
              />
              {errors.salary && (
                <p className="text-red-500 text-sm">{errors.salary}</p>
              )}

              <select
                className="block w-full rounded-md border  bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300"
                value={formData.preferences.employmentType}
                onChange={(e) =>
                  handleInputChange(
                    "preferences",
                    "employmentType",
                    e.target.value
                  )
                }
              >
                <option value="">Select Employment Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Review Your Application
            </h2>
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-700">
                  Personal Information
                </h3>
                <p>Name: {formData.personalInfo.fullName}</p>
                <p>Email: {formData.personalInfo.email}</p>
                <p>Phone: {formData.personalInfo.phone}</p>
                <p>Location: {formData.personalInfo.location}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  Professional Background
                </h3>
                <p>Job Title: {formData.professionalInfo.jobTitle}</p>
                <p>Experience: {formData.professionalInfo.experience} years</p>
                <p>Previous Employers: {formData.professionalInfo.employers.join(", ")}</p>
                <p>Skills: {formData.professionalInfo.skills.join(", ")}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Job Preferences</h3>
                <p>Preferred Roles: {formData.preferences.roles.join(", ")}</p>
                <p>Desired Location: {formData.preferences.location.join(", ")}</p>
                <p>Salary Expectation: {formData.preferences.salary}</p>
                <p>Employment Type: {formData.preferences.employmentType}</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Application
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      await databases.createDocument(
        '67ad9a8000273614f1f6',
        '67adb77a003aad67eb41',
        'unique()',
        formData
      );
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="relative bg-white py-6 px-2">
      {/* Content */}
      <div className="max-w-2xl   top-0 mx-auto bg-white rounded-xl p-6 md:p-8  relative z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="flex items-center justify-evenly gap-8 w-full"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? "bg-indigo-400 text-white"
                      : currentStep > step
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step ? (
                    <FiCheck className="w-5 h-5" />
                  ) : step === 1 ? (
                    <FiUser className="w-5 h-5" />
                  ) : step === 2 ? (
                    <FiBriefcase className="w-5 h-5" />
                  ) : step === 3 ? (
                    <FiSettings className="w-5 h-5" />
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
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < 4 && (
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
  );
};

export default JobApplicationStepper;
