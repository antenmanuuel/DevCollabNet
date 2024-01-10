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
        flexDirection: "row",
        alignItems: "center",


        "@media (max-width: 1920px)": {
          marginTop: "-800px", 
        },

        "@media (min-width: 1921px)": {
          marginTop: "-1200px", 
        },
      }}
    >
      <Box
        sx={{
          marginLeft: "80px",

        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontSize: "25px",

          }}
        >
          {numOfTags} Tags
        </Typography>
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          fontSize: "25px",


          "@media (max-width: 1920px)": {
            marginLeft: "100px",
          },

       
          "@media (min-width: 1921px)": {
            marginLeft: "200px", 
          },
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

           
            "@media (max-width: 1920px)": {
              marginLeft: "1000px", 
            },

            "@media (min-width: 1921px)": {
              marginLeft: "1400px", 
            },
          }}
        >
          Ask Question
        </Button>
      )}
    </Box>
  );
};

export default TagsTop;
