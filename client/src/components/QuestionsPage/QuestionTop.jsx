import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Helper from "../../utils/Helper";
import { Box, Typography, Button } from "@mui/material";

const QuestionTop = ({
  onAskQuestionPress,
  setFilter,
  searchTerm,
  selectedTag,
  sessionData
}) => {
  const [questionCount, setQuestionCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState("newest");

  const fetchQuestionCount = useCallback(
    async (filter) => {
      const helper = new Helper();
      let endpoint = "http://localhost:8000/posts/questions";
      if (selectedTag) {
        endpoint = `http://localhost:8000/posts/tags/tag_id/${selectedTag}/questions`;
      }
      if (filter) {
        endpoint += `/${filter}`;
      }

      try {
        const response = await axios.get(endpoint);
        let filteredQuestions = response.data;
        if (searchTerm) {
          filteredQuestions = await helper.filterQuestionsBySearchTerm(
            searchTerm,
            filteredQuestions
          );
        }
        setQuestionCount(filteredQuestions.length);
      } catch (error) {
        console.error("Error fetching questions count:", error);
      }
    },
    [selectedTag, searchTerm, sessionData]
  );

  useEffect(() => {
    fetchQuestionCount();
  }, [selectedTag, searchTerm, fetchQuestionCount]);

  const handleFilterChange = useCallback(
    (newFilter) => {
      setActiveFilter(newFilter);
      setFilter(newFilter);
      fetchQuestionCount(newFilter);
    },
    [setFilter, fetchQuestionCount]
  );

  const getButtonVariant = (filterName) => {
    return activeFilter === filterName ? "contained" : "outlined";
  };

  return (
    <Box sx={{ width: "100%", paddingBottom: 5, position: "absolute" }}>
      <Typography
        variant="h4"
        sx={{
          position: "absolute",
          top: "-40px",
          left: "30px",
          fontSize: "25px",
          fontWeight: "bolder",
        }}
      >
        {searchTerm ? "Search Results" : "All Questions"}
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

            '@media (max-width: 1920px)': {
              marginLeft: "1450px",
              marginTop: "-50px",
            },
        
            '@media (min-width: 1921px)': {
              marginLeft: "2050px", 
              marginTop: "-50px",
            },
          }}
        >
          Ask Question
        </Button>
      )}

      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: "20px",
          left: "30px",
          fontSize: "20px",
        }}
      >
        {`${questionCount} Questions`}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: 300,
          border: 3,
          borderColor: "grey.300",
          borderStyle: "solid",
          p: 1,
        
          // Media query for screens up to 1920px (inclusive)
          '@media (max-width: 1920px)': {
            marginLeft: "1025px", // Adjust as needed for smaller screens
            marginTop: "-5px",
          },
        
          // Media query for screens larger than 1920px
          '@media (min-width: 1921px)': {
            marginLeft: "1500px", // Adjust for larger screens
            marginTop: "-5px",
          },
        }}
      >
        <Button
          variant={getButtonVariant("newest")}
          onClick={() => handleFilterChange("newest")}
          sx={{
            marginRight: 1,
            color: "white", 
            bgcolor: activeFilter === "newest" ? "black" : "grey",
            "&:hover": {
              bgcolor: "grey.700",
              border:"none"
            },
            border:"none"
          }}
        >
          Newest
        </Button>

        <Button
          variant={getButtonVariant("active")}
          onClick={() => handleFilterChange("active")}
          sx={{
            marginRight: 1,
            color: "white",
            bgcolor: activeFilter === "active" ? "black" : "grey",
            "&:hover": {
              bgcolor: "grey.700",
              border:"none"
            },
            border:"none"
          }}
        >
          Active
        </Button>

        <Button
          variant={getButtonVariant("unanswered")}
          onClick={() => handleFilterChange("unanswered")}
          sx={{
            marginRight: 1,
            color: "white",
            bgcolor: activeFilter === "unanswered" ? "black" : "grey",
            "&:hover": {
              bgcolor: "grey.700",
              border:"none"
            },
            border:"none"
          }}
        >
          Unanswered
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionTop;
