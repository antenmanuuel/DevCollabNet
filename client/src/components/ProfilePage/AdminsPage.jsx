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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [userReputation, setUserReputation] = useState(null);

  useEffect(() => {
    if (sessionData.username) {
      axios
        .get(
          `http://localhost:8000/users/userReputation/${sessionData.username}`
        )
        .then((response) => {
          setUserReputation(response.data.reputation);
        })
        .catch((error) => {
          console.error("Error fetching user reputation:", error);
        });
    }
  }, [sessionData.username]);

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

  const handleDeleteUserById = (userId) => {
    setOpenDialog(true);
    setSelectedUserId(userId);
  };

  const handleConfirmDelete = async () => {
    try {
      // Find the username corresponding to the selectedUserId
      const selectedUser = users.find((user) => user._id === selectedUserId);
      if (!selectedUser) {
        throw new Error("User not found");
      }
      const selectedUsername = selectedUser.username;

      await axios.delete(
        `http://localhost:8000/users/deleteUser/${selectedUsername}`
      );

      setUsers(users.filter((user) => user._id !== selectedUserId));
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  const isAdminOnlyUser = users.length === 1 && users[0].username === "admin";

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
        borderBottom: 0,
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
          }}
        >
          Member since: {memberSince}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            position: "absolute",
            top: "90px",
            left: "30px",
            fontSize: "15px",
          }}
        >
          Reputation Score:{" "}
          {userReputation !== null ? userReputation : "Loading..."}
        </Typography>
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: "130px",
            left: "550px",
            fontSize: "18px",
            fontWeight: "bolder",
          }}
        >
          All Current Users
        </Typography>
      </Box>

      <Box sx={{ maxHeight: "420px", overflowY: "auto" }}>
        {isAdminOnlyUser ? (
          <Typography variant="h6" align="left" sx={{color:"red", marginTop: "10px", marginLeft:"10px"}}>
            There are no users except admin.
          </Typography>
        ) : (
          <Table sx={{ width: "100%" }}>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} sx={{ borderBottom: "3px dotted" }}>
                  <TableCell sx={{ width: "65%" }}>
                    <Typography
                      sx={{
                        cursor: "pointer",
                        color: "black",
                        fontSize: "large",
                      }}
                    >
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "17.5%", paddingLeft: "70px" }}>
                    <Button
                      onClick={() => handleDeleteUserById(user._id)}
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
        )}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminsPage;
