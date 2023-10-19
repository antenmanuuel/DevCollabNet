import React from "react";
import "../../stylesheets/AskQuestionButtonForSelectedPage.css";

function AskQuestionButtonForSelectedPage({ onPress }) {
  return (
      <input 
        type="button" 
        value="Ask Question" 
        id="askQuestionButtonSP" 
        onClick={onPress} 
      />
  );
}


export default AskQuestionButtonForSelectedPage;
