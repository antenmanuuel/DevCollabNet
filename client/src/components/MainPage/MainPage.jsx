import React from "react";
import QuestionsPage from "../QuestionsPage/QuestionsPage";
import TagsPage from "../TagsPage/TagsPage";
import Box from "@mui/material/Box";

const MainPage = ({ showQuestionsPage, showTagsPage, searchTerm }) => {
  return (
    <Box sx={{ width: "100%", height: "100%", display: "block" }}>
      {showQuestionsPage && <QuestionsPage searchTerm={searchTerm} />}
      {showTagsPage && <TagsPage />}
    </Box>
  );
};

export default MainPage;
