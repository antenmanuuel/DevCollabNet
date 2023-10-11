import React, { useEffect, useState } from "react";
import "../../stylesheets/QuestionTable.css";
import Model from "../../models/model";
import formatDate from "../../utils/formatDate";

const QuestionTable = () => {
  const [questionsData, setQuestionData] = useState([]);
  const model = new Model();

  useEffect(() => {
    const questions = model.getAllQuestions();
    const formattedQuestions = questions.map((question) => {
      const tagNames = question.tagIds.map((tagId) =>
        model.getTagNameById(tagId)
      );
      const formattedDate = formatDate(new Date(question.askDate));

      return {
        ...question,
        tagNames,
        formattedDate,
      };
    });
    setQuestionData(formattedQuestions);
  }, []);

  return (
    <div className="questionTableContainer">
      <div className="question">
        <table id="question-table">
          {questionsData.map((question, index) => (
            <tr key={index} data-qid={question.qid} id="tr1">
              <td id="td1">
                <ul>
                  <li id="num_ans">{question.ansIds.length} answers</li>
                  <li id="num_ques">{question.views} views</li>
                </ul>
              </td>
              <td id="td2">
                <ul id="ulrow2">
                  <li id="title_questions">
                    <button id="link_ans">
                      <p id="paraf">{question.title}</p>
                    </button>
                  </li>
                  <li>
                    <ul id="ulrow3">
                      {question.tagNames.map((tagName, index) => (
                        <li key={index} id={`keyword-${index + 1}`}>
                          {tagName}
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </td>
              <td id="who_asked">
                <p>
                  <span style={{ color: "red" }}>{question.askedBy}</span>
                  <span style={{ color: "gray" }}>
                    {" "}
                    asked {question.formattedDate}
                  </span>
                </p>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
