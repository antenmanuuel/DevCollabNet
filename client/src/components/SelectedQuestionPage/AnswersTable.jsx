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
} from "@mui/material";

const AnswersTable = ({ questionId }) => {
  const [answers, setAnswers] = useState([]);
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

  return (
    <Box
      sx={{
        width: "91.66%",
        marginLeft: "210px",
        marginY: 6,
        overflow: "auto",
      }}
    >
      <Table sx={{ width: "100%", borderCollapse: "collapse" }}>
        <TableBody>
          {answers.map((answer) => (
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
                    {answer.ans_by}
                  </ListItem>
                  <ListItem sx={{ color: "text.secondary" }}>
                    answered {helper.formatDate(new Date(answer.ans_date_time))}
                  </ListItem>
                </List>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AnswersTable;
