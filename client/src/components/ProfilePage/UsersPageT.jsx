import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPageT = ({ goTags, goQuestions, goAnswers, current }) => {
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "",
    email: "",
    created_at: "",
    reputation: 0,
  });

  const [userTags, setUserTags] = useState([]);
  const [editForm, setEditForm] = useState({
    visible: false,
    tagName: "",
    tagId: "",
  });
  const [editError, setEditError] = useState("");
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
    const fetchUserTags = async () => {
      if (sessionData.loggedIn && sessionData.username) {
        try {
          const response = await axios.get(
            `http://localhost:8000/posts/tags/createdByUser/${sessionData.username}`
          );
          setUserTags(response.data);
        } catch (error) {
          console.error("Error fetching user's tags:", error);
        }
      }
    };

    fetchUserTags();
  }, [sessionData.loggedIn, sessionData.username]);

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(
        `http://localhost:8000/posts/tags/tag_id/${tagId}`,
        { withCredentials: true }
      );
      setUserTags((prevTags) => prevTags.filter((tag) => tag._id !== tagId));
    } catch (error) {
      console.error("Error deleting the tag:", error);
    }
  };

  const handleTagEdit = (tag) => {
    setEditForm({
      visible: true,
      tagName: tag.name,
      tagId: tag._id,
    });
  };

  const hideEditForm = () => {
    setEditForm({
      visible: false,
      tagName: "",
      tagId: "",
    });
    setEditError("");
  };

  const handleTagNameChange = (event) => {
    setEditForm((prevForm) => ({
      ...prevForm,
      tagName: event.target.value,
    }));
    setEditError("");
  };

  const handleSubmitEdit = async () => {
    const trimmedTagName = editForm.tagName.trim();

    if (!trimmedTagName) {
      setEditError("Tag name cannot be empty.");
      return;
    } else if (trimmedTagName.length > 10) {
      setEditError("Tag name should be 10 characters or less.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/posts/tags/tag_id/${editForm.tagId}`,
        { newName: trimmedTagName }
      );
      setUserTags((prevTags) =>
        prevTags.map((tag) =>
          tag._id === editForm.tagId ? { ...tag, name: trimmedTagName } : tag
        )
      );
      hideEditForm();
    } catch (error) {
      console.error("Error updating the tag:", error);
      setEditError(error.response?.data || "Error updating tag");
    }
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const diffInSeconds = (now - new Date(dateString)) / 1000;

    if (diffInSeconds < 60) return `${Math.round(diffInSeconds)} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.round(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.round(diffInSeconds / 3600)} hours ago`;

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const memberSince = sessionData.created_at
    ? formatDate(new Date(sessionData.created_at))
    : "Loading...";

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

      {/* Tags Table */}
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          {current} Tags Created by {sessionData.username}
        </h3>
        {userTags.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Tag Name
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Questions Count
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {userTags.map((tag) => (
                <tr key={tag._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-gray-800">
                    {tag.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {tag.count}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleTagEdit(tag)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag._id)}
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
          <p className="text-gray-500">No tags found.</p>
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

      {/* Edit Modal */}
      {editForm.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-lg font-bold mb-4">Edit Tag</h3>
            <input
              type="text"
              value={editForm.tagName}
              onChange={handleTagNameChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />
            {editError && <p className="text-red-500 mb-4">{editError}</p>}
            <div className="flex justify-end space-x-4">
              <button
                onClick={hideEditForm}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPageT;
