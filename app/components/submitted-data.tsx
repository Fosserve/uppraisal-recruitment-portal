"use client";

import { useState, useEffect } from "react";
import { databases } from "../appwrite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Typography, Alert, Button, Chip, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { APPLICANT_COLLECTION_ID, DATABASE_ID, PROJECT_ID, RESUME_STORAGE_ID } from "../utils";

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
    <div className="w-full p-2">
      <Typography variant="h4" component="h3" className="mt-6 text-gray-700">
        Submitted Applications
      </Typography>
      {errors.message && <Alert severity="error">{errors.message}</Alert>}
      {applications.length > 0 ? (
      <div style={{ height: 400, width: "100%", marginTop: "16px" }}>
        <DataGrid
          rows={applications}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          getRowId={(row) => row.$id}
        />
      </div>
    ) : (
      <Typography variant="body1" className="text-gray-500">
        Loading applications...
      </Typography>
    )}

      {/* View and Update Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth>
        <DialogTitle>{isEditing ? "Edit Application" : "Application Details"}</DialogTitle>
        <DialogContent>
  {formData && (
    <>
      {Object.keys(formData).map((key) => {
        if (key === "$id") return null;

        return key === "status" && isEditing ? (
          <Select
            key={key}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
            fullWidth
            margin="dense"
          >
            {Object.values(ApplicationStatus).map((status) => (
              <MenuItem key={status} value={status}>
                <Chip label={status} color={statusColors[status]} />
              </MenuItem>
            ))}
          </Select>
        ) : (
          <TextField
            key={key}
            label={key}
            value={(formData as any)[key] || ""}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            fullWidth
            margin="dense"
            disabled={!isEditing}
          />
        );
      })}
    </>
  )}
</DialogContent>

        <DialogActions>
          {!isEditing ? (
            <Button onClick={handleEdit} color="primary">Edit</Button>
          ) : (
            <Button onClick={handleUpdate} color="primary">Save</Button>
          )}
          <Button onClick={() => setIsModalOpen(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobApplicationPage;
