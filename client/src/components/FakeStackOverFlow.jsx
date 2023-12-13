import React, { useState } from "react";
import Header from "./Header/Header";
import SideNavbar from "./SideNavbar/SideNavbar";
import MainContainer from "./MainPage/MainPage";
import { Box } from "@mui/material";

function FakeStackOverflow({ goToWelcome, sessionData, handleLoginLogout }) {
  const [currentPage, setCurrentPage] = useState("QuestionsPage");
  const [questionsKey, setQuestionsKey] = useState(0);
  const [searchTerm, setSearchTermState] = useState("");

  const handleSetQuestionsPage = () => {
    setCurrentPage("QuestionsPage");
    setQuestionsKey((prevKey) => prevKey + 1);
  };

  const handleSetTagsPage = () => {
    setCurrentPage("TagsPage");
  };

  const handleSetProfilePage = () => {
    setCurrentPage("ProfilePage");
  };

  const handleSearch = (term) => {
    setSearchTermState(term);
    if (currentPage === "TagsPage") {
      setCurrentPage("QuestionsPage");
    }
    if (currentPage === "QuestionsPage") {
      setCurrentPage("TagsPage");
      setTimeout(() => setCurrentPage("QuestionsPage"), 1);
    }
    //add if statement for UsersPage
    if (currentPage === "ProfilePage") {
      setCurrentPage("QuestionsPage");
    }

  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Header
        setSearchTerm={handleSearch}
        currentPage={currentPage}
        isLoggedIn={sessionData.loggedIn}
        onLoginLogout={handleLoginLogout}
      />
      <Box display="flex" flexGrow={1}>
        <SideNavbar
          setQuestionsPage={handleSetQuestionsPage}
          setTagsPage={handleSetTagsPage}
          setProfilePage={handleSetProfilePage}
        />
        <MainContainer
          key={questionsKey}
          searchTerm={searchTerm}
          showQuestionsPage={currentPage === "QuestionsPage"}
          showTagsPage={currentPage === "TagsPage"}
          showProfilePage={currentPage === "ProfilePage"}
          sessionData={sessionData}
        />
      </Box>
    </Box>
  );
}

export default FakeStackOverflow;
