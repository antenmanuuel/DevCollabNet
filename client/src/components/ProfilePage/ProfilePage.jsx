import React from "react";
import AdminsPage from "./AdminsPage";
import { Typography } from "@mui/material";
import UsersPage from "./UsersPage";

const ProfilePage = ({ sessionData }) => {
    // Check if the user is not logged in
   
    if (!sessionData || !sessionData.username) {
        return <Typography sx={{paddingLeft: "300px", paddingTop:"40px", color:"red", fontSize:"20px"}}>Error: You must be logged in to view this page.</Typography>;
    }

    // Check if the username is 'admin'
    if (sessionData.username === 'admin') {
        return <AdminsPage />;
    }

    // Default to UsersPage for other users
    return <UsersPage />;
};

export default ProfilePage;