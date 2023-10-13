import React, { useState, useEffect } from "react";
import AskQuestionButton from "../QuestionsPage/AskQuestionButton";
import "../../stylesheets/QuestionDetailTop.css";
import Model from "../../models/model";
import { useParams } from "react-router-dom";

const QuestionDetailTop = () => {
  const [question, setQuestion] = useState(null);
  const { questionId } = useParams();
  const model = Model.getInstance();

  useEffect(() => {
    // Retrieve the question details based on the questionId extracted from the URL
    const currentQuestion = model.getQuestionById(questionId);
    setQuestion(currentQuestion);
  }, [questionId]);

  return (
    <div className="questionDetailTopContainer">
      <h1 id="numOfAnswers">
        {question && question.ansIds.length + " Answers"}
      </h1>
      <h2 id="questionTitle">{question && question.title}</h2>
        <AskQuestionButton />
    </div>
  );
};

export default QuestionDetailTop;
