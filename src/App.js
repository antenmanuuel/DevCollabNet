import React, { useState } from "react";
import Header from "./components/Header/Header";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import MainContainer from "./components/MainPage/MainPage";

function App() {
  const [updateKey, setUpdateKey] = useState(0);
  const [currentPage, setCurrentPage] = useState("QuestionsPage"); // Default to QuestionsPage
  

  const handleSetQuestionsPage = () => {
    setCurrentPage("QuestionsPage");
  };

  const handleSetTagsPage = () => {
    setCurrentPage("TagsPage");
  };

  return (
    <div>
      <Header />
      <SideNavbar
        setQuestionsPage={handleSetQuestionsPage}
        setTagsPage={handleSetTagsPage}
      />
      <MainContainer
        showQuestionsPage={currentPage === "QuestionsPage"}
        showTagsPage={currentPage === "TagsPage"}
      />
    </div>
  );
}

export default App;
