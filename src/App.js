// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React, { useState, useCallback } from "react";
import Header from "./components/Header/Header";
import QuestionsContainer from "./components/QuestionsPage/QuestionsContainer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import TagsContainer from "./components/TagsPage/TagsContainer";
import QuestionsForm from "./components/QuestionsForm/QuestionsForm";
import SelectedQuestionPage from "./components/SelectedQuestionPage/SelectedQuestionPage";

function App() {
  const [updateKey, setUpdateKey] = useState(0); 

  const handleQuestionAdded = useCallback(() => {
    setUpdateKey((prevKey) => prevKey + 1);
  }, []);
  return (
    <Router>
      <div>
        <Header />
        <SideNavbar />
        <Routes>
          <Route
            path="/"
            element={<QuestionsContainer updateKey={updateKey} />}
          />
          <Route
            path="/questions"
            element={<QuestionsContainer updateKey={updateKey} />}
          />
          <Route
            path="/askQuestion"
            element={<QuestionsForm onQuestionAdded={handleQuestionAdded} />}
          />
          <Route path="/tags" element={<TagsContainer />} />
          <Route path="/questions/:questionId" element={<SelectedQuestionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
