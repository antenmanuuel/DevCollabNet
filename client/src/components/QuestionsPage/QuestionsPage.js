import React, { useState, useEffect, useCallback } from "react";
import "../../stylesheets/QuestionsPage.css";
import QuestionTop from "./QuestionTop";
import QuestionTable from "./QuestionTable";
import axios from 'axios'; 
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import SelectedQuestionPage from "../SelectedQuestionPage/SelectedQuestionPage";

const QuestionsPage = () => {
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [updateKey, setUpdateKey] = useState(0);
  const [isQuestionPageVisible, setIsQuestionPageVisible] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);

  useEffect(() => {
    // Fetch the count of all questions using axios
    axios.get('http://localhost:8000/posts/questions')
      .then(response => {
        setNumOfQuestions(response.data.length);
      })
      .catch(error => {
        console.error("Error fetching all questions count:", error);
      });
  }, []);

  const handleAskQuestionPress = useCallback(() => {
    setIsQuestionPageVisible(false);
    setShowQuestionsForm((prev) => !prev);
  }, []);

  const handleFilterChange = useCallback(() => {
    // Temporarily empty as filter logic is commented out
  }, []);

  const handleQuestionAdded = useCallback(() => {
    setUpdateKey((prevKey) => prevKey + 1);
  }, []);


  const handleQuestionTitleClick = useCallback((questionId) => {
    axios.patch(`http://localhost:8000/posts/questions/incrementViews/${questionId}`)
      .then(() => {
        setUpdateKey((prevKey) => prevKey + 1);  // Trigger a re-fetch of data
      })
      .catch(error => {
        console.error("Error incrementing views:", error);
      });
      setIsQuestionPageVisible(false);
      setSelectedQuestionId(questionId);
  }, []);

  if (!isQuestionPageVisible) {
    if (showQuestionsForm) {
      return (
        <QuestionsForm 
          onQuestionAdded={handleQuestionAdded}
          // setSearchTerm={setSearchTerm}
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
        // setFilter={handleFilterChange}
        // searchTerm={searchTerm}
      />
      <QuestionTable 
        onQuestionTitleClick={handleQuestionTitleClick} 
        // filter={filter}
        // questions={filteredQuestions}
      />
    </div>
  );
};

export default QuestionsPage;
