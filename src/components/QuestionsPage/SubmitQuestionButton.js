import React from 'react';
import "../../stylesheets/SubmitQuestionButton.css";

const SubmitQuestionButton = (props) => {
  return (
    <div>
      <input 
        type="submit" 
        value="Post Question" 
        id="submitQuestionButton" 
        onClick={props.onClick}
      />
    </div>
  );
}

export default SubmitQuestionButton;
