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
        width: "100%",
        paddingBottom: 5,
        marginTop: "20px",
        marginLeft: "-10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          border: 3,
          borderTop: 0,
          borderRight: 0,
          borderLeft: 0,
          borderStyle: "dotted",
          height: "175px",
          marginLeft: "250px",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: "25px",
            fontWeight: "bolder",
          }}
        >
          User Profile: {sessionData.username}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginTop: "50px",
            marginLeft: "-230px",
            fontSize: "18px",
          }}
        >
          Member since: {memberSince}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            marginTop: "100px",
            marginLeft: "-220px",
            fontSize: "15px",
          }}
        >
          Reputation Score:{" "}
          {userReputation !== null ? userReputation : "Loading..."}
        </Typography>
        <Typography
          variant="h1"
          sx={{
            marginTop: "130px",
            marginLeft: "700px",
            fontSize: "18px",
            fontWeight: "bolder",
          }}
        >
          All Current Users
        </Typography>
      </Box>

      <Box
        sx={{
          maxHeight: "420px",
          overflowY: "auto",
          overflowX: "hidden",
          marginLeft: "200px",
        }}
      >
        {isAdminOnlyUser ? (
          <Typography
            variant="h6"
            align="left"
            sx={{ color: "red", marginTop: "10px", marginLeft: "10px" }}
          >
            There are no users except admin.
          </Typography>
        ) : (
          <Table sx={{ width: "100%", marginLeft: "50px" }}>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} sx={{ borderBottom: "3px dotted" }}>
                  <TableCell sx={{ width: "65%" }}>
                    <Typography
                      sx={{
                        color: "black",
                        fontSize: "large",
                      }}
                    >
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "17.5%",
                      "@media (max-width: 1920px)": {
                        paddingLeft: "300px",
                      },

                      "@media (min-width: 1921px)": {
                        paddingLeft: "200px",
                      },
                    }}
                  >
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
