import React, { useState } from "react";
import "../../stylesheets/QuestionForm.css";
import SubmitQuestionButton from "../QuestionsPage/SubmitQuestionButton";
import QuestionsPage from "../QuestionsPage/QuestionsPage";
import axios from "axios";

const QuestionsForm = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    questionText: "",
    tags: "",
    username: "",
  });

  const [errors, setErrors] = useState({
    questionTitleError: "",
    questionTextError: "",
    tagsError: "",
    usernameError: "",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const titleError =
      formData.title.length === 0 ||
      formData.title.length > 100 ||
      formData.questionText.match(/^\s*$/) !== null
        ? "Title should be between 1 and 100 characters."
        : "";
    const textError =
      formData.questionText.trim() === "" ||
      formData.title.match(/^\s*$/) !== null
        ? "Question text cannot be empty."
        : "";

    let hyperlinkError = "";

    const allHyperLinks =
      formData.questionText.match(/\[[^\]]*\]\([^)]*\)/g) || [];
    const validHyperLinks =
      formData.questionText.match(/\[[^\]]*\]\((https?:\/\/[^)]*)\)/g) || [];

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

    const errror = hyperlinkError ? hyperlinkError : textError;

    const tags = formData.tags.trim().toLowerCase().split(/\s+/);
    const tagsError =
      formData.tags.trim() === ""
        ? "Tags cannot be empty."
        : tags.length > 5
        ? "There can be at most 5 tags."
        : tags.some((tag) => tag.length > 10)
        ? "Each tag should be 10 characters or less."
        : "";
    const usernameError =
      formData.username.trim() === "" ? "Username cannot be empty." : "";

    if (titleError || errror || tagsError || usernameError) {
      setErrors({
        questionTitleError: titleError,
        questionTextError: errror,
        tagsError: tagsError,
        usernameError: usernameError,
      });
      return;
    }

    // Fetching tag Ids for the given tag names
    const tagNames = formData.tags.split(/\s+/);

    const newQuestion = {
      title: formData.title,
      text: formData.questionText,
      tagIds: tagNames,
      askedBy: formData.username,
      views: 0,
    };

    // Submit the new question using axios
    try {
      await axios.post(
        "http://localhost:8000/posts/questions/askQuestion",
        newQuestion
      );

      if (props.onQuestionAdded) {
        props.onQuestionAdded();
      }

      setFormData({
        title: "",
        questionText: "",
        tags: "",
        username: "",
      });

      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting the question:", error);
    }
  };

  if (isFormSubmitted) {
    return <QuestionsPage />;
  }

  return (
    <div className="questionFormContainer">
      <form className="questionForm" onSubmit={handleFormSubmit}>
        <label id="questionTitle">Question Title*</label>
        <h4 id="questionTitleErrorMessage">
          Limit title to 100 characters or less
        </h4>
        <input
          type="text"
          id="questionTitleBox"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <span
          id="questionTitleError"
          style={{ display: errors.questionTitleError ? "block" : "none" }}
        >
          {errors.questionTitleError}
        </span>

        <label id="questionText">Question Text*</label>
        <h4 id="questionTextErrorMessage">Add details</h4>
        <textarea
          id="questionTextBox"
          name="questionText"
          value={formData.questionText}
          onChange={handleInputChange}
        ></textarea>
        <span
          id="questionTextError"
          style={{ display: errors.questionTextError ? "block" : "none" }}
        >
          {errors.questionTextError}
        </span>

        <label id="tagsTitle">Tags*</label>
        <h4 id="tagsTitleErrorMessage">Add keywords separated by whitespace</h4>
        <textarea
          id="tagsTextBox"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
        ></textarea>
        <span
          id="tagsError"
          style={{ display: errors.tagsError ? "block" : "none" }}
        >
          {errors.tagsError}
        </span>

        <label id="usernameTitle">Username*</label>
        <textarea
          id="usernameTextBox"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        ></textarea>
        <span
          id="usernameError"
          style={{ display: errors.usernameError ? "block" : "none" }}
        >
          {errors.usernameError}
        </span>

        <p id="message">*Indicates mandatory fields</p>

        <SubmitQuestionButton onClick={handleFormSubmit} />
      </form>
    </div>
  );
};

export default QuestionsForm;
