"use client"

import { useState, useEffect } from "react";
import { FiUser, FiBriefcase, FiCheckCircle } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { databases } from "../appwrite";

const DATABASE_ID = "67ad9a8000273614f1f6";
const COLLECTION_ID = "67adb77a003aad67eb41";

type FormData = {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resume: File | null;
  additionalInfo: string;
};

type Application = {
  $id: string;
  name: string;
  email: string;
  position: string;
};

const JobApplicationPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null,
    additionalInfo: "",
  });
  const [errors, setErrors] = useState<{ message?: string }>({});
  
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      setApplications(response.documents as Application[]);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.position) {
      setErrors({ message: "Please fill all required fields." });
      return;
    }
    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", formData);
      alert("Application submitted successfully!");
      fetchApplications();
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-bold mt-6 text-gray-700">Submitted Applications</h3>
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-gray-700">Name</th>
            <th className="border p-2 text-gray-700">Email</th>
            <th className="border p-2 text-gray-700">Position</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.$id} className="border">
              <td className="p-2 text-gray-700">{app.name}</td>
              <td className="p-2 text-gray-700">{app.email}</td>
              <td className="p-2 text-gray-700">{app.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobApplicationPage;
