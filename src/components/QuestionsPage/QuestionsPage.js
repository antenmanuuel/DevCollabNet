import React, { useState, useEffect } from "react";
import "../../stylesheets/QuestionsPage.css";
import QuestionTop from "./QuestionTop";
import QuestionTable from "./QuestionTable";
import Model from "../../models/model";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import SelectedQuestionPage from "../SelectedQuestionPage/SelectedQuestionPage";

const QuestionsPage = () => {
  const model = Model.getInstance();
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [updateKey, setUpdateKey] = useState(0); // This will be our trigger for re-fetching questions\\
  
  useEffect(() => {
    const totalQuestions = model.getAllQuestions().length;
    setNumOfQuestions(totalQuestions);
  }, [updateKey]); // Using updateKey to trigger re-fetching the question count

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
      <QuestionTop numOfQuestions={numOfQuestions} onAskQuestionPress={handleAskQuestionPress} />
      <QuestionTable updateKey={updateKey} onQuestionTitleClick={handleQuestionTitleClick} />
    </div>
  );
};

export default QuestionsPage;