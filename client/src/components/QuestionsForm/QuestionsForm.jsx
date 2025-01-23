import React, { useState, useEffect } from "react";
import QuestionsPage from "../QuestionsPage/QuestionsPage";
import axios from "axios";

const QuestionsForm = ({ editMode, existingQuestion, sessionData, onQuestionAdded }) => {
  const isEditMode = editMode && existingQuestion;
  const initialFormData = {
    title: isEditMode ? existingQuestion.title : "",
    questionText: isEditMode ? existingQuestion.text : "",
    summary: isEditMode ? existingQuestion.summary : "",
    tags: "",
    askedBy: sessionData.username,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({
    questionTitleError: "",
    questionTextError: "",
    summaryError: "",
    tagsError: "",
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [userReputation, setUserReputation] = useState(null);

  useEffect(() => {
    const fetchTagNames = async (tagIds) => {
      try {
        const responses = await Promise.all(
          tagIds.map((tagId) =>
            axios.get(`http://localhost:8000/posts/tags/tag_id/${tagId}`)
          )
        );
        return responses.map((response) => response.data.name);
      } catch (error) {
        console.error("Error fetching tag names:", error);
        return [];
      }
    };

    if (isEditMode) {
      fetchTagNames(existingQuestion.tags).then((tagNames) => {
        setFormData({
          ...initialFormData,
          title: existingQuestion.title,
          questionText: existingQuestion.text,
          summary: existingQuestion.summary,
          tags: tagNames.join(" "),
        });
      });
    }
  }, [existingQuestion, isEditMode]);

  useEffect(() => {
    const fetchUserReputation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/userReputation/${sessionData.username}`
        );
        setUserReputation(response.data.reputation);
      } catch (error) {
        console.error("Error fetching user reputation:", error);
      }
    };
    fetchUserReputation();
  }, [sessionData.username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    let titleError = "";
    let textError = "";
    let summaryError = "";
    let hyperlinkError = "";
    let tagsError = "";

    if (formData.title.length === 0 || formData.title.length > 50) {
      titleError = "Title should be between 1 and 50 characters.";
    }
    if (formData.questionText.trim() === "") {
      textError = "Question text cannot be empty.";
    }
    if (formData.summary.trim() === "") {
      summaryError = "Question summary cannot be empty.";
    }

    const allHyperLinks = formData.questionText.match(/\[[^\]]*\]\([^)]*\)/g) || [];
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
            hyperlinkError = "Link name should not contain nested square brackets.";
            break;
          }
          if (
            !match[2].startsWith("http://") &&
            !match[2].startsWith("https://")
          ) {
            hyperlinkError = "Hyperlink must begin with 'http://' or 'https://'.";
            break;
          }
        }
      }
    }
    const error = hyperlinkError ? hyperlinkError : textError;

    const tags = formData.tags.trim().split(/\s+/);
    if (formData.tags.trim() === "") {
      tagsError = "Tags cannot be empty.";
    } else if (userReputation < 50) {
      tagsError =
        "Insufficient reputation to add tags. Minimum reputation required is 50.";
    } else if (tags.length > 5) {
      tagsError = "There can be at most 5 tags.";
    } else if (tags.some((tag) => tag.length > 10)) {
      tagsError = "Each tag should be 10 characters or less.";
    }

    setErrors({
      questionTitleError: titleError,
      questionTextError: error,
      summaryError: summaryError,
      tagsError: tagsError,
    });

    if (!titleError && !error && !tagsError) {
      const newQuestion = {
        title: formData.title,
        summary: formData.summary,
        text: formData.questionText,
        tagIds: tags,
        askedBy: formData.askedBy,
        views: 0,
      };

      try {
        if (isEditMode) {
          await axios.put(
            `http://localhost:8000/posts/questions/editQuestion/${existingQuestion._id}`,
            newQuestion
          );
        } else {
          await axios.post("http://localhost:8000/posts/questions/askQuestion", newQuestion);
        }
        if (onQuestionAdded) {
          onQuestionAdded();
        }
        setIsFormSubmitted(true);
      } catch (error) {
        console.error("Error submitting the question:", error);
        if (error.response && error.response.data) {
          setErrors((prevState) => ({
            ...prevState,
            tagsError: error.response.data,
          }));
        }
      }
    }
  };

  if (isFormSubmitted) {
    return <QuestionsPage sessionData={sessionData} />;
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleFormSubmit} noValidate className="space-y-5">
        <label htmlFor="questionTitleBox" className="block text-xl font-bold">
          Question Title*
        </label>
        <input
          required
          id="questionTitleBox"
          name="title"
          placeholder="Limit title to 50 characters or less"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full rounded border p-3 focus:outline-none focus:ring-2 ${
            errors.questionTitleError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
          maxLength={50}
        />
        {errors.questionTitleError && (
          <p className="text-red-600 text-sm">{errors.questionTitleError}</p>
        )}

        <label htmlFor="summaryTextBox" className="block text-xl font-bold">
          Question Summary*
        </label>
        <input
          required
          id="summaryTextBox"
          name="summary"
          placeholder="Limit summary to 140 characters or less"
          value={formData.summary}
          onChange={handleInputChange}
          className={`w-full rounded border p-3 focus:outline-none focus:ring-2 ${
            errors.summaryError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
          maxLength={140}
        />
        {errors.summaryError && (
          <p className="text-red-600 text-sm">{errors.summaryError}</p>
        )}

        <label htmlFor="questionTextBox" className="block text-xl font-bold">
          Question Text*
        </label>
        <textarea
          required
          id="questionTextBox"
          name="questionText"
          rows={4}
          placeholder="Add details"
          value={formData.questionText}
          onChange={handleInputChange}
          className={`w-full rounded border p-3 focus:outline-none focus:ring-2 ${
            errors.questionTextError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.questionTextError && (
          <p className="text-red-600 text-sm">{errors.questionTextError}</p>
        )}

        <label htmlFor="tagsTextBox" className="block text-xl font-bold">
          Tags*
        </label>
        <input
          required
          id="tagsTextBox"
          name="tags"
          placeholder="Add keywords separated by whitespace"
          value={formData.tags}
          onChange={handleInputChange}
          className={`w-full rounded border p-3 focus:outline-none focus:ring-2 ${
            errors.tagsError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.tagsError && (
          <p className="text-red-600 text-sm">{errors.tagsError}</p>
        )}

        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Submit Question
        </button>
        <p className="text-right text-xl text-red-500">*Indicates mandatory fields</p>
      </form>
    </div>
  );
};

export default QuestionsForm;
// ...existing code...