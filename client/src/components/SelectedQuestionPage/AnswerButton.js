import React from "react";
import "../../stylesheets/AnswerButton.css";

const AnswerButton = ({ onPress}) => {
  
  return (
    <div>
      <input 
        type="button" 
        value="Answer Question" 
        id="answerButton" 
        onClick={onPress} 
      />

    </div>
  );
};

export default AnswerButton;
