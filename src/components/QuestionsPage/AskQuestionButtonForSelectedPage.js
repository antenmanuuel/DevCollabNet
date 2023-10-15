import React from "react";
import "../../stylesheets/AskQuestionButtonForSelectedPage.css";

function AskQuestionButtonForSelectedPage({ onPress }) {
  return (
    <div>
      <input 
        type="button" 
        value="Ask Question" 
        id="askQuestionButtonSP" 
        onClick={onPress} 
      />
    </div>
  );
}


export default AskQuestionButtonForSelectedPage;
