import React, { useState, useEffect } from "react";
import axios from "axios";
import SignupForm from "./components/WelcomePage/SignupForm";
import LoginForm from "./components/WelcomePage/LoginForm";
import FakeStackOverflow from "./components/FakeStackOverFlow";
import WelcomePage from "./components/WelcomePage/WelcomePage";

axios.defaults.withCredentials = true;

function App() {
  const [currentView, setCurrentView] = useState("welcome");
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "",
    email: "",
    isAdmin: false,
  });

  // Fetch session data on component mount
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/session");
        setSessionData({
          loggedIn: response.data && response.data.loggedIn,
          username: response.data ? response.data.username : "",
          email: response.data ? response.data.email : "",
          isAdmin: response.data ? response.data.isAdmin : false,
        });
        setCurrentView(
          response.data && response.data.loggedIn
            ? "fakeStackOverflow"
            : "welcome"
        );
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, []);

  const onLoginSuccess = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users/session");
      if (response.data && response.data.loggedIn) {
        setSessionData({
          loggedIn: true,
          username: response.data.username,
          email: response.data.email,
          isAdmin: response.data ? response.data.isAdmin : false,
        });
        setCurrentView("fakeStackOverflow");
      } else {

        console.error("Login was successful, but session data is missing.");
      }
    } catch (error) {
      console.error("Error fetching session data after login:", error);
    }
  };

  const showSignup = () => setCurrentView("signup");
  const showLogin = () => setCurrentView("login");
  const onGuest = () => setCurrentView("fakeStackOverflow");

  const onSignupSuccess = () => setCurrentView("login");

  const onWelcome = () => {
    setSessionData({ loggedIn: false, username: "", email: "" });
    setCurrentView("welcome");
  };

  const handleLoginLogout = () => {
    if (sessionData.loggedIn) {
      axios
        .post("http://localhost:8000/users/logout")
        .then(() => {
          setSessionData({ loggedIn: false, username: "", email: "" });
          setCurrentView("welcome");
        })
        .catch((error) => console.error("Error during logout:", error));
    } else {
      showLogin();
    }
  };

  switch (currentView) {
    case "signup":
      return <SignupForm onSignupSuccess={onSignupSuccess} goToWelcome={onWelcome} />;
    case "login":
      return <LoginForm onLoginSuccess={onLoginSuccess} goToWelcome={onWelcome} />;
    case "fakeStackOverflow":
      return <FakeStackOverflow goToWelcome={onWelcome} sessionData={sessionData} handleLoginLogout={handleLoginLogout} isAdmin={sessionData.isAdmin} />;
    case "welcome":
    default:
      return <WelcomePage onLogin={showLogin} onSignup={showSignup} onGuest={onGuest} />;
  }
}

export default App;
