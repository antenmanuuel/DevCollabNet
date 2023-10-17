import React, { useState, useEffect } from "react";
import "../../stylesheets/QuestionsPage.css";
import QuestionTop from "./QuestionTop";
import QuestionTable from "./QuestionTable";
import Model from "../../models/model";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import SelectedQuestionPage from "../SelectedQuestionPage/SelectedQuestionPage";

const QuestionsPage = ({ questions }) => {
  const model = Model.getInstance();
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [updateKey, setUpdateKey] = useState(0); // This will be our trigger for re-fetching questions
  const [filter, setFilter] = useState('newest'); // default to 'newest'
  
  useEffect(() => {
    const allQuestions = questions || model.getAllQuestions();  // Use passed questions prop or fetch all questions

    const totalQuestions = allQuestions.length;
    setNumOfQuestions(totalQuestions);
  }, [updateKey, questions]); // Using updateKey to trigger re-fetching the question count

  const [isQuestionPageVisible, setIsQuestionPageVisible] = useState(true);
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);

  const handleAskQuestionPress = () => {
    setIsQuestionPageVisible(false);
    setShowQuestionsForm(!showQuestionsForm);
  };

  const handleQuestionTitleClick = (questionId) => {
    setIsQuestionPageVisible(false);
    setSelectedQuestionId(questionId);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  }

  if (!isQuestionPageVisible) {
    if (showQuestionsForm) {
      return <QuestionsForm />;
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
        setFilter={handleFilterChange} // Pass the filter change handler to QuestionTop
      />
      <QuestionTable 
        updateKey={updateKey} 
        onQuestionTitleClick={handleQuestionTitleClick} 
        filter={filter} // Pass the current filter to the QuestionTable
        questions={questions}  // Pass the questions prop to the QuestionTable (if it's provided)
      />
    </div>
  );
};

export default QuestionsPage;