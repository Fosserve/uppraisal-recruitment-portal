"use client";

import { useState, useEffect } from "react";
import { databases } from "../appwrite";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Button, Chip } from '@mui/material';
import { APPLICANT_COLLECTION_ID, RESUME_STORAGE_ID, PROJECT_ID } from "../utils";

const DATABASE_ID = "67ad9a8000273614f1f6";
const COLLECTION_ID = "67adb77a003aad67eb41";

type ApplicationStatus = "Pending" | "Selected" | "Rejected" | "Shortlisted";

type Application = {
  $id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resume: string | null;
  additionalInfo: string;
  status: ApplicationStatus;
};

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
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
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
    setOriginalData(application); // Store original data for comparison
    const formDataWithoutDollarFields = Object.keys(application).reduce((acc, key) => {
      if (!key.startsWith("$")) {
        acc[key as keyof Application] = application[key as keyof Application] ?? '';
      }
      return acc;
    }, {} as Application); // Use Application to ensure all fields are present
    setFormData(formDataWithoutDollarFields as Application);
    setIsEditing(false);
    setIsModalOpen(true);
  };
  const handleUpdate = async () => {
    if (!formData || !originalData) return;
  
    // Find only the modified fields
    const updatedFields: Partial<Application> = Object.keys(formData).reduce((acc, key) => {
      if ((formData as any)[key] !== (originalData as any)[key]) {
        acc[key as keyof Application] = (formData as any)[key];
      }
      return acc;
    }, {} as Partial<Application>);
  
    if (Object.keys(updatedFields).length === 0) {
      alert("No changes made.");
      return;
    }
  
    try {
      await databases.updateDocument(DATABASE_ID, APPLICANT_COLLECTION_ID, formData.$id, updatedFields);
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
    "Pending": "warning",
    "Selected": "success",
    "Rejected": "error",
    "Shortlisted": "primary",
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
      renderCell: (params: GridCellParams) =>
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
      renderCell: (params: GridCellParams) => (
        <Chip label={params.value} color={statusColors[params.value as ApplicationStatus] || "default"} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: GridCellParams) => (
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
      <Typography variant="h4" component="h3" className="mt-6 text-gray-700">
        Submitted Applications
      </Typography>
      {errors.message && <Alert severity="error">{errors.message}</Alert>}
      <TableContainer component={Paper} variant="outlined" className="mt-4">
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f0f0f0" }}>
              <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Position</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Experience</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Resume</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Additional Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.$id}>
                <TableCell>{app.name}</TableCell>
                <TableCell>{app.email}</TableCell>
                <TableCell>{app.phone}</TableCell>
                <TableCell>{app.position}</TableCell>
                <TableCell>{app.experience}</TableCell>
                <TableCell>
                  {app.resume ? (
                    <Button href={app.resume} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </Button>
                  ) : (
                    "No Resume"
                  )}
                </TableCell>
                <TableCell>{app.additionalInfo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default JobApplicationPage;
