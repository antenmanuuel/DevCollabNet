import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function WelcomePage({ onLogin, onSignup, onGuest }) {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Welcome to Our Application
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2, mr: 2 }}
            onClick={onLogin}
          >
            Login
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2, mr: 2 }}
            onClick={onSignup}
          >
            Signup
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={onGuest} 
          >
            Guest
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default WelcomePage;