import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Typography,
  Button,
} from "@mui/material";

const AdminsPage = () => {
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "admin",
    email: "",
    created_at: "",
    reputation: 0,
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await axios.get(
          "http://localhost:8000/users/session"
        );
        const usersResponse = await axios.get(
          "http://localhost:8000/users/admin"
        );

        if (sessionResponse.data && sessionResponse.data.loggedIn) {
          setSessionData({
            loggedIn: true,
            username: sessionResponse.data.username,
            email: sessionResponse.data.email,
            created_at: sessionResponse.data.created_at,
            reputation: sessionResponse.data.reputation,
          });
        }

        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUserByEmail = async (userEmail) => {
    try {
      await axios.delete(
        `http://localhost:8000/users/deleteUserByEmail/${userEmail}`
      );
      setUsers(users.filter((user) => user.email !== userEmail));
      if (onUserDeleted && typeof onUserDeleted === "function") {
        onUserDeleted();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const formatDate = (postTime) => {
    const now = new Date();
    const diffInSeconds = (now - new Date(postTime)) / 1000;

    if (diffInSeconds < 60) {
      return `${Math.round(diffInSeconds)} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.round(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.round(diffInSeconds / 3600)} hours ago`;
    } else {
      return new Date(postTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const memberSince = sessionData.created_at
    ? formatDate(new Date(sessionData.created_at))
    : "Loading...";

  return (
    <Box
      sx={{
        width: "85.3%",
        paddingBottom: 5,
        position: "absolute",
        border: 3,
        borderColor: "black",
        borderStyle: "dotted",
        left: "275.5px",
        height: "900px",
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0,
        borderbottom: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          left: "275.5px",
          border: 3,
          borderTop: 0,
          borderRight: 0,
          borderLeft: 0,
          borderColor: "blue",
          borderStyle: "dotted",
          height: "175px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            top: "10px",
            left: "30px",
            fontSize: "25px",
            fontWeight: "bolder",
            border: 3,
            borderColor: "purple",
            borderStyle: "dotted",
          }}
        >
          User Profile: {sessionData.username}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: "50px",
            left: "30px",
            fontSize: "18px",
            border: 3,
            borderColor: "red",
            borderStyle: "dotted",
          }}
        >
          Member for : {memberSince}
        </Typography>

        <Typography
          variant="h2"
          sx={{
            position: "absolute",
            top: "90px",
            left: "30px",
            fontSize: "15px",
            border: 3,
            borderColor: "red",
            borderStyle: "dotted",
          }}
        >
          Reputation Score: {sessionData.reputation}
        </Typography>

        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: "130px",
            left: "550px",
            fontSize: "18px",
            fontWeight: "bolder",
            border: 3,
            borderColor: "purple",
            borderStyle: "dotted",
          }}
        >
          All Current Users
        </Typography>
      </Box>
      <Table sx={{ width: "100%" }}>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell sx={{ width: "65%" }}>
                <Typography
                  sx={{ cursor: "pointer", color: "black", fontSize: "large" }}
                >
                  {user.username}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: "17.5%", paddingLeft: "70px" }}>
                <Button
                  onClick={() => handleDeleteUserByEmail(user.email)}
                  sx={{
                    backgroundColor: "red",
                    color: "common.white",
                    fontSize: "medium",
                    border: 3,
                    borderRadius: "16px",
                    textAlign: "center",
                    borderColor: "red",
                    width: "100px",
                  }}
                  disabled={user.email === sessionData.email}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AdminsPage;
