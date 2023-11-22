import React, { useEffect, useState } from "react";
import axios from "axios";
import AskQuestionButton from "./AskQuestionButtonForTagsPage";
import { Box, Typography } from "@mui/material";

const TagsTop = ({ onAskQuestionPress }) => {
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
        width: "89.21%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            position: "absolute",
            top: "100px",
            left: "300px",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          {numOfTags} Tags
        </Typography>
        <Typography
          variant="h5"
          sx={{
            position: "absolute",
            top: "100px",
            left: "900px",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          All Tags
        </Typography>
      </Box>
      <AskQuestionButton onPress={onAskQuestionPress} />
    </Box>
  );
};

export default TagsTop;
