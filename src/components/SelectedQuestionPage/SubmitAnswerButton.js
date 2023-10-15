import React from "react";
import "../../stylesheets/SubmitAnswerButton.css";
const SubmitAnswerButton = (props) => {
  return (
    <div>
      <input
        type="submit"
        value="Post Answer"
        id="submitAnswerButton"
        onClick={props.onClick}
      />
    </div>
  );
};

export default SubmitAnswerButton;
