import React, { useState } from "react";
import axios from 'axios';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function LoginForm({ onLoginSuccess, goToWelcome }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [hasError, setHasError] = useState({
    emailError: "",
    passwordError: "",
  });

  const validate = () => {
    let isValid = true;
    let newErrors = { emailError: "", passwordError: "" };

    if (!formData.email) {
      newErrors.emailError = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.emailError = "Email address is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.passwordError = "Password is required";
      isValid = false;
    }

    setHasError(newErrors);
    return isValid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setHasError({ ...hasError, [name + "Error"]: "" });  // Clear specific field error
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const user = {
        email: formData.email,
        password: formData.password
      };

      axios.post('http://localhost:8000/users/login', user, {
        headers: { 'Content-Type': 'application/json' }
      })
      .then((res) => {
        if (res.data === 'success') {
          onLoginSuccess();
        } else {
          setHasError(prevState => ({ ...prevState, passwordError: res.data }));
        }
      })
      .catch((error) => {
        console.error("Login error", error);
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
          Log in
        </Typography>
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
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
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

export default LoginForm;