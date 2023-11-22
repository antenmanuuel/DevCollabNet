import React, { useState, useEffect } from "react";
import AskQuestionButton from "../QuestionsPage/AskQuestionButtonForSelectedPage";
import axios from "axios";
import { Box, Typography } from "@mui/material";

const QuestionDetailTop = ({ questionId, onAskQuestionPress }) => {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/posts/questions/${questionId}`)
      .then((response) => {
        setQuestion(response.data);
      })
      .catch((error) => {
        console.error("Error fetching question details:", error);
      });
  }, [questionId]);

  return (
    <Box
      sx={{
        marginLeft: "200px",
        marginTop: "-60px",
        width: "80%",
        height: "8%",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginLeft: "40px",
          marginTop: "100px",
          width: "200px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
        id="numOfAnswers"
      >
        {question && `${question.answers.length} Answers`}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          paddingLeft: "300px",
          marginTop: "-30px",
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "bold",
        }}
        id="questionTitle"
      >
        {question && question.title}
      </Typography>
      <AskQuestionButton onPress={onAskQuestionPress} />
    </Box>
  );
};

export default QuestionDetailTop;
