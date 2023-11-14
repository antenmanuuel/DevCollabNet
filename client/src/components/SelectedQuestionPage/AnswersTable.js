import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../stylesheets/AnswersTable.css";
import Helper from "../../utils/Helper";

const AnswersTable = ({ questionId }) => {
  const [answers, setAnswers] = useState([]);
  const helper = new Helper();

  useEffect(() => {
    // Retrieve the answers for the question using axios
    axios.get(`http://localhost:8000/posts/answers/${questionId}`)
      .then(response => {
        const sortedAnswers = response.data.sort((a, b) => new Date(b.ansDate) - new Date(a.ansDate));
        setAnswers(sortedAnswers);
      })
      .catch(error => {
        console.error("Error fetching answers:", error);
      });
  }, [questionId]);

  return (
    <div className="answers">
      <table className="answersTable">
      <tbody>
        {answers.map((answer) => (
          <tr key={answer._id} id="tr1">
            <td id="answerText">{helper.renderTextWithLinks(answer.text)}</td>
            <td>
              <ul className="authorAndDate">
                <li id="author">
                  {answer.ans_by}
                </li>
                <li id="date">
                  answered {helper.formatDate(new Date(answer.ans_date_time))}
                </li>
              </ul>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnswersTable;
