import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionsForm from "../QuestionsForm/QuestionsForm";

const UsersPageQ = ({ goTags, goQuestions, goAnswers, current }) => {
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "",
    email: "",
    created_at: "",
    reputation: 0,
  });

  const [userQuestions, setUserQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [userReputation, setUserReputation] = useState(null);

  useEffect(() => {
    if (sessionData.username) {
      axios
        .get(
          `http://localhost:8000/users/userReputation/${sessionData.username}`
        )
        .then((response) => setUserReputation(response.data.reputation))
        .catch((error) =>
          console.error("Error fetching user reputation:", error)
        );
    }
  }, [sessionData.username]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/session");
        if (response.data?.loggedIn) {
          setSessionData({
            loggedIn: true,
            username: response.data.username,
            email: response.data.email,
            created_at: response.data.created_at,
            reputation: response.data.reputation,
          });
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, []);

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/questions/byUsername/${sessionData.username}`
        );
        setUserQuestions(response.data);
      } catch (error) {
        console.error("Error fetching user's questions:", error);
      }
    };

    if (sessionData.username) {
      fetchUserQuestions();
    }
  }, [sessionData.username]);

  const handleQuestionEdit = (question) => {
    setEditingQuestion(question);
  };

  const handleQuestionEdited = () => {
    setEditingQuestion(null);
  };

  if (editingQuestion) {
    return (
      <QuestionsForm
        sessionData={sessionData}
        existingQuestion={editingQuestion}
        editMode={true}
        onQuestionEdited={handleQuestionEdited}
      />
    );
  }

  const formatDate = (postTime) => {
    const now = new Date();
    const diffInSeconds = (now - new Date(postTime)) / 1000;

    if (diffInSeconds < 60) return `${Math.round(diffInSeconds)} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.round(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.round(diffInSeconds / 3600)} hours ago`;

    return new Date(postTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const memberSince = sessionData.created_at
    ? formatDate(new Date(sessionData.created_at))
    : "Loading...";

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:8000/posts/questions/${questionId}`);
      setUserQuestions(userQuestions.filter((q) => q._id !== questionId));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-6 px-4">
      {/* User Profile Section */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          User Profile: {sessionData.loggedIn ? sessionData.username : "Loading..."}
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>Member Since:</strong> {memberSince}
        </p>
        <p className="text-gray-700">
          <strong>Reputation Score:</strong> {userReputation !== null ? userReputation : "Loading..."}
        </p>
      </div>

      {/* Questions Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          {current} Created by {sessionData.username}
        </h3>
        {userQuestions.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Question Title
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Asked By
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {userQuestions.map((question) => (
                <tr key={question._id} className="hover:bg-gray-50">
                  <td
                    className="border border-gray-200 px-4 py-2 text-blue-500 underline cursor-pointer"
                    onClick={() => handleQuestionEdit(question)}
                  >
                    {question.title}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {question.asked_by.username} - {formatDate(question.ask_date_time)}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No questions found.</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-6xl mx-auto mt-6 flex justify-center space-x-4">
        <button
          onClick={goTags}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          View Tags
        </button>
        <button
          onClick={goAnswers}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          View Answers
        </button>
        <button
          onClick={goQuestions}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          View Questions
        </button>
      </div>
    </div>
  );
};

export default UsersPageQ;
