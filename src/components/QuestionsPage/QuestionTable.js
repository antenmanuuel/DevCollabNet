import React, { useEffect, useState } from "react";
import "../../stylesheets/QuestionTable.css";
import Model from "../../models/model";
import Helper from "../../utils/Helper";

const QuestionTable = ({ updateKey, onQuestionTitleClick, filter, questions }) => {
  const [questionsData, setQuestionData] = useState([]);
  const model = Model.getInstance();
  const helper = new Helper();

  useEffect(() => {
    let fetchedQuestions = questions || model.getAllQuestions();

    fetchedQuestions = fetchedQuestions.map((question) => {
      const tagNames = question.tagIds.map((tagId) =>
        model.getTagNameById(tagId)
      );
      const formattedDate = helper.formatDate(new Date(question.askDate));
      return {
        ...question,
        tagNames,
        formattedDate,
      };
    });

    switch (filter) {
      case 'newest':
        fetchedQuestions.sort((a, b) => new Date(b.askDate) - new Date(a.askDate));
        break;
      case 'active':
        fetchedQuestions.sort((a, b) => {
          const aLastAnswerDate = model.getMostRecentAnswerDateForQuestion(a);
          const bLastAnswerDate = model.getMostRecentAnswerDateForQuestion(b);
          if (aLastAnswerDate.getTime() === bLastAnswerDate.getTime()) {
            return new Date(b.askDate) - new Date(a.askDate);
          }
          return bLastAnswerDate - aLastAnswerDate;
        });
        break;
      case 'unanswered':
        fetchedQuestions = fetchedQuestions.filter(question => question.ansIds.length === 0);
        break;
      default:
        fetchedQuestions.sort(helper.sortNewestToOldest());
    }

    setQuestionData(fetchedQuestions);
  }, [updateKey, filter, questions]);

  const handleQuestionTitleClickLocal = (questionId) => {
    model.incrementViewsForQuestion(questionId);
    setQuestionData((prevQuestions) =>
      prevQuestions.map((question) =>
        question.qid === questionId ? { ...question, views: question.views + 1 } : question
      )
    );
    if (onQuestionTitleClick) {
      onQuestionTitleClick(questionId);
    }
  };

  return (
    <div className="questionTableContainer">
        <table id="question-table">
        <div className="question">
          {questionsData.length > 0 ? 
            questionsData.map((question, index) => (
              <tr key={index} data-qid={question.qid} id="tr1">
                <td id="td1">
                  <ul>
                    <li id="num_ans"style={{paddingLeft:"30px"}}>{question.ansIds.length} answers</li>
                    <li id="num_ques"style={{paddingLeft:"30px"}}>{question.views} views</li>
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
            ))
            : 
            ( 
              <tr>
                <td colSpan="3" style={{textAlign: 'center'}}>No questions found</td>
              </tr>
            )
          }
          </div>
        </table>
      </div>
  );
};

export default QuestionTable;