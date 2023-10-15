import React, { useState } from "react";
import "../../stylesheets/AnswerForm.css";
import SubmitAnswerButton from "../SelectedQuestionPage/SubmitAnswerButton";
import Model from "../../models/model";

const model = Model.getInstance();

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

    if (usernameError || textError) {
      setErrors({
        usernameError: usernameError,
        answerTextError: textError,
      });
      return;
    }

    const currentQuestion = model.getQuestionById(props.questionId); // Use the passed questionId prop here

    const newAnswer = {
      aid: "a" + (model.getAllAnswers().length + 1),
      text: formData.answerText,
      ansBy: formData.username,
      ansDate: new Date(),
    };

    model.addAnswer(newAnswer);
    currentQuestion.ansIds.push(newAnswer.aid);

    if (props.onAnswerAdded) {
      props.onAnswerAdded();
    }

    setFormData({
      username: "",
      answerText: "",
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
        <span id="answerTextError" style={{ display: errors.answerTextError ? "block" : "none" }}>
          {errors.answerTextError}
        </span>

        <label id="usernameTitleForAnswer">Username*</label>
        <textarea
          id="usernameTextBoxForAnswer"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        ></textarea>
        <span id="usernameErrorForAnswer" style={{ display: errors.usernameError ? "block" : "none" }}>
          {errors.usernameError}
        </span>

        <SubmitAnswerButton onClick={handleFormSubmit} />
        <p id="message">*Indicates mandatory fields</p>
      </form>
    </div>
  );
};

export default AnswerForm;
