import React, { useState } from "react";
import axios from 'axios';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function SignupForm({ onSignupSuccess , goToWelcome}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [hasError, setHasError] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: ""
  });

  const validate = () => {
    let isValid = true;
    let newErrors = { usernameError: "", emailError: "", passwordError: "", confirmPasswordError: "" };

    if (!formData.username) {
      newErrors.usernameError = "Username is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.emailError = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.emailError = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.passwordError = "Password is required";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPasswordError = "Confirming password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPasswordError = "Passwords do not match";
      isValid = false;
    }

    setHasError(newErrors);
    return isValid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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

      axios.post('http://localhost:8000/users/signup', newUser, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        if (res.data === 'success') {
          onSignupSuccess();
        } else {
          setHasError(prevState => ({ ...prevState, confirmPasswordError: res.data }));
        }
      })
      .catch((error) => {
        console.error("Signup error", error);
      });
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
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
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
            autoComplete="current-password"
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
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>  
        <Button
            variant="contained"
            sx={{ mt: 3, mb: 2 , bgcolor: 'text.primary' }}
            onClick={goToWelcome}
            >
            Return to welcome page
      </Button>
      </Box>
    </Container>
  );
}

export default SignupForm;