import React from "react";
import { Typography } from "@mui/material";
import UsersPage from "./UsersPage";

const ProfilePage = ({ sessionData }) => {
  if (!sessionData || !sessionData.username) {
    return (
      <Typography
        sx={{
          paddingLeft: "300px",
          paddingTop: "40px",
          color: "red",
          fontSize: "20px",
        }}
      >
        Error: You must be logged in to view this page.
      </Typography>
    );
  }
  if (sessionData.username === "admin") {
    return <UsersPage />;
  }
  return <UsersPage />;
};

export default ProfilePage;
