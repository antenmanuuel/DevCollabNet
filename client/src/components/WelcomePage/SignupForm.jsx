import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

function SignupForm({ onSignupSuccess, goToWelcome }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [hasError, setHasError] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const [serverError, setServerError] = useState("");

  const validate = () => {
    let isValid = true;
    let newErrors = { usernameError: "", emailError: "", passwordError: "", confirmPasswordError: "" };

    if (!formData.username) {
      newErrors.usernameError = "Username is required.";
      isValid = false;
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPasswordError = "Confirming password is required.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPasswordError = "Passwords do not match.";
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
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        isAdmin: false,
      };

      try {
        const response = await axios.post("http://localhost:8000/users/signup", newUser, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data === "success") {
          onSignupSuccess();
        } else {
          setServerError(response.data || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Signup error", error);
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
        {/* Avatar with Person Icon */}
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <PersonAddOutlinedIcon />
        </Avatar>

        {/* Heading */}
        <Typography component="h1" variant="h4" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join our community to ask questions, share knowledge, and connect with developers worldwide.
        </Typography>

        {/* Signup Form */}
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
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleInputChange}
            error={Boolean(hasError.usernameError)}
            helperText={hasError.usernameError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={formData.password}
            onChange={handleInputChange}
            error={Boolean(hasError.passwordError)}
            helperText={hasError.passwordError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={Boolean(hasError.confirmPasswordError)}
            helperText={hasError.confirmPasswordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>

        {/* Additional Navigation */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, mb: 1 }}
        >
          Already have an account?{" "}
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

export default SignupForm;
