import React, { useState } from "react";
import axios from "axios";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import Logo from "../../../public/lg.png";
import Footer from "/home/ubuntu/bookanytime/bookanytime-frontend/src/Footer.jsx";

const ListProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    const phoneRegEx = /^\+91\d{10}$/;
    return phoneRegEx.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegEx.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFormErrors({ phone: "", email: "" });

    let valid = true;

    if (!validatePhone(formData.phone)) {
      setFormErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number (+91 followed by 10 digits)." }));
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      setFormErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/list-property`,
        formData
      );
      setMessage(response.data.message);
      setFormData({ name: "", phone: "", email: "", category: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundImage: "linear-gradient(to right,rgb(227, 231, 238),rgb(240, 243, 247))",
        padding: 2,
        marginTop: "50px",
      }}
    >
      <h1>List Your Property</h1>
      <h6>join thounsands of property owenrs and start earning by listing your sapce on BookAnyTime</h6>
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >

          {message && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
            />
            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              placeholder="+91 9876543210"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
                fontWeight: 600,
                backgroundColor: "#0072ff",
                "&:hover": { backgroundColor: "#005bb5" },
              }}
            >
              Submit
            </Button>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default ListProperty;