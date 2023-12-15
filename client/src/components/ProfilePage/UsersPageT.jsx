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
  Modal,
  TextField,
  Grid,
  Card,
} from "@mui/material";

const UsersPageT = ({ goTags, goQuestions, goAnswers, current }) => {
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "",
    email: "",
    created_at: "",
    reputation: 0,
  });

  

  const [userTags, setUserTags] = useState([]);

  const [editForm, setEditForm] = useState({
    visible: false,
    tagName: "",
    tagId: "",
  });
  const [editError, setEditError] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

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
    const fetchSessionData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/session");
        if (response.data && response.data.loggedIn) {
          setSessionData({
            loggedIn: true,
            username: response.data.username,
            email: response.data.email,
            created_at: response.data.created_at,
            reputation: response.data.reputation,
          });
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, []);

  useEffect(() => {
    const fetchUserTags = async () => {
      if (sessionData.loggedIn && sessionData.username) {
        try {
          // Updated Axios call to match server route
          const response = await axios.get(
            `http://localhost:8000/posts/tags/createdByUser/${sessionData.username}`
          );
          setUserTags(response.data);
        } catch (error) {
          console.error("Error fetching user's tags:", error);
        }
      }
    };

    fetchUserTags();
  }, [sessionData.loggedIn, sessionData.username]);

  // Add this function within your component
  const handleDeleteTag = async (tagId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/posts/tags/tag_id/${tagId}`,
        { withCredentials: true }
      );
      console.log(response.data.message);
      // Remove the tag from the local state to update the UI
      setUserTags((prevTags) => prevTags.filter((tag) => tag._id !== tagId));
    } catch (error) {
      console.error("Error deleting the tag:", error);
    }
  };

  const handleTagEdit = (tag) => {
    setEditForm({
      visible: true,
      tagName: tag.name,
      tagId: tag._id,
    });
  };

  const hideEditForm = () => {
    setEditForm({
      visible: false,
      tagName: "",
      tagId: "",
    });
    setEditError("");
  };

  const handleTagNameChange = (event) => {
    setEditForm((prevForm) => ({
      ...prevForm,
      tagName: event.target.value,
    }));
    setEditError("");
  };

  const handleSubmitEdit = async () => {
    const trimmedTagName = editForm.tagName.trim();

    if (!trimmedTagName) {
      setEditError("Tag name cannot be empty.");
      return;
    } else if (trimmedTagName.length > 10) {
      setEditError("Tag name should be 10 characters or less.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/posts/tags/tag_id/${editForm.tagId}`,
        { newName: trimmedTagName }
      );
      setUserTags((prevTags) =>
        prevTags.map((tag) =>
          tag._id === editForm.tagId ? { ...tag, name: trimmedTagName } : tag
        )
      );
      hideEditForm();
    } catch (error) {
      console.error("Error updating the tag:", error);
      setEditError(error.response?.data || "Error updating tag");
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

  // Grouping tags into rows of three
  const rows = [];
  for (let i = 0; i < userTags.length; i += 3) {
    rows.push(userTags.slice(i, i + 3));
  }

  const totalTagCount = userTags.length;

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
        borderBottom: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          left: "275.5px",
          borderTop: 0,
          borderRight: 0,
          borderLeft: 0,
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
          User Profile:{" "}
          {sessionData.loggedIn ? sessionData.username : "Loading..."}
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
          Member for: {memberSince}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "130px",
            position: "absolute",
            width: "100%",
          }}
        >
          {/* Display Tag Count */}
          <Typography
            variant="h6"
            sx={{
              fontSize: "16px",
              position: "absolute",
              left:"40px",
              fontSize: "18px",
              fontWeight: "bolder",
            }}
          >
            {totalTagCount} Tags
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: "18px",
              fontWeight: "bolder",
            }}
          >
            All {current} created by {sessionData.username}
          </Typography>
        </Box>
      </Box>
      {/* Grid layout for tags */}
      <Box sx={{ marginTop: "80px", width: "90%", position: "absolute" }}>
        <Grid container spacing={4} sx={{ paddingLeft: "100px" }}>
          {userTags.map((tag, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "55%",
                }}
              >
                <Box
                  sx={{
                    padding: "25px",
                    textAlign: "center",
                    border: "2px dashed",
                    borderColor: "gray",
                  }}
                >
                  <Typography variant="h6" color="primary">
                    {tag.name}
                  </Typography>
                  <Typography variant="body2">{tag.count} Questions</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      onClick={() => handleTagEdit(tag)}
                      sx={{
                        backgroundColor: "blue",
                        color: "white",
                        "&:hover": { backgroundColor: "darkblue" },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteTag(tag._id)}
                      sx={{
                        backgroundColor: "red",
                        color: "white",
                        "&:hover": { backgroundColor: "darkred" },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Modal open={editForm.visible} onClose={hideEditForm}>
        <Box sx={{ ...style }}>
          <TextField
            label="Tag Name"
            fullWidth
            value={editForm.tagName}
            onChange={handleTagNameChange}
            error={!!editError}
            helperText={editError || " "}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box mr={1} width="50%">
              <Button
                onClick={hideEditForm}
                color="secondary"
                fullWidth
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
                    color: "white",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
            <Box width="50%">
              {" "}
              {/* Half width */}
              <Button
                onClick={handleSubmitEdit}
                variant="contained"
                color="primary"
                fullWidth
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Box
        sx={{
          width: "100%",
          paddingBottom: 5,
          position: "absolute",
          border: 3,
          borderColor: "black",
          borderStyle: "dotted",
          bottom: "0px",
          top: "775px",
          borderBottom: 0,
          borderRight: 0,
          borderLeft: 0,
        }}
      >
        <Button
          variant="contained"
          sx={{ marginTop: "5px", marginRight: "5px", left: "350px" }}
          onClick={goTags}
        >
          All Tags Made by{" "}
          {sessionData.loggedIn ? sessionData.username : "Loading..."}
        </Button>
        <Button
          variant="contained"
          sx={{ marginTop: "5px", left: "350px" }}
          onClick={goAnswers}
        >
          Questions Answered By{" "}
          {sessionData.loggedIn ? sessionData.username : "Loading..."}
        </Button>
        <Button
          variant="contained"
          sx={{ marginTop: "5px", left: "355px" }}
          onClick={goQuestions}
        >
          Questions By{" "}
          {sessionData.loggedIn ? sessionData.username : "Loading..."}
        </Button>
      </Box>
    </Box>
  );
};

export default UsersPageT;
