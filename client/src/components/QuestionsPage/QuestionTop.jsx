import React, { useEffect, useState, useCallback } from "react";
import AskQuestionButton from "./AskQuestionButtonForHomePage";
import Filter from "./Filter";
import axios from "axios";
import Helper from "../../utils/Helper";
import { Box, Typography } from "@mui/material";

const QuestionTop = ({
  onAskQuestionPress,
  setFilter,
  searchTerm,
  selectedTag,
}) => {
  const [questionCount, setQuestionCount] = useState(0);

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
    [selectedTag, searchTerm]
  );

  useEffect(() => {
    fetchQuestionCount();
  }, [selectedTag, searchTerm, fetchQuestionCount]);

  const handleFilterChange = useCallback(
    (newFilter) => {
      setFilter(newFilter);
      fetchQuestionCount(newFilter);
    },
    [setFilter, fetchQuestionCount]
  );

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
      <AskQuestionButton onPress={onAskQuestionPress} />
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
      <Filter onSetFilter={handleFilterChange} />
    </Box>
  );
};

export default QuestionTop;
