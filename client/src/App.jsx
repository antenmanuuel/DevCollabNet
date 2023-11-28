import React, { useState } from "react";
import SignupForm from "./components/WelcomePage/SignupForm";
import LoginForm from "./components/WelcomePage/LoginForm";
import FakeStackOverflow from "./components/FakeStackOverFlow";
import WelcomePage from "./components/WelcomePage/WelcomePage";

function App() {
  const [currentView, setCurrentView] = useState("welcome");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showSignup = () => {
    setCurrentView("signup");
  };

  const showLogin = () => {
    setCurrentView("login");
  };

  const onGuest = () => {
    setCurrentView("fakeStackOverflow");
  };

  const onSignupSuccess = () => {
    setCurrentView("login");
  };

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView("fakeStackOverflow");
  };

  const onWelcome = () => {
    setIsLoggedIn(false);
    setCurrentView("welcome");
  };

  


  const handleLoginLogout = () => {
    if (isLoggedIn) {
        onWelcome();
    } else {
        showLogin();
    }
};


  switch (currentView) {
    case "signup":
      return <SignupForm  
                onSignupSuccess={onSignupSuccess}
                goToWelcome={onWelcome} />;
    case "login":
      return <LoginForm 
                onLoginSuccess={onLoginSuccess} 
                goToWelcome={onWelcome}
                />;
    case "fakeStackOverflow":
      return (
        <FakeStackOverflow
          goToWelcome={onWelcome}
          isLoggedIn={isLoggedIn}
          handleLoginLogout={handleLoginLogout}
        />
      );
    case "welcome":
    default:
      return (
        <WelcomePage
          onLogin={showLogin}
          onSignup={showSignup}
          onGuest={onGuest}
        />
      );
  }
}

export default App;
