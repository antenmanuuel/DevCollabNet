import React from "react";
import Button from "@mui/material/Button";

function AskQuestionButtonForHomePage({ onPress }) {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onPress}
      sx={{
        marginLeft: "1450px",
        marginTop: "-50px",
        width: 150,
        padding: "10px",
        textTransform: "none"
      }}
    >
      Ask Question
    </Button>
  );
}

export default AskQuestionButtonForHomePage;
