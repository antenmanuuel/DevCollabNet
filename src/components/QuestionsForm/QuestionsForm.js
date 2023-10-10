import React from "react";
import "../../stylesheets/QuestionForm.css";
import SubmitQuestionButton from "../QuestionsPage/SubmitQuestionButton";
const QuestionsForm = () => {
  return (
    <div className="questionFormContainer">
      <form className="questionForm">
        <label id="questionTitle">Question Title*</label>
        <h4 id="questionTitleErrorMessage">
          Limit title to 100 characters or less
        </h4>
        <input type="text" id="questionTitleBox" name="title" />
        <span id="questionTitleError">test</span>

        <label id="questionText">Question Text*</label>
        <h4 id="questionTextErrorMessage">Add details</h4>
        <textarea id="questionTextBox" name="questionTextBox"></textarea>
        <span id="questionTextError">test</span>

        <label id="tagsTitle">Tags*</label>
        <h4 id="tagsTitleErrorMessage">Add keywords separated by whitespace</h4>
        <textarea id="tagsTextBox" name="tagsTextBox"></textarea>
        <span id="tagsError">test</span>

        <label id="usernameTitle">Username*</label>
        <textarea id="usernameTextBox" name="usernameTextBox"></textarea>
        <span id="usernameError">test</span>
        
        <p id="message">*Indicates mandatory fields</p>

        <SubmitQuestionButton />


      </form>
    </div>
  );
};

export default QuestionsForm;
