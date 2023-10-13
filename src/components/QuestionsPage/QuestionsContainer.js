import React, { useState, useEffect } from "react";
import "../../stylesheets/QuestionContainer.css";
import QuestionTop from "./QuestionTop";
import QuestionTable from "./QuestionTable";
import Model from "../../models/model";
import { useLocation } from "react-router-dom";
import QuestionsForm from "../QuestionsForm/QuestionsForm";

const QuestionsContainer = () => {
  const model = Model.getInstance();
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [updateKey, setUpdateKey] = useState(0); // This will be our trigger for re-fetching questions
  
  useEffect(() => {
    const totalQuestions = model.getAllQuestions().length;
    setNumOfQuestions(totalQuestions);
  }, [updateKey]); // Using updateKey to trigger re-fetching the question count
  
  // Function to update the question count and trigger a re-fetch of data in child components
  const handleQuestionAdded = () => {
    setUpdateKey((prevKey) => prevKey + 1);
  };

  let location = useLocation();
  
  return (
    <div className="questionContainer">
      <QuestionTop numOfQuestions={numOfQuestions} />
      {location.pathname === "/askQuestion" ? (
        <QuestionsForm onQuestionAdded={handleQuestionAdded} />
      ) : (
        <QuestionTable updateKey={updateKey} />
      )}
    </div>
  );
};

export default QuestionsContainer;
