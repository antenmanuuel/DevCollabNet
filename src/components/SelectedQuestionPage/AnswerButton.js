import React, { useState } from "react";
import "../../stylesheets/AnswerButton.css";
import AnswersForm from "../AnswerForm/AnswerForm"

const AnswerButton = () => {
  const [showAnswersForm, setShowAnswersForm] = useState(false);

  const handleButtonClick = () => {
    setShowAnswersForm(!showAnswersForm);
  };

  return (
    <div>
      <input 
        type="button" 
        value="Answer Question" 
        id="answerButton" 
        onClick={handleButtonClick} 
      />
      
      {showAnswersForm && <AnswersForm />}
    </div>
  );
};

export default AnswerButton;
