import React, { useState, useEffect } from "react";
import AskQuestionButton from "../QuestionsPage/AskQuestionButton";
import "../../stylesheets/QuestionDetailTop.css";
import Model from "../../models/model";


const QuestionDetailTop = ({ questionId, onAskQuestionPress }) => {
  const [question, setQuestion] = useState(null);
  const model = Model.getInstance();

  useEffect(() => {
    // Retrieve the question details based on the questionId
    const currentQuestion = model.getQuestionById(questionId);
    setQuestion(currentQuestion);
  }, [questionId]);

  

  return (
    <div className="questionDetailTopContainer">
      <h1 id="numOfAnswers">
        {question && question.ansIds.length + " Answers"}
      </h1>
      <h2 id="questionTitle">{question && question.title}</h2>
      <AskQuestionButton onPress={onAskQuestionPress} />
    </div>
  );
};

export default QuestionDetailTop;
