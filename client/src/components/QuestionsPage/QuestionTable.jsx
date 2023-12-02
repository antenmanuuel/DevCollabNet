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
  Button,
  IconButton,
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";

const QuestionTable = ({
  filter,
  onQuestionTitleClick,
  selectedTag,
  searchTerm,
  sessionData,
}) => {
  const [questionsData, setQuestionData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;

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

  const handleNext = () => {
    setCurrentPage(
      (prev) => (prev + 1) % Math.ceil(questionsData.length / questionsPerPage)
    );
  };

  const handlePrev = () => {
    setCurrentPage(
      (prev) =>
        (prev - 1 + Math.ceil(questionsData.length / questionsPerPage)) %
        Math.ceil(questionsData.length / questionsPerPage)
    );
  };

  const startIndex = currentPage * questionsPerPage;
  const displayedQuestions = questionsData.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const isUserLoggedIn = sessionData && sessionData.loggedIn;

  const handleVote = async (questionId, voteType) => {
    if (!isUserLoggedIn) {
      return;
    }
    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/questions/${voteType}/${questionId}`,
        {
          username: sessionData.username,
        }
      );

      if (response.status === 200) {
        setQuestionData((prevQuestions) =>
          prevQuestions.map((question) =>
            question._id === questionId
              ? { ...question, votes: response.data.votes }
              : question
          )
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <Box sx={{ width: "99%" }}>
      <Box
        sx={{
          width: "100%",
          marginTop: "120px",
          marginLeft: "15px",
          overflow: "auto",
          height: "320px",
        }}
      >
        <Table sx={{ width: "100%" }}>
          <TableBody>
            {displayedQuestions.length > 0 ? (
              displayedQuestions.map((question, index) => (
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          marginRight: 2,
                        }}
                      >
                        <IconButton
                          onClick={() => handleVote(question._id, "upvote")}
                          size="small"
                          disabled={!isUserLoggedIn}

                        >
                          <ThumbUp />
                        </IconButton>
                        <Typography variant="body2">
                          {question.votes}
                        </Typography>
                        <IconButton
                          onClick={() => handleVote(question._id, "downvote")}
                          size="small"
                          disabled={!isUserLoggedIn}
                        >
                          <ThumbDown />
                        </IconButton>
                      </Box>
                      <div>
                        <Typography color={"gray"}>
                          {question.answers.length} answers
                        </Typography>
                        <Typography color={"gray"}>
                          {question.views} views
                        </Typography>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      onClick={() =>
                        handleQuestionTitleClickLocal(question._id)
                      }
                      sx={{
                        cursor: "pointer",
                        color: "blue",
                        fontSize: "large",
                      }}
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
                    <Typography color="error">
                      {question.asked_by.username}
                    </Typography>
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

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button onClick={handlePrev} disabled={currentPage === 0}>
          Prev
        </Button>
        <Button
          onClick={handleNext}
          disabled={startIndex + questionsPerPage >= questionsData.length}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default QuestionTable;
