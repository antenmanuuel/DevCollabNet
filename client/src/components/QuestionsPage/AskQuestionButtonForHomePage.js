import React from "react";
import "../../stylesheets/AskQuestionButton.css";

function AskQuestionButtonForHomePage({ onPress }) {
  return (
      <input 
        type="button" 
        value="Ask Question" 
        id="askQuestionButton" 
        onClick={onPress} 
      />
  );
}


export default AskQuestionButtonForHomePage;
