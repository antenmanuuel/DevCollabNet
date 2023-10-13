import React, { useState, useEffect } from "react";
import "../../stylesheets/QuestionDetail.css";
import Model from "../../models/model";
import Helper from "../../utils/Helper";
import { useParams } from "react-router-dom";
const QuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const { questionId } = useParams();
  const model = Model.getInstance();
  const helper = new Helper();

  useEffect(() => {
    const currentQuestion = model.getQuestionById(questionId);
    setQuestion(currentQuestion);
  }, [questionId]);
  return (
    <div className="questionDetailContainer">
      <table class="questionDetails">
        <tr id="tr-ans">
          <th id="numOfViews"> {question && question.views} views</th>
          <th id="questionText">{question && question.text}</th>
          <th id="author">{question && question.askedBy}</th>
          <th id="askedBy">asked {question && helper.formatDate(new Date(question.askDate))}</th>
        </tr>
      </table>
    </div>
  );
};

export default QuestionDetail;
