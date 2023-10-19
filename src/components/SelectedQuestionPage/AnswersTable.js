import React, { useEffect, useState } from "react";
import Model from "../../models/model";
import "../../stylesheets/AnswersTable.css";
import Helper from "../../utils/Helper";
import AnswerButton from "./AnswerButton";

const AnswersTable = ({ questionId }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const model = Model.getInstance();
    const fetchedQuestion = model.getQuestionById(questionId);

    const ans = fetchedQuestion.ansIds
      .map((ansId) => model.getAnswerById(ansId))
      .sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));
    setAnswers(ans);
  }, [questionId]);

  const helper = new Helper();

  return (
    
      <div className="answers">
        <table className="answersTable">
          {answers.map((answer) => (
            <tr key={answer.aid} id="tr1">
              <td id="answerText">{helper.renderTextWithLinks(answer.text)}</td>
              <td>
                <ul className="authorAndDate">
                  <li id="author">
                    {answer.ansBy}
                  </li>
                  <li id="date">
                    answered {helper.formatDate(new Date(answer.ansDate))}
                  </li>
                </ul>
              </td>
            </tr>
          ))}
        </table>
      </div>
   
  );
};

export default AnswersTable;
