import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../stylesheets/QuestionDetail.css";
import Helper from "../../utils/Helper";

const QuestionDetail = ({ questionId }) => {
  const [question, setQuestion] = useState(null);
  const helper = new Helper();

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
    <div className="questionDetailContainer">
      <table className="questionDetails">
        <tr id="tr-ans">
          <th id="numOfViews">{question && question.views} views</th>
          <th id="questionText">{question && helper.renderTextWithLinks(question.text)}</th>
          <th id="author">{question && question.asked_by}</th>
          <th id="askedBy">asked {question && helper.formatDate(new Date(question.ask_date_time))}</th>
        </tr>
      </table>
    </div>
  );
};

export default QuestionDetail;
