import React, { useEffect, useState, useCallback } from "react";
import Helper from "../../utils/Helper";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Typography,
  Chip,
} from "@mui/material";

const QuestionTable = ({
  filter,
  onQuestionTitleClick,
  selectedTag,
  searchTerm,
}) => {
  const [questionsData, setQuestionData] = useState([]);

  const fetchQuestions = useCallback(async () => {
    const helper = new Helper();
    let endpoint = "http://localhost:8000/posts/questions";

    if (selectedTag) {
      endpoint = `http://localhost:8000/posts/tags/tag_id/${selectedTag}/questions`;
    }

    if (filter) {
      switch (filter) {
        case "newest":
          endpoint += "/newest";
          break;
        case "active":
          endpoint += "/active";
          break;
        case "unanswered":
          endpoint += "/unanswered";
          break;
        default:
          break;
      }
    }

    try {
      const tagResponse = await axios.get("http://localhost:8000/posts/tags");
      const tagMap = {};
      tagResponse.data.forEach((tag) => {
        tagMap[tag._id] = tag.name;
      });

      const questionResponse = await axios.get(endpoint);
      let filteredQuestions = questionResponse.data;

      if (searchTerm) {
        filteredQuestions = await helper.filterQuestionsBySearchTerm(
          searchTerm,
          filteredQuestions
        );
      }

      const processedQuestions = filteredQuestions.map((question) => ({
        ...question,
        tagNames: question.tags.map((tagId) => tagMap[tagId] || "Unknown Tag"),
        formattedDate: helper.formatDate(new Date(question.ask_date_time)),
      }));

      setQuestionData(processedQuestions);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [filter, selectedTag, searchTerm]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleQuestionTitleClickLocal = (questionId) => {
    axios
      .patch(
        `http://localhost:8000/posts/questions/incrementViews/${questionId}`
      )
      .then(() => {
        setQuestionData((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === questionId
              ? { ...question, views: question.views + 1 }
              : question
          )
        );
        if (onQuestionTitleClick) {
          onQuestionTitleClick(questionId);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "120px",
        marginLeft: "15px",
        overflow: "auto",
        height: "500px",
      }}
    >
      <Table sx={{ width: "100%" }}>
        <TableBody>
          {questionsData.length > 0 ? (
            questionsData.map((question, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  borderBottom: 4,
                  borderTop: 4,
                  borderColor: "grey.500",
                  borderStyle: "dotted",
                }}
              >
                <TableCell align="left">
                  <Typography color={"gray"}>
                    {question.answers.length} answers
                  </Typography>
                  <Typography color={"gray"}>{question.views} views</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography
                    onClick={() => handleQuestionTitleClickLocal(question._id)}
                    sx={{ cursor: "pointer", color: "blue", fontSize: "large" }}
                  >
                    {question.title}
                  </Typography>
                  <Box>
                    {question.tagNames.map((tagName, id) => (
                      <Chip
                        key={id}
                        label={tagName}
                        sx={{
                          marginRight: "10px",
                          marginBottom: "10px",
                          backgroundColor: "grey",
                          color: "white",
                          borderRadius: "4px",
                          fontSize: "18px",
                        }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Typography color="error">{question.asked_by}</Typography>
                  <Typography
                    color={"gray"}
                  >{`asked ${question.formattedDate}`}</Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                borderTop: 4,
                borderColor: "grey.500",
                borderStyle: "dotted",
              }}
            >
              <TableCell colSpan={3}>
                <Typography>No questions found</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default QuestionTable;
