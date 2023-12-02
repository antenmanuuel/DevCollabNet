import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Helper from "../../utils/Helper";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  List,
  ListItem,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";

const AnswersTable = ({ questionId, onAnswerPress, sessionData }) => {
  const [answers, setAnswers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const answersPerPage = 5;
  const helper = new Helper();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/posts/answers/${questionId}`)
      .then((response) => {
        setAnswers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching answers:", error);
      });
  }, [questionId]);

  const isUserLoggedIn = sessionData && sessionData.loggedIn;

  const handleVote = async (answerId, voteType) => {

    if (!isUserLoggedIn) {
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/answers/${voteType}/${answerId}`,
        {
          username: sessionData.username,
        }
      );

      if (response.status === 200) {
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) =>
            answer._id === answerId
              ? { ...answer, votes: response.data.votes }
              : answer
          )
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleNext = () => {
    setStartIndex((prev) => {
      const nextIndex = prev + answersPerPage;
      return nextIndex < answers.length ? nextIndex : prev;
    });
  };

  const handlePrev = () => {
    setStartIndex((prev) => {
      const prevIndex = prev - answersPerPage;
      return prevIndex >= 0 ? prevIndex : prev;
    });
  };

  const displayedAnswers = answers.slice(
    startIndex,
    startIndex + answersPerPage
  );

  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + answersPerPage >= answers.length;

  return (
    <Box sx={{ width: "91.66%", marginY: 6, marginLeft: "200px" }}>
      <Box sx={{ overflow: "auto", height: "305px", mb: 2 }}>
        <Table sx={{ width: "100%", borderCollapse: "collapse" }}>
          <TableBody>
            {displayedAnswers.map((answer) => (
              <TableRow
                key={answer._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  borderBottom: 4,
                  borderTop: 4,
                  borderColor: "grey.500",
                  borderStyle: "dotted",
                }}
              >
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", mr: 2 }}>
                    <IconButton
                      onClick={() => handleVote(answer._id, "upvote")}
                      size="small"
                      disabled={!isUserLoggedIn}
                    >
                      <ThumbUp />
                    </IconButton>
                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                      {answer.votes}
                    </Typography>
                    <IconButton
                      onClick={() => handleVote(answer._id, "downvote")}
                      size="small"
                      disabled={!isUserLoggedIn}
                    >
                      <ThumbDown />
                    </IconButton>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    {helper.renderTextWithLinks(answer.text)}
                  </Box>
                </TableCell>
                <TableCell sx={{ paddingLeft: 60 }}>
                  <List sx={{ listStyle: "none", padding: 0 }}>
                    <ListItem sx={{ color: "error.main", paddingBottom: 0 }}>
                      {answer.ans_by.username}
                    </ListItem>
                    <ListItem sx={{ color: "text.secondary" }}>
                      answered{" "}
                      {helper.formatDate(new Date(answer.ans_date_time))}
                    </ListItem>
                  </List>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button onClick={handlePrev} disabled={isPrevDisabled}>
            Prev
          </Button>
          <Button onClick={handleNext} disabled={isNextDisabled}>
            Next
          </Button>
        </Box>
        {sessionData.loggedIn && (
          <Button
            variant="contained"
            color="primary"
            onClick={onAnswerPress}
            sx={{
              width: 150,
              padding: "10px",
              textTransform: "none",
              marginRight: "1450px",
              marginTop: "50px",
            }}
          >
            Answer Question
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AnswersTable;
