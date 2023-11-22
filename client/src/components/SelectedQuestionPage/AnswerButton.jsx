import React from "react";
import Button from "@mui/material/Button";

const AnswerButton = ({ onPress }) => {
  return (
    <div style={{ marginLeft: "240px", marginTop: "80px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={onPress}
        sx={{
          width: 150,
          padding: "10px",
          textTransform: "none",
        }}
      >
        Answer Question
      </Button>
    </div>
  );
};

export default AnswerButton;
