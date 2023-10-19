import React, { useState } from "react";
import Header from "./components/Header/Header";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import MainContainer from "./components/MainPage/MainPage";

function App() {
  const [currentPage, setCurrentPage] = useState("QuestionsPage"); 
  const [questionsKey, setQuestionsKey] = useState(0); 
  const [searchTerm, setSearchTermState] = useState("");

  const handleSetQuestionsPage = () => {
    setCurrentPage("QuestionsPage");
    setQuestionsKey(prevKey => prevKey + 1);  
  };

  const handleSetTagsPage = () => {
    setCurrentPage("TagsPage");
  };

  const handleSearch = (term) => {
    setSearchTermState(term);
    if (currentPage === "TagsPage") {
      setCurrentPage("QuestionsPage");
    } else {
      setCurrentPage("TagsPage");
      setTimeout(() => setCurrentPage("QuestionsPage"), 1); // delay to ensure re-render
    }
  };

  return (
    <div>
      <Header setSearchTerm={handleSearch} currentPage={currentPage} /> 
      <SideNavbar
        setQuestionsPage={handleSetQuestionsPage}
        setTagsPage={handleSetTagsPage}
      />
      <MainContainer
        key={questionsKey} 
        searchTerm={searchTerm} 
        showQuestionsPage={currentPage === "QuestionsPage"}
        showTagsPage={currentPage === "TagsPage"}
      />
    </div>
  );
}

export default App;