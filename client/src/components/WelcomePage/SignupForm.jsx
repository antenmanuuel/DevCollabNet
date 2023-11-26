import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function SignupForm() {


  const [formData, setFormData] = useState({
    username: "",
    emailaddy: "",
    passwordtext: "",
  });

  const [errors, setErrors] = useState({
    usernameError: "",
    emailaddyError: "",
    passwordtextError: "",
  });

    
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
          usern: data.get("usern"),
          email: data.get("email"),
          password: data.get("password"),
        });
      };

    return(
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
            id="usern"
            label="Username"
            name="usern"
            autoComplete="usern"
            autoFocus
            //value={formData.username}
            //onChange={handleInputChange}
            //error={Boolean(errors.usernameError)}
            //helperText={errors.usernameError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            //value={formData.emailaddy}
            //onChange={handleInputChange}
            //error={Boolean(errors.emailaddyError)}
            //helperText={errors.emailaddyError}
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
            //value={formData.passwordtext}
            //onChange={handleInputChange}
            //error={Boolean(errors.passwordtextError)}
            //helperText={errors.passwordtextError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign up
          </Button>
        </Box>
      </Box>
    </Container>
    )
}

export default SignupForm;