import React from "react";
import QuestionsPage from "../QuestionsPage/QuestionsPage";
import TagsPage from "../TagsPage/TagsPage";
import ProfilePage from "../ProfilePage/ProfilePage";
import AdminsPage from "../ProfilePage/AdminsPage";

const MainPage = ({
  showQuestionsPage,
  showTagsPage,
  searchTerm,
  sessionData,
  showProfilePage,
  showAdminPage,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {showQuestionsPage && (
        <div className="flex-1">
          <QuestionsPage searchTerm={searchTerm} sessionData={sessionData} />
        </div>
      )}
      {showTagsPage && (
        <div className="flex-1">
          <TagsPage sessionData={sessionData} />
        </div>
      )}
      {showProfilePage && (
        <div className="flex-1">
          <ProfilePage sessionData={sessionData} />
        </div>
      )}
      {showAdminPage && (
        <div className="flex-1">
          <AdminsPage sessionData={sessionData} />
        </div>
      )}
    </div>
  );
};

export default MainPage;
