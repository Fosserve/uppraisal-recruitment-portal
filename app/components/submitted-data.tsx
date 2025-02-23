"use client"

import { useState, useEffect } from "react";
import { databases } from "../appwrite";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Button } from '@mui/material';

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
