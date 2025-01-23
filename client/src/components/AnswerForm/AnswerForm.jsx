import React, { useState, useEffect } from "react";
import axios from "axios";

const AnswerForm = ({
  sessionData,
  editMode,
  onAnswerAdded,
  onEditComplete,
  existingAnswer,
  onAnswerUpdated,
  questionId,
}) => {
  const [formData, setFormData] = useState({
    answerText: editMode ? existingAnswer.text : "",
    ansBy: sessionData.userId,
  });
  const [errors, setErrors] = useState({ answerTextError: "" });

  useEffect(() => {
    if (editMode) {
      setFormData({
        answerText: existingAnswer.text,
        ansBy: sessionData.username,
      });
    }
  }, [editMode, existingAnswer, sessionData.username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const textError =
      formData.answerText.trim() === "" ? "Answer text cannot be empty." : "";
    let hyperlinkError = "";

    const allHyperLinks =
      formData.answerText.match(/\[[^\]]*\]\([^)]*\)/g) || [];
    const validHyperLinks =
      formData.answerText.match(/\[[^\]]*\]\((https?:\/\/[^)]*)\)/g) || [];
    if (allHyperLinks.length !== validHyperLinks.length) {
      for (let i = 0; i < allHyperLinks.length; i++) {
        const match = allHyperLinks[i].match(/\[([^\]]*?)\]\(([^)]+)\)/);
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
            hyperlinkError = "Hyperlink must begin with 'http://' or 'https://'.";
            break;
          }
        }
      }
    }

    const error = hyperlinkError ? hyperlinkError : textError;
    if (error) {
      setErrors({ answerTextError: error });
      return;
    }

    if (editMode) {
      try {
        await axios.patch(
          `http://localhost:8000/posts/answers/editAnswer/${existingAnswer._id}`,
          {
            newText: formData.answerText,
          }
        );
        onAnswerUpdated();
        onEditComplete(existingAnswer._id, formData.answerText);
      } catch (err) {
        console.error("Error updating answer:", err);
      }
    } else {
      try {
        await axios.post("http://localhost:8000/posts/answers/answerQuestion", {
          text: formData.answerText,
          ansBy: sessionData.username,
          qid: questionId,
        });
        onAnswerAdded();
      } catch (err) {
        console.error("Error posting answer:", err);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleFormSubmit} noValidate className="space-y-5">
        <h1 className="text-2xl font-bold">Answer Text*</h1>
        <textarea
          id="answerTextBox"
          name="answerText"
          rows={4}
          required
          value={formData.answerText}
          onChange={handleInputChange}
          className={`w-full rounded border p-3 focus:outline-none focus:ring-2 ${
            errors.answerTextError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.answerTextError && (
          <p className="text-red-600 text-sm">{errors.answerTextError}</p>
        )}

        <h2 className="text-lg font-semibold">Username</h2>
        <input
          id="usernameTextBox"
          name="username"
          value={sessionData.username}
          disabled
          className="w-full rounded border border-gray-300 p-3 bg-gray-100 cursor-not-allowed"
        />

        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Submit Answer
        </button>
        <p className="text-right text-xl text-red-500">*Indicates mandatory fields</p>
      </form>
    </div>
  );
};

export default AnswerForm;