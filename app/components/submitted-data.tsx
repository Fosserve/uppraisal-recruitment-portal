"use client";

import { useState, useEffect } from "react";
import { databases } from "../appwrite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Button, Container, Typography } from "@mui/material";
import { DATABASE_ID, JOB_COLLECTION_ID, PROJECT_ID, RESUME_STORAGE_ID } from "../utils";


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
  const [errors, setErrors] = useState<{ message?: string }>({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, JOB_COLLECTION_ID);
      setApplications(response.documents as unknown as Application[]);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 150 },
    { field: "position", headerName: "Position", flex: 1, minWidth: 150 },
    { field: "experience", headerName: "Experience", flex: 1, minWidth: 150 },
    {
      field: "resume",
      headerName: "Resume",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        params.value ? (
          <Button
            href={`https://cloud.appwrite.io/v1/storage/buckets/${RESUME_STORAGE_ID}/files/${params.value}/view?project=${PROJECT_ID}&mode=admin`}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="primary"
            size="small"
          >
            View Resume
          </Button>
        ) : (
          "No Resume"
        ),
    },
    { field: "additionalInfo", headerName: "Additional Info", flex: 1, minWidth: 200 },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Submitted Applications
      </Typography>
      {errors.message && <Alert severity="error">{errors.message}</Alert>}
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={applications}
          columns={columns}
          getRowId={(row) => row.$id}
          pageSizeOptions={[5, 10, 20]}
          pagination
          autoHeight
        />
      </div>
    </Container>
  );
};

export default JobApplicationPage;
