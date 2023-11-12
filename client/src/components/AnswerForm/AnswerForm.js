import React, { useState } from "react";
import "../../stylesheets/AnswerForm.css";
import SubmitAnswerButton from "../SelectedQuestionPage/SubmitAnswerButton";
import axios from "axios";

const AnswerForm = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    answerText: "",
  });

  const [errors, setErrors] = useState({
    usernameError: "",
    answerTextError: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const usernameError =
      formData.username.trim() === "" ? "Username cannot be empty" : "";
    const textError =
      formData.answerText.trim() === "" ? "Answer text cannot be empty." : "";

    let hyperlinkError = "";

    const allHyperLinks =
      formData.answerText.match(/\[[^\]]*\]\([^)]*\)/g) || [];
    const validHyperLinks =
      formData.answerText.match(/\[[^\]]*\]\((https?:\/\/[^)]*)\)/g) || [];

    if (allHyperLinks.length !== validHyperLinks.length) {
      for (let i = 0; i < allHyperLinks.length; i++) {
        const singleLinkPattern = /\[([^\]]*?)\]\(([^)]+)\)/;
        const match = allHyperLinks[i].match(singleLinkPattern);

        if (match) {
          if (!match[1].trim()) {
            hyperlinkError = "The name of the hyperlink cannot be empty.";
            break;
          }

          if (/\[.*\]/.test(match[1])) {
            hyperlinkError =
              "Link name should not contain nested square brackets.";
            break;
          }

          if (
            !match[2].startsWith("http://") &&
            !match[2].startsWith("https://")
          ) {
            hyperlinkError =
              "Hyperlink must begin with 'http://' or 'https://'.";
            break;
          }
        }
      }
    }

    const error = hyperlinkError ? hyperlinkError : textError;

    if (usernameError || error) {
      setErrors({
        usernameError: usernameError,
        answerTextError: error,
      });
      return;
    }

    axios
      .post("http://localhost:8000/posts/answers/answerQuestion", {
        text: formData.answerText,
        ansBy: formData.username,
        qid: props.questionId,
      })
      .then((response) => {
        if (props.onAnswerAdded) {
          props.onAnswerAdded();
        }
        setFormData({
          username: "",
          answerText: "",
        });
      })
      .catch((error) => {
        console.error("Error posting answer:", error);
      });
  };

  return (
    <div className="mainForAnswer">
      <form className="answersForm" onSubmit={handleFormSubmit}>
        <label id="answersText">Answer Text*</label>
        <h4 id="answerTextErrorMessage">Add details</h4>
        <textarea
          id="answerTextBox"
          name="answerText"
          value={formData.answerText}
          onChange={handleInputChange}
        ></textarea>
        <span
          id="answerTextError"
          style={{ display: errors.answerTextError ? "block" : "none" }}
        >
          {errors.answerTextError}
        </span>

        <label id="usernameTitleForAnswer">Username*</label>
        <textarea
          id="usernameTextBoxForAnswer"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        ></textarea>
        <span
          id="usernameErrorForAnswer"
          style={{ display: errors.usernameError ? "block" : "none" }}
        >
          {errors.usernameError}
        </span>

        <SubmitAnswerButton onClick={handleFormSubmit} />
        <p id="message">*Indicates mandatory fields</p>
      </form>
    </div>
  );
};

export default AnswerForm;
