import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminsPage = () => {
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "admin",
    email: "",
    created_at: "",
    reputation: 0,
  });
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userReputation, setUserReputation] = useState(null);

  useEffect(() => {
    if (sessionData.username) {
      axios
        .get(`http://localhost:8000/users/userReputation/${sessionData.username}`)
        .then((response) => setUserReputation(response.data.reputation))
        .catch((error) => console.error("Error fetching user reputation:", error));
    }
  }, [sessionData.username]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await axios.get("http://localhost:8000/users/session");
        const usersResponse = await axios.get("http://localhost:8000/users/admin");

        if (sessionResponse.data?.loggedIn) {
          setSessionData({
            loggedIn: true,
            username: sessionResponse.data.username,
            email: sessionResponse.data.email,
            created_at: sessionResponse.data.created_at,
            reputation: sessionResponse.data.reputation,
          });
        }

        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUserById = (userId) => {
    setOpenDialog(true);
    setSelectedUserId(userId);
  };

  const handleConfirmDelete = async () => {
    try {
      const selectedUser = users.find((user) => user._id === selectedUserId);
      if (!selectedUser) throw new Error("User not found");

      await axios.delete(`http://localhost:8000/users/deleteUser/${selectedUser.username}`);
      setUsers(users.filter((user) => user._id !== selectedUserId));
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => setOpenDialog(false);

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
    ? formatDate(sessionData.created_at)
    : "Loading...";
  const isAdminOnlyUser = users.length === 1 && users[0].username === "admin";

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-6">
      {/* User Profile Section */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800">Admin Profile</h2>
          <span className="text-sm text-gray-500">Reputation: {userReputation || "Loading..."}</span>
        </div>
        <p className="text-gray-700 mt-2">
          <strong>Username:</strong> {sessionData.username}
        </p>
        <p className="text-gray-700 mt-2">
          <strong>Member Since:</strong> {memberSince}
        </p>
      </div>

      {/* User List Section */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Manage Users</h3>
        {isAdminOnlyUser ? (
          <p className="text-red-500 text-center">No users found except admin.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Username
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">{user.username}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                        onClick={() => handleDeleteUserById(user._id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                        disabled={user.email === sessionData.email}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsPage;
