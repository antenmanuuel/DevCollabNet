// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import Header from "./components/Header/Header";
import QuestionsContainer from "./components/QuestionsPage/QuestionsContainer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideNavbar from "./components/SideNavbar/SideNavbar";

import "./stylesheets/App.css";
import TagsContainer from "./components/TagsPage/TagsContainer";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <SideNavbar />
        <Routes>
          <Route path="/" Component={QuestionsContainer} />
          <Route path="/questions" Component={QuestionsContainer} />
          <Route path="/tags" Component={TagsContainer} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
