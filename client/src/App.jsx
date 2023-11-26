
import React, { useState } from "react";
import Header from "./components/Header/Header";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import MainContainer from "./components/MainPage/MainPage";
import { Box } from '@mui/material';
import LoginForm from "./components/WelcomePage/LoginForm";
import SignupForm from "./components/WelcomePage/SignupForm";

  

function App() {
  const [currentPage, setcurrentPage] = useState('welcome');
  
  if (currentPage === 'login'){
    return(
      <LoginForm> </LoginForm>
    );
    
  }

  if (currentPage === 'signup'){
    return(
      <SignupForm> </SignupForm>
    );

  }

  if (currentPage === 'guest'){
    
  }



  function GoLogInPage() {
    console.log("helloo-Login")
    setcurrentPage('login');
  }

  function GoSignUpPage() {
    console.log("helloo-SignUp")
    setcurrentPage('signup');
  }

  function GoGuestPage() {
    console.log("helloo-Guest")
    setcurrentPage('guest');
  }



 

  return (
    
    <div>
      <ul>
        <li> 
          <button onClick={GoLogInPage}> Login </button>
        </li>
        <li>
          <button onClick={GoSignUpPage}> Signup </button>
        </li>
        <li> 
          <button onClick={GoGuestPage} > Guest </button> 
        </li>
      </ul>
    </div>
  );
}

export default App;

/* above return
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
  */


/* return stuff

<Box display="flex" flexDirection="column" height="100vh">
      <Header setSearchTerm={handleSearch} currentPage={currentPage} />
      <Box display="flex" flexGrow={1}>
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
      </Box>
    </Box>
*/