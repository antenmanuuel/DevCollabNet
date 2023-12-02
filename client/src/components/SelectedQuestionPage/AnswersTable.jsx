import React, { useEffect, useState } from "react";
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
} from "@mui/material";

const AnswersTable = ({ questionId, onAnswerPress, sessionData }) => {
  const [answers, setAnswers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const answersPerPage = 5; // Number of answers to display per page
  const helper = new Helper();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/posts/answers/${questionId}`)
      .then((response) => {
        const sortedAnswers = response.data.sort(
          (a, b) => new Date(b.ansDate) - new Date(a.ansDate)
        );
        setAnswers(sortedAnswers);
      })
      .catch((error) => {
        console.error("Error fetching answers:", error);
      });
  }, [questionId]);

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
                    fontWeight: "bold",
                    width: "50%",
                    overflow: "auto",
                    padding: 4,
                  }}
                >
                  {helper.renderTextWithLinks(answer.text)}
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
