import React, { useEffect, useState } from "react";
import "../../stylesheets/QuestionTable.css";
import Helper from "../../utils/Helper";
import axios from "axios";

const QuestionTable = ({ updateKey, filter, onQuestionTitleClick }) => {
  const [questionsData, setQuestionData] = useState([]);
  const helper = new Helper();

  useEffect(() => {
    axios.get('http://localhost:8000/posts/tags')
      .then(response => {
        const tagMap = {};
        response.data.forEach(tag => {
          tagMap[tag._id] = tag.name;
        });
        return tagMap;
      })
      .then(tagMap => {
        const endpoint = 'http://localhost:8000/posts/questions';
        return axios.get(endpoint).then(response => ({ questions: response.data, tagMap }));
      })
      .then(({ questions, tagMap }) => {
        const processedQuestions = questions.map(question => ({
          ...question,
          tagNames: question.tags.map(tagId => tagMap[tagId] || "Unknown Tag"),
          formattedDate: helper.formatDate(new Date(question.ask_date_time))
        }));
        setQuestionData(processedQuestions);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }, [updateKey, filter]);

  const handleQuestionTitleClickLocal = (questionId) => {
    axios.patch(`http://localhost:8000/posts/questions/incrementViews/${questionId}`)
      .then(response => {
        setQuestionData((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === questionId ? { ...question, views: question.views + 1 } : question
          )
        );
        if (onQuestionTitleClick) {
          onQuestionTitleClick(questionId);
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="questionTableContainer">
      <table id="question-table">
        <div className="question">
          {questionsData.length > 0 ? 
            questionsData.map((question, index) => (
              <tr key={index} data-qid={question._id} id="tr1">
                <td id="td1">
                  <ul>
                    <li id="num_ans" style={{paddingLeft:"30px"}}>{question.answers.length} answers</li>
                    <li id="num_ques" style={{paddingLeft:"30px"}}>{question.views} views</li>
                  </ul>
                </td>
                <td id="td2">
                  <ul id="ulrow2">
                    <li id="title_questions">
                      <div
                        id="link_ans"
                        onClick={() => handleQuestionTitleClickLocal(question._id)}
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
                    <span style={{ color: "red" }}>{question.asked_by}</span>{" "}
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
                <td colSpan="3" style={{textAlign: 'center', paddingLeft:"30px", paddingTop:"30px"}}>No questions found</td>
              </tr>
            )
          }
        </div>
      </table>
    </div>
  );
};

export default QuestionTable;
