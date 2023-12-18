import React from "react";
import QuestionsPage from "../QuestionsPage/QuestionsPage";
import TagsPage from "../TagsPage/TagsPage";
import ProfilePage from "../ProfilePage/ProfilePage";
import Box from "@mui/material/Box";
import AdminsPage from "../ProfilePage/AdminsPage";

const MainPage = ({ showQuestionsPage, showTagsPage, searchTerm, sessionData , showProfilePage, showAdminPage}) => {
  return (
    <Box sx={{ width: "100%", height: "100%", display: "block" }}>
      {showQuestionsPage && <QuestionsPage searchTerm={searchTerm} sessionData={sessionData} />}
      {showTagsPage && <TagsPage sessionData={sessionData} />}
      {showProfilePage && <ProfilePage sessionData={sessionData} />}
      {showAdminPage && <AdminsPage sessionData={sessionData} /> }
    </Box>
  );
};

export default MainPage;
