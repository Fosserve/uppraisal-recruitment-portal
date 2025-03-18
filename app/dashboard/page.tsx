"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "../appwrite";
import PostJob from "../components/jobposting";
import JobApplicationPage from "../components/submitted-data";
import {
  Box,
  Button,
  Typography,
  Modal,
  Container,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function AdminDashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const logout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" color="textPrimary" mb={{ xs: 2, sm: 0 }}>
          Admin Dashboard
        </Typography>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems="center">
          <Typography variant="body1" color="textSecondary" component="span" mr={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
            Welcome, <strong>{user.name}</strong>
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => setIsModalOpen(true)}
            sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
          >
            Post a Job
          </Button>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="post-job-modal"
        aria-describedby="modal-to-post-a-job"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            overflowY: 'auto',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="post-job-modal" variant="h6" component="h2">
              Post a Job
            </Typography>
            <Button onClick={() => setIsModalOpen(false)} color="inherit">
              ✖
            </Button>
          </Box>
          <PostJob />
        </Box>
      </Modal>

      <JobApplicationPage />
    </Container>
  );
}