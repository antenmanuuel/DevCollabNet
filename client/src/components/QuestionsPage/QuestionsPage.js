import React, { useState, useEffect, useCallback } from "react";
import "../../stylesheets/QuestionsPage.css";
import QuestionTop from "./QuestionTop";
import QuestionTable from "./QuestionTable";
import axios from "axios";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import SelectedQuestionPage from "../SelectedQuestionPage/SelectedQuestionPage";

const QuestionsPage = ({ selectedTag = null, searchTerm, setSearchTerm }) => {
  const [, setQuestions] = useState([]); 
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
    <div className="questionContainer">
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
    </div>
  );
};

export default QuestionsPage;