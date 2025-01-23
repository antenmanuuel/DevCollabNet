import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectedQuestionPage from "../SelectedQuestionPage/SelectedQuestionPage";

const UsersPageA = ({ goTags, goQuestions, goAnswers, current }) => {
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "",
    email: "",
    created_at: "",
  });
  const [userQuestions, setUserQuestions] = useState([]);
  const [userReputation, setUserReputation] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [answersData, setAnswersData] = useState([]);

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
    if (sessionData.username) {
      axios
        .get(`http://localhost:8000/users/userReputation/${sessionData.username}`)
        .then((response) => setUserReputation(response.data.reputation))
        .catch((error) => console.error("Error fetching user reputation:", error));
    }
  }, [sessionData.username]);

  useEffect(() => {
    const fetchUserAnsweredQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/questions/questions-answered-by-current-user`
        );
        setUserQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions answered by the user:", error);
      }
    };

    if (sessionData.loggedIn) {
      fetchUserAnsweredQuestions();
    }
  }, [sessionData.loggedIn]);

  const handleQuestionClick = async (questionId) => {
    setSelectedQuestionId(questionId);
    try {
      const response = await axios.get(
        `http://localhost:8000/posts/questions/answers/byQuestion/${questionId}/currentUser`
      );
      setAnswersData(response.data);
    } catch (error) {
      console.error("Error fetching answers and comments by current user:", error);
    }
  };

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

  if (selectedQuestionId) {
    return (
      <SelectedQuestionPage
        questionId={selectedQuestionId}
        sessionData={sessionData}
        filteredAnswers={answersData}
        onBack={() => setSelectedQuestionId(null)}
      />
    );
  }

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

      {/* User Questions Section */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Questions Answered by {sessionData.username}
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
              </tr>
            </thead>
            <tbody>
              {userQuestions.map((question) => (
                <tr
                  key={question._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleQuestionClick(question._id)}
                >
                  <td className="border border-gray-200 px-4 py-2 text-blue-500 underline">
                    {question.title}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {question.asked_by.username} - {formatDate(question.ask_date_time)}
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

export default UsersPageA;
