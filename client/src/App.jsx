import React, { useState } from "react";
import SignupForm from "./components/WelcomePage/SignupForm";
import LoginForm from "./components/WelcomePage/LoginForm";
import FakeStackOverflow from "./components/FakeStackOverFlow";
import WelcomePage from "./components/WelcomePage/WelcomePage"; 

function App() {
  const [currentView, setCurrentView] = useState("welcome");

  const showSignup = () => {
    setCurrentView("signup");
  };

  const showLogin = () => {
    setCurrentView("login");
  };

  const showOnGuest = () => {
    setCurrentView("fakeStackOverflow");
  };

  const onSignupSuccess = () => {
    setCurrentView("welcome");
  };

  const onLoginSuccess = () => {
    setCurrentView("fakeStackOverflow");
  };

  switch (currentView) {
    case "signup":
      return <SignupForm onSignupSuccess={onSignupSuccess} />;
    case "login":
      return <LoginForm onLoginSuccess={onLoginSuccess} />;
    case "fakeStackOverflow":
      return <FakeStackOverflow />;
    case "welcome":
    default:
      return (
        <WelcomePage
          onLogin={showLogin}
          onSignup={showSignup}
          onGuest={showOnGuest}
        />
      );
  }
}

export default App;