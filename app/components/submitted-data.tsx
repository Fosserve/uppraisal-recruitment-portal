"use client";

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
  status: string;
};

enum ApplicationStatus {
  Pending = "pending",
  Selected = "selected",
  Rejected = "rejected",
  Shortlisted = "shortlisted"
}

const JobApplicationPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [errors, setErrors] = useState<{ message?: string }>({});
  const [originalData, setOriginalData] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, APPLICANT_COLLECTION_ID);
      setApplications(response.documents as unknown as Application[]);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, APPLICANT_COLLECTION_ID, id);
      setApplications((prev) => prev.filter((app) => app.$id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application.");
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setOriginalData(application);
    setFormData(application as Application);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!formData || !originalData || !formData.$id) {
      alert("Missing required document ID");
      return;
    }
  
    // Define only the fields that are editable
    const editableFields = ['name', 'email', 'phone', 'position', 'experience', 'additionalInfo', 'status'];
    
    // Create updatedFields object only with editable fields that have changed
    const updatedFields: Partial<Application> = {};
    editableFields.forEach((key) => {
      if ((formData as any)[key] !== (originalData as any)[key]) {
        updatedFields[key as keyof Application] = (formData as any)[key];
      }
    });
  
    if (Object.keys(updatedFields).length === 0) {
      alert("No changes made.");
      return;
    }
  
    try {
      await databases.updateDocument(
        DATABASE_ID, 
        APPLICANT_COLLECTION_ID, 
        formData.$id,
        updatedFields
      );
      setApplications((prev) =>
        prev.map((app) => (app.$id === formData.$id ? { ...app, ...updatedFields } : app))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const statusColors: Record<ApplicationStatus, "default" | "primary" | "secondary" | "error" | "success" | "warning"> = {
    [ApplicationStatus.Pending]: "warning",
    [ApplicationStatus.Selected]: "success",
    [ApplicationStatus.Rejected]: "error",
    [ApplicationStatus.Shortlisted]: "primary",
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "position", headerName: "Position", flex: 1 },
    { field: "experience", headerName: "Experience", flex: 0.5 },
    {
      field: "resume",
      headerName: "Resume",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <Button
            href={`https://cloud.appwrite.io/v1/storage/buckets/${RESUME_STORAGE_ID}/files/${params.value}/view?project=${PROJECT_ID}&mode=admin`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume
          </Button>
        ) : (
          "No Resume"
        ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip label={params.value} color={statusColors[params.value as ApplicationStatus] || "default"} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "8px",marginTop:'10px' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleViewDetails(params.row)}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.$id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

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
