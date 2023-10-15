import React from "react";
import "../../stylesheets/AnswerForm.css"
import SubmitAnswerButton from "../SelectedQuestionPage/SubmitAnswerButton";
const AnswerForm = () => {
  return (
    <div className="mainForAnswer">
      <form class="answersForm">
        <label id="answersText">Answer Text*</label>
        <h4 id="answerTextErrorMessage">Add details</h4>
        <textarea id="answerTextBox" name="answerTextBox"></textarea>
        <span id="answerTextError"></span>

        <label id="usernameTitleForAnswer">Username*</label>
        <textarea
          id="usernameTextBoxForAnswer"
          name="usernameTextBoxForAnswer"
        ></textarea>
        <span id="usernameErrorForAnswer"></span>
        <SubmitAnswerButton />
        <p id="message">*Indicates mandatory fields</p>
      </form>
    </div>
  );
};

export default AnswerForm;
