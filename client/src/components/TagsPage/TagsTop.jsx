import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";

const TagsTop = ({ onAskQuestionPress, sessionData }) => {
  const [numOfTags, setNumOfTags] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:8000/posts/tags")
      .then((response) => {
        setNumOfTags(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "-900px",
      }}
    >
      <Box sx={{ marginLeft: "80px" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "25px" }}>
          {numOfTags} Tags
        </Typography>
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          fontSize: "25px",
          marginLeft: "200px",
        }}
      >
        All Tags
      </Typography>

      {sessionData.loggedIn && (
        <Button
          variant="contained"
          color="primary"
          onClick={onAskQuestionPress}
          sx={{
            width: 150,
            padding: "10px",
            textTransform: "none",
            marginLeft: "1000px",
          }}
        >
          Ask Question
        </Button>
      )}
    </Box>
  );
};

export default TagsTop;
