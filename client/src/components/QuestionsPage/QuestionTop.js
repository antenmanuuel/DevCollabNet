import React, { useEffect, useState, useCallback } from "react";
import "../../stylesheets/QuestionTop.css";
import AskQuestionButton from "./AskQuestionButtonForHomePage";
import Filter from "./Filter";
import axios from "axios";
import Helper from "../../utils/Helper";

const QuestionTop = ({
  onAskQuestionPress,
  setFilter,
  searchTerm,
  selectedTag,
}) => {
  const [questionCount, setQuestionCount] = useState(0);
  const helper = new Helper();

  const fetchQuestionCount = useCallback(
    async (filter) => {
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
          filteredQuestions = await helper.filterQuestionsBySearchTerm(searchTerm, filteredQuestions);
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
    <div className="questionTop">
      <h1 id="allQuestionID">
        {searchTerm ? "Search Results" : "All Questions"}
      </h1>
      <AskQuestionButton onPress={onAskQuestionPress} />
      <h4 id="numQuestion">{`${questionCount} Questions`}</h4>
      <Filter onSetFilter={handleFilterChange} />
    </div>
  );
};

export default QuestionTop;