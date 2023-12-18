import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import axios from "axios";

const AnswerForm = (props) => {
  const [formData, setFormData] = useState({
    answerText: props.editMode ? props.existingAnswer.text : "",
    ansBy: props.sessionData.userId
  });

  const [errors, setErrors] = useState({
    answerTextError: "",
  });

  useEffect(() => {
    if (props.editMode) {
      setFormData({ answerText: props.existingAnswer.text, ansBy: props.sessionData.username });
    }
  }, [props.editMode, props.existingAnswer, props.sessionData.username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const textError =
      formData.answerText.trim() === "" ||
      formData.answerText.match(/^\s*$/) !== null
        ? "Answer text cannot be empty."
        : "";

    let hyperlinkError = "";

    const allHyperLinks =
      formData.answerText.match(/\[[^\]]*\]\([^)]*\)/g) || [];
    const validHyperLinks =
      formData.answerText.match(/\[[^\]]*\]\((https?:\/\/[^)]*)\)/g) || [];

    if (allHyperLinks.length !== validHyperLinks.length) {
      for (let i = 0; i < allHyperLinks.length; i++) {
        const singleLinkPattern = /\[([^\]]*?)\]\(([^)]+)\)/;
        const match = allHyperLinks[i].match(singleLinkPattern);

        if (match) {
          if (!match[1].trim()) {
            hyperlinkError = "The name of the hyperlink cannot be empty.";
            break;
          }

          if (/\[.*\]/.test(match[1])) {
            hyperlinkError =
              "Link name should not contain nested square brackets.";
            break;
          }

          if (
            !match[2].startsWith("http://") &&
            !match[2].startsWith("https://")
          ) {
            hyperlinkError =
              "Hyperlink must begin with 'http://' or 'https://'.";
            break;
          }
        }
      }
    }

    const error = hyperlinkError ? hyperlinkError : textError;

    if (error) {
      setErrors({
        answerTextError: error,
      });
      return;
    }

    if (props.editMode) {
      try {
        await axios.patch(`http://localhost:8000/posts/answers/editAnswer/${props.existingAnswer._id}`, {
          newText: formData.answerText,
        });
        props.onAnswerUpdated();
        props.onEditComplete(props.existingAnswer._id, formData.answerText);
      } catch (error) {
        console.error("Error updating answer:", error);
      }
    } else {
      try {
        await axios.post("http://localhost:8000/posts/answers/answerQuestion", {
          text: formData.answerText,
          ansBy: props.sessionData.username,
          qid: props.questionId,
        });
        props.onAnswerAdded();
      } catch (error) {
        console.error("Error posting answer:", error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      >
        <form onSubmit={handleFormSubmit} noValidate>
          <Typography component="h1" variant="h5">
            Answer Text*
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="answerTextBox"
            name="answerText"
            autoComplete="answer-text"
            autoFocus
            multiline
            rows={4}
            value={formData.answerText}
            onChange={handleInputChange}
            error={Boolean(errors.answerTextError)}
            helperText={errors.answerTextError}
          />
          <Typography variant="h6" gutterBottom>
            Username
          </Typography>
          <TextField
            fullWidth
            id="usernameTextBox"
            name="username"
            value={props.sessionData.username}
            disabled
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, padding: "10px" }}
          >
            Submit Answer
          </Button>
          <Typography variant="body2" color="red" align="right" fontSize={25}>
            *Indicates mandatory fields
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default AnswerForm;