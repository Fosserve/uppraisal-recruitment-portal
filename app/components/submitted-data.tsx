"use client"

import { useState, useEffect } from "react";
import { databases } from "../appwrite";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Button } from '@mui/material';
import { Edit, Trash2 } from "lucide-react";

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
  phone: string;
  position: string;
  experience: string;
  resume: string | null;
  additionalInfo: string;
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
      setApplications(response.documents as unknown as Application[]);
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
    <div className="container w-full mx-auto p-6">
              <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Submitted Applications</h1>

      {errors.message && <Alert severity="error">{errors.message}</Alert>}
      <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-5 text-center py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-5 text-center py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-5 text-center py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-center text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-center text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Experience
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-center text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Resume
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Additional Info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((app, index) => (
                    <tr key={app.$id} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700/50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-white">
                        {app.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {app.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {app.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {app.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {app.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {app.resume ? (
                          <Button
                            href={app.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View Resume
                          </Button>
                        ) : (
                          "No Resume"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {app.additionalInfo}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
    </div>
  );
};

export default JobApplicationPage;
