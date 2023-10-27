import React, { useState, useEffect } from "react";
import AskQuestionButton from "../QuestionsPage/AskQuestionButtonForSelectedPage";
import "../../stylesheets/QuestionDetailTop.css";
import axios from "axios";

const QuestionDetailTop = ({ questionId, onAskQuestionPress }) => {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    // Retrieve the question details based on the questionId using axios
    axios.get(`http://localhost:8000/posts/questions/${questionId}`)
      .then(response => {
        setQuestion(response.data);
      })
      .catch(error => {
        console.error("Error fetching question details:", error);
      });
  }, [questionId]);

  return (
    <div className="questionDetailTopContainer">
      <h1 id="numOfAnswers">
        {question && question.answers.length + " Answers"}
      </h1>
      <h2 id="questionTitle">{question && question.title}</h2>
      <AskQuestionButton onPress={onAskQuestionPress} />
    </div>
  );
};

export default QuestionDetailTop;
