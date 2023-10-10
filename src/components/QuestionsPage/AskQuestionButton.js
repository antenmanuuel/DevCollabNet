import React from "react";
import "../../stylesheets/AskQuestionButton.css";
import { Link } from "react-router-dom";
function AskQuestionButton() {
  return (
    <Link to="/askQuestion">
      <input type="button" value="Ask Question" id="askQuestionButton" />
    </Link>
  );
}

export default AskQuestionButton;
