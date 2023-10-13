import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Model from "../../models/model";
import "../../stylesheets/AnswersTable.css";

const AnswersTable = () => {
  const { questionId } = useParams();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const model = Model.getInstance();
    const fetchedQuestion = model.getQuestionById(questionId);

    const ans = fetchedQuestion.ansIds
      .map((ansId) => model.getAnswerById(ansId))
      .sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));
    setAnswers(ans);
  }, [questionId]);

  return (
    <div className="answersContainer">
      <div className="answers">
        <table id="answersTable">
          {answers.map((answer) => (
            <tr key={answer.aid} id="tr1">
              <td id="answerText">{answer.text}</td>
              <td id="author">{answer.ansBy}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default AnswersTable;
