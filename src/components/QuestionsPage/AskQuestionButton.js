import React from "react";
import "../../stylesheets/AskQuestionButton.css";

function AskQuestionButton({ onPress }) {
  return (
    <div>
      <input 
        type="button" 
        value="Ask Question" 
        id="askQuestionButton" 
        onClick={onPress} 
      />
    </div>
  );
}


export default AskQuestionButton;
