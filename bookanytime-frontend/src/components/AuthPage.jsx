import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = ({ isSignup }) => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const apiUrl = isSignup 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup` 
      : `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`;

    try {
      const response = await axios.post(apiUrl, formData);
      const data = response.data;

      if (data.token && data.user) {
        // ✅ Store user data & token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("User stored:", data.user);
        navigate("/"); // Redirect after login/signup
        window.location.reload(); // Refresh to apply changes
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Request failed. Try again.");
      console.error("Request failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "linear-gradient(to right, #1E3C72, #2A5298)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
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
          <Typography variant="h4" color="primary" gutterBottom>
            {isSignup ? "Create an Account" : "Login"}
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
            {isSignup && (
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#f9f9f9" } }}
              />
            )}
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
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              {isSignup ? "Sign Up" : "Login"}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              component="button"
              onClick={() => navigate(isSignup ? "/login" : "/signup")}
              sx={{ cursor: "pointer", color: "#0072ff", fontWeight: 600, "&:hover": { textDecoration: "underline" } }}
            >
              {isSignup ? "Login" : "Sign Up"}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;
