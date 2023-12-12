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
  ButtonGroup,
  Modal,
  TextField,
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
          {sessionData.loggedIn ? sessionData.reputation : "Loading..."}
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
          All {current} created by {sessionData.username}
        </Typography>
      </Box>
      <Table sx={{ width: "100%" }}>
        <TableBody>
          {userTags.map((tag) => (
            <TableRow
              key={tag.tagId}
              sx={{
                borderBottom: "3px",
                borderStyle: "dotted",
              }}
            >
              <TableCell sx={{ width: "65%", cursor: "pointer" }}>
                <Typography
                  onClick={() => handleTagEdit(tag)}
                  sx={{ color: "blue", fontSize: "large" }}
                >
                  {tag.name}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  width: "35%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={() => handleDeleteTag(tag._id)}
                  sx={{
                    color: "black",
                    fontSize: "medium",
                    backgroundColor: "red",
                    border: 3,
                    borderRadius: "16px",
                    textAlign: "center",
                    borderColor: "red",
                    marginleft: "20px",
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
          Questions with Answers By{" "}
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
