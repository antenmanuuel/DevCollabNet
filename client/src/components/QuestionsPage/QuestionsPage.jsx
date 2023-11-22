import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import SelectedQuestionPage from "../SelectedQuestionPage/SelectedQuestionPage";
import QuestionTop from "./QuestionTop";
import QuestionTable from "./QuestionTable";
import { styled } from "@mui/system";

const QuestionContainer = styled(Box)(() => ({
  width: "89.2%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  marginLeft: "200px",
  marginTop: "75px",
}));

const QuestionsPage = ({ selectedTag = null, searchTerm, setSearchTerm }) => {
  const [questions, setQuestions] = useState([]);
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [updateKey, setUpdateKey] = useState(0);
  const [isQuestionPageVisible, setIsQuestionPageVisible] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);
  const [filter, setFilter] = useState("newest");

  useEffect(() => {
    let fetchUrl = "http://localhost:8000/posts/questions";
    if (selectedTag) {
      fetchUrl = `http://localhost:8000/posts/tags/tag_id/${selectedTag}/questions`;
    }

    axios
      .get(fetchUrl)
      .then((response) => {
        setQuestions(response.data);
        setNumOfQuestions(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, [selectedTag, updateKey]);

  const handleAskQuestionPress = useCallback(() => {
    setIsQuestionPageVisible(false);
    setShowQuestionsForm((prev) => !prev);
  }, []);

  const handleFilterChange = useCallback((selectedFilter) => {
    setFilter(selectedFilter);
  }, []);

  const handleQuestionAdded = useCallback(() => {
    setUpdateKey((prevKey) => prevKey + 1);
  }, []);

  const handleQuestionTitleClick = useCallback((questionId) => {
    setIsQuestionPageVisible(false);
    setSelectedQuestionId(questionId);
  }, []);

  if (!isQuestionPageVisible) {
    if (showQuestionsForm) {
      return (
        <QuestionsForm
          onQuestionAdded={handleQuestionAdded}
          setSearchTerm={setSearchTerm}
        />
      );
    }
    if (selectedQuestionId) {
      return <SelectedQuestionPage questionId={selectedQuestionId} />;
    }
  }

  return (
    <QuestionContainer>
      <QuestionTop
        numOfQuestions={numOfQuestions}
        onAskQuestionPress={handleAskQuestionPress}
        setFilter={handleFilterChange}
        selectedTag={selectedTag}
        searchTerm={searchTerm}
      />
      <QuestionTable
        onQuestionTitleClick={handleQuestionTitleClick}
        filter={filter}
        selectedTag={selectedTag}
        searchTerm={searchTerm}
      />
    </QuestionContainer>
  );
};

export default QuestionsPage;
