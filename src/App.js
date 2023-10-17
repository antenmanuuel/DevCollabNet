import React, { useState } from "react";
import Header from "./components/Header/Header";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import MainContainer from "./components/MainPage/MainPage";

function App() {
  //currentpage - current state, setcurrentpage function that updates current state
  const [currentPage, setCurrentPage] = useState("QuestionsPage"); // Default to QuestionsPage
  const [questionsKey, setQuestionsKey] = useState(0); // This will be used to force a rerender

  const handleSetQuestionsPage = () => {
    setCurrentPage("QuestionsPage");
    setQuestionsKey(prevKey => prevKey + 1);  // Increment the key to force rerender
  };

  const handleSetTagsPage = () => {
    setCurrentPage("TagsPage");
  };

  return (
    <div>
      <Header/>
      <SideNavbar
        setQuestionsPage={handleSetQuestionsPage}
        setTagsPage={handleSetTagsPage}
      />
      <MainContainer
        key={questionsKey} // Use the key to rerender the component
        showQuestionsPage={currentPage === "QuestionsPage"}
        showTagsPage={currentPage === "TagsPage"}
      />
    </div>
  );
}

export default App;
