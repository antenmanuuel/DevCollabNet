import React, { useState, useEffect } from "react";
import "../../stylesheets/QuestionDetail.css";
import Model from "../../models/model";
import Helper from "../../utils/Helper";

const QuestionDetail = ({ questionId }) => {
  const [question, setQuestion] = useState(null);
  const model = Model.getInstance();
  const helper = new Helper();

  useEffect(() => {
    const currentQuestion = model.getQuestionById(questionId);
    setQuestion(currentQuestion);
  }, [questionId]);

  return (
    <div className="questionDetailContainer">
      <table className="questionDetails">
        <tr id="tr-ans">
          <th id="numOfViews">{question && question.views} views</th>
          <th id="questionText">{question && question.text}</th>
          <th id="author">{question && question.askedBy}</th>
          <th id="askedBy">asked {question && helper.formatDate(new Date(question.askDate))}</th>
        </tr>
      </table>
    </div>
  );
};

export default QuestionDetail;
