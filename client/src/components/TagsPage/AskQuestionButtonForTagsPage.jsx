import React from "react";
import Button from "@mui/material/Button";

function AskQuestionButtonForHomePage({ onPress }) {
  return (
    <div style={{ marginTop: "-910px", paddingLeft: "350px" }}>
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
        Ask Question
      </Button>
    </div>
  );
}

export default AskQuestionButtonForHomePage;
