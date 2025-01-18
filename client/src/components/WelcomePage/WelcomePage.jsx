import React from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";

function WelcomePage({ onLogin, onSignup, onGuest }) {
  return (
    <>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: 3,
            backgroundColor: "white",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          {/* Header */}
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#2d3748" }}
          >
            Welcome to Dev Collab Net!
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, fontSize: "1.1rem" }}
          >
            A platform to ask questions, get answers, and share your knowledge
            with the programming world. Join thousands of developers in creating
            a stronger, smarter coding community!
          </Typography>

          {/* Features Section */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2, mb: 4 }}
          >
            <Box textAlign="center">
              <QuestionAnswerIcon sx={{ fontSize: 50, color: "#6c63ff" }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                Ask and Answer
              </Typography>
            </Box>
            <Box textAlign="center">
              <PersonAddIcon sx={{ fontSize: 50, color: "#ff6b6b" }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                Build a Profile
              </Typography>
            </Box>
            <Box textAlign="center">
              <VisibilityIcon sx={{ fontSize: 50, color: "#00bfa5" }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                Explore Insights
              </Typography>
            </Box>
          </Stack>

          {/* Call-to-Action Buttons */}
          <Box>
            <Button
              variant="contained"
              size="large"
              color="primary"
              sx={{ mt: 2, mb: 2, mx: 1, px: 4, py: 1 }}
              onClick={onLogin}
              aria-label="Login to your account"
            >
              Login
            </Button>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{ mt: 2, mb: 2, mx: 1, px: 4, py: 1 }}
              onClick={onSignup}
              aria-label="Create a new account"
            >
              Signup
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="info"
              sx={{ mt: 2, mb: 2, mx: 1, px: 4, py: 1 }}
              onClick={onGuest}
              aria-label="Explore as a guest"
            >
              Guest
            </Button>
          </Box>

          {/* Motivational Quote */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 4, fontStyle: "italic" }}
          >
            "The best way to predict the future is to create it."
          </Typography>
        </Box>

        {/* About Section */}
        <Box
          sx={{
            marginTop: 6,
            padding: 3,
            backgroundColor: "#f7f7f7",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            About StackOverflow Clone
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2, fontSize: "1rem" }}
          >
            StackOverflow Clone is a community-driven Q&A platform designed for
            developers, engineers, and tech enthusiasts. Our mission is to
            create an open, collaborative space where users can solve problems,
            share expertise, and grow professionally.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.9rem" }}
          >
            Whether you're a beginner or an expert, our platform empowers you to
            learn, teach, and connect with peers in the global programming
            community.
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          marginTop: 8,
          padding: 2,
          backgroundColor: "#2d3748",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} StackOverflow Clone. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontSize: "0.9rem" }}>
          Created with ❤️ by Developers for Developers.
        </Typography>
      </Box>
    </>
  );
}

export default WelcomePage;
