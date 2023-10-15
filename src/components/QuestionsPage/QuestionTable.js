import React, { useEffect, useState } from "react";
import "../../stylesheets/QuestionTable.css";
import Model from "../../models/model";
import Helper from "../../utils/Helper";

const QuestionTable = ({ updateKey, onQuestionTitleClick }) => {
  const [questionsData, setQuestionData] = useState([]);
  const model = Model.getInstance();
  const helper = new Helper();

  useEffect(() => {
    const questions = model.getAllQuestions();
    const formattedQuestions = questions
      .map((question) => {
        const tagNames = question.tagIds.map((tagId) =>
          model.getTagNameById(tagId)
        );
        const formattedDate = helper.formatDate(new Date(question.askDate));
        return {
          ...question,
          tagNames,
          formattedDate,
        };
      })
      .sort(helper.sortNewestToOldest());
    setQuestionData(formattedQuestions);
  }, [updateKey]);

  const handleQuestionTitleClickLocal = (questionId) => {
    model.incrementViewsForQuestion(questionId);

    // Update local state to reflect the new views count
    setQuestionData((prevQuestions) =>
      prevQuestions.map((q) =>
        q.qid === questionId ? { ...q, views: q.views + 1 } : q
      )
    );

    if (onQuestionTitleClick) {
      onQuestionTitleClick(questionId);
    }
  };

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
                    <div
                      id="link_ans"
                      onClick={() =>
                        handleQuestionTitleClickLocal(question.qid)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div id="paraf">{question.title}</div>
                    </div>
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
                  <span style={{ color: "red" }}>{question.askedBy}</span>{" "}
                  <span style={{ color: "gray" }}>
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
