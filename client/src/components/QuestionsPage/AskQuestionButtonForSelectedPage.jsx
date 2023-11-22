import React from "react";
import Button from "@mui/material/Button";

function AskQuestionButtonForSelectedPage({ onPress }) {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onPress}
      sx={{
        position: "absolute",
        right: 30,
        top: 100,
        textTransform: "none",
        width: 150,
        padding: "10px",
        textTransform: "none",
      }}
    >
      Ask Question
    </Button>
  );
}

export default AskQuestionButtonForSelectedPage;
