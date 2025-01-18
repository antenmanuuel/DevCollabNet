import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";

function LoginForm({ onLoginSuccess, goToWelcome }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [hasError, setHasError] = useState({
    emailError: "",
    passwordError: "",
  });

  const [serverError, setServerError] = useState("");

  const validate = () => {
    let isValid = true;
    let newErrors = { emailError: "", passwordError: "" };

    if (!formData.email) {
      newErrors.emailError = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.emailError = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.passwordError = "Password is required.";
      isValid = false;
    }

    setHasError(newErrors);
    return isValid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setHasError({ ...hasError, [name + "Error"]: "" }); // Clear specific field error
    setServerError(""); // Clear server error on input change
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const user = {
        email: formData.email,
        password: formData.password,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/users/login",
          user,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data === "success") {
          onLoginSuccess(response.data.username, response.data.email);
        } else {
          setServerError(response.data || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Login error", error);
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Avatar with Lock Icon */}
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        {/* Heading */}
        <Typography component="h1" variant="h4" gutterBottom>
          Log In
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Access your account to start asking questions and sharing knowledge.
        </Typography>

        {/* Login Form */}
        {serverError && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleInputChange}
            error={Boolean(hasError.emailError)}
            helperText={hasError.emailError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            error={Boolean(hasError.passwordError)}
            helperText={hasError.passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
        </Box>

        {/* Additional Navigation */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, mb: 1 }}
        >
          New here?{" "}
          <Button
            onClick={goToWelcome}
            sx={{ textTransform: "none", padding: 0, fontSize: "inherit" }}
          >
            Return to Welcome Page
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginForm;
