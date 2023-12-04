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
  TextField,
  Card,
  CardContent,
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
  const [commentsData, setCommentsData] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [commentError, setCommentError] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [currentCommentPage, setCurrentCommentPage] = useState({});

  const questionsPerPage = 5;
  const commentsPerPage = 3;

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

  // Fetch comments for all loaded questions
  const fetchCommentsForQuestions = async () => {
    for (const question of questionsData) {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/comments/byQuestion/${question._id}`
        );
        const sortedComments = response.data.sort((a, b) => {
          return new Date(b.com_date_time) - new Date(a.com_date_time);
        });
        setCommentsData((prevComments) => ({
          ...prevComments,
          [question._id]: sortedComments,
        }));
      } catch (error) {
        console.error(
          "Error fetching comments for question with ID:",
          question._id,
          error
        );
      }
    }
  };

  useEffect(() => {
    if (questionsData.length > 0) {
      fetchCommentsForQuestions();
    }
  }, [questionsData]);

  const handleCommentChange = (e, questionId) => {
    setNewCommentText({
      ...newCommentText,
      [questionId]: e.target.value,
    });

    if (commentError[questionId]) {
      setCommentError({ ...commentError, [questionId]: "" });
    }
  };

  const isValidComment = (text) => {
    const trimmedText = text.trim();
    return trimmedText.length >= 1 && trimmedText.length <= 140;
  };

  const postComment = async (questionId) => {
    const commentText = newCommentText[questionId] || "";
    if (!isValidComment(commentText)) {
      const errorMessage =
        commentText.trim().length === 0
          ? "Comment cannot be empty"
          : "Comment must be between 1 and 140 characters";
      setCommentError({ ...commentError, [questionId]: errorMessage });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/posts/comments/commentQuestion",
        {
          text: newCommentText[questionId],
          username: sessionData.username,
          questionId: questionId,
        }
      );

      if (response.status === 201) {
        const newComment = response.data;
        setCommentsData((prevComments) => ({
          ...prevComments,
          [questionId]: [...(prevComments[questionId] || []), newComment],
        }));

        setNewCommentText({ ...newCommentText, [questionId]: "" });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
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

  const handleUpvoteComment = async (commentId) => {
    if (!sessionData.loggedIn) {
      console.log("User must be logged in to vote");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/comments/upvoteComment/${commentId}`,
        { username: sessionData.username }
      );

      if (response.status === 200) {
        const questionId = Object.keys(commentsData).find((key) =>
          commentsData[key].some((comment) => comment._id === commentId)
        );

        if (questionId) {
          const updatedComments = commentsData[questionId].map((comment) => {
            if (comment._id === commentId) {
              return { ...comment, votes: response.data.votes };
            }
            return comment;
          });

          setCommentsData({
            ...commentsData,
            [questionId]: updatedComments,
          });
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleNextCommentPage = (questionId) => {
    setCurrentCommentPage((prevPages) => {
      const maxPage =
        Math.ceil(commentsData[questionId]?.length / commentsPerPage) - 1;
      return {
        ...prevPages,
        [questionId]: Math.min((prevPages[questionId] || 0) + 1, maxPage),
      };
    });
  };

  const handlePrevCommentPage = (questionId) => {
    setCurrentCommentPage((prevPages) => ({
      ...prevPages,
      [questionId]: Math.max(0, (prevPages[questionId] || 0) - 1),
    }));
  };

  const startIndex = currentPage * questionsPerPage;
  const displayedQuestions = questionsData.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  return (
    <Box sx={{ width: "99%" }}>
      <Box
        sx={{
          width: "100%",
          marginTop: "120px",
          marginLeft: "15px",
          overflow: "auto",
          height: "600px",
        }}
      >
        <Table sx={{ width: "100%" }}>
          <TableBody>
            {displayedQuestions.length > 0 ? (
              displayedQuestions.map((question, index) => (
                <React.Fragment key={index}>
                  <TableRow
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
                            disabled={!sessionData.loggedIn}
                          >
                            <ThumbUp />
                          </IconButton>
                          <Typography variant="body2">
                            {question.votes}
                          </Typography>
                          <IconButton
                            onClick={() => handleVote(question._id, "downvote")}
                            size="small"
                            disabled={!sessionData.loggedIn}
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
                  <TableRow>
                    <TableCell colSpan={6}>
                      {commentsData[question._id]
                        ?.slice(
                          (currentCommentPage[question._id] || 0) *
                            commentsPerPage,
                          ((currentCommentPage[question._id] || 0) + 1) *
                            commentsPerPage
                        )
                        .map((comment) => (
                          <Card
                            key={comment._id}
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                          >
                            <CardContent>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    marginRight: 2,
                                  }}
                                >
                                  <IconButton
                                    onClick={() =>
                                      handleUpvoteComment(comment._id)
                                    }
                                    disabled={!sessionData.loggedIn}
                                    size="small"
                                  >
                                    <ThumbUp />
                                  </IconButton>
                                  <Typography variant="body2">
                                    {comment.votes}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ flexGrow: 1 }}
                                >
                                  {comment.text}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  color="gray"
                                  sx={{
                                    fontWeight: "bold",
                                    textAlign: "right",
                                  }}
                                >
                                  commented by {comment.com_by.username}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={newCommentText[question._id] || ""}
                        onChange={(e) => handleCommentChange(e, question._id)}
                        placeholder="Write a comment..."
                        multiline
                        disabled={!sessionData.loggedIn}
                        error={!!commentError[question._id]}
                        helperText={commentError[question._id]}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => postComment(question._id)}
                        disabled={!sessionData.loggedIn}
                        sx={{ marginTop: "20px" }}
                      >
                        Post Comment
                      </Button>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Button
                          onClick={() => handlePrevCommentPage(question._id)}
                          disabled={
                            currentCommentPage[question._id] === 0 ||
                            commentsData[question._id]?.length <=
                              commentsPerPage
                          }
                          sx={{ marginLeft: "700px" }}
                        >
                          Prev
                        </Button>
                        <Button
                          onClick={() => handleNextCommentPage(question._id)}
                          disabled={
                            commentsData[question._id]?.length <=
                              commentsPerPage ||
                            ((currentCommentPage[question._id] || 0) + 1) *
                              commentsPerPage >=
                              commentsData[question._id]?.length
                          }
                          sx={{ marginRight: "700px" }}
                        >
                          Next
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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
