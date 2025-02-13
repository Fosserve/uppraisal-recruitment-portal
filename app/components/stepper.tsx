// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepButton from '@mui/material/StepButton';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';

// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

// export default function HorizontalNonLinearStepper() {
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [completed, setCompleted] = React.useState<{
//     [k: number]: boolean;
//   }>({});

//   const totalSteps = () => {
//     return steps.length;
//   };

//   const completedSteps = () => {
//     return Object.keys(completed).length;
//   };

//   const isLastStep = () => {
//     return activeStep === totalSteps() - 1;
//   };

//   const allStepsCompleted = () => {
//     return completedSteps() === totalSteps();
//   };

//   const handleNext = () => {
//     const newActiveStep =
//       isLastStep() && !allStepsCompleted()
//         ? // It's the last step, but not all steps have been completed,
//           // find the first step that has been completed
//           steps.findIndex((step, i) => !(i in completed))
//         : activeStep + 1;
//     setActiveStep(newActiveStep);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleStep = (step: number) => () => {
//     setActiveStep(step);
//   };

//   const handleComplete = () => {
//     setCompleted({
//       ...completed,
//       [activeStep]: true,
//     });
//     handleNext();
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//     setCompleted({});
//   };

//   return (
//     <Box sx={{ width: '100%', backgroundColor:'white,' }}>
//       <Stepper nonLinear activeStep={activeStep}>
//         {steps.map((label, index) => (
//           <Step key={label} completed={completed[index]}>
//             <StepButton color="inherit" onClick={handleStep(index)}>
//               {label}
//             </StepButton>
//           </Step>
//         ))}
//       </Stepper>
//       <div>
//         {allStepsCompleted() ? (
//           <React.Fragment>
//             <Typography sx={{ mt: 2, mb: 1 }}>
//               All steps completed - you&apos;re finished
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//               <Box sx={{ flex: '1 1 auto' }} />
//               <Button onClick={handleReset}>Reset</Button>
//             </Box>
//           </React.Fragment>
//         ) : (
//           <React.Fragment>
//             <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
//               Step {activeStep + 1}
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
//               <Button
//                 color="inherit"
//                 disabled={activeStep === 0}
//                 onClick={handleBack}
//                 sx={{ mr: 1 }}
//               >
//                 Back
//               </Button>
//               <Box sx={{ flex: '1 1 auto' }} />
//               <Button onClick={handleNext} sx={{ mr: 1 }}>
//                 Next
//               </Button>
//               {activeStep !== steps.length &&
//                 (completed[activeStep] ? (
//                   <Typography variant="caption" sx={{ display: 'inline-block' }}>
//                     Step {activeStep + 1} already completed
//                   </Typography>
//                 ) : (
//                   <Button onClick={handleComplete}>
//                     {completedSteps() === totalSteps() - 1
//                       ? 'Finish'
//                       : 'Complete Step'}
//                   </Button>
//                 ))}
//             </Box>
//           </React.Fragment>
//         )}
//       </div>
//     </Box>
//   );
// }

import React, { useState } from "react";
import {
  FiCheck,
  FiUser,
  FiBriefcase,
  FiSettings,
  FiCheckCircle,
} from "react-icons/fi";

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
    employers: string;
    skills: string[];
  };
  preferences: {
    roles: string;
    location: string;
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
      employers: "",
      skills: [],
    },
    preferences: {
      roles: "",
      location: "",
      salary: "",
      employmentType: "",
    },
  });
  const [errors, setErrors] = useState<Errors>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};
    switch (step) {
      case 1:
        if (!formData.personalInfo.fullName)
          newErrors.fullName = "Name is required";
        if (!formData.personalInfo.email) newErrors.email = "Email is required";
        if (!formData.personalInfo.phone) newErrors.phone = "Phone is required";
        break;
      case 2:
        if (!formData.professionalInfo.jobTitle)
          newErrors.jobTitle = "Job title is required";
        if (!formData.professionalInfo.experience)
          newErrors.experience = "Experience is required";
        break;
      case 3:
        if (!formData.preferences.roles)
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

              <input
                type="text"
                placeholder="Current Location"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300"
                value={formData.personalInfo.location}
                onChange={(e) =>
                  handleInputChange("personalInfo", "location", e.target.value)
                }
              />
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

              <textarea
                placeholder="Previous Employers"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300 h-32"
                value={formData.professionalInfo.employers}
                onChange={(e) =>
                  handleInputChange(
                    "professionalInfo",
                    "employers",
                    e.target.value
                  )
                }
              />

              <div className="flex flex-col space-y-2">
                <label className="text-gray-700">Upload Resume</label>
                <input
                  type="file"
                  className="w-full p-2 border rounded-lg border-gray-300"
                  accept=".pdf,.doc,.docx"
                />
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
                value={formData.preferences.roles}
                onChange={(e) =>
                  handleInputChange("preferences", "roles", e.target.value)
                }
              />
              {errors.roles && (
                <p className="text-red-500 text-sm">{errors.roles}</p>
              )}

              <input
                type="text"
                placeholder="Desired Work Location"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300"
                value={formData.preferences.location}
                onChange={(e) =>
                  handleInputChange("preferences", "location", e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Salary Expectations"
                className={`block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${
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
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border-gray-300"
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
                <p>Previous Employers: {formData.professionalInfo.employers}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Job Preferences</h3>
                <p>Preferred Roles: {formData.preferences.roles}</p>
                <p>Desired Location: {formData.preferences.location}</p>
                <p>Salary Expectation: {formData.preferences.salary}</p>
                <p>Employment Type: {formData.preferences.employmentType}</p>
              </div>
            </div>
            <button
              onClick={() => alert("Application submitted successfully!")}
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
  return (
    <div className="relative bg-white py-6 px-2">
      {/* Content */}
      <div className="max-w-2xl  absolute top-0 mx-auto bg-white rounded-xl p-6 md:p-8 shadow-lg relative z-10">
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
