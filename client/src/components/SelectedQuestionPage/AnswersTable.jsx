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
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import AnswerForm from "../AnswerForm/AnswerForm";

const AnswersTable = ({
  questionId,
  onAnswerPress,
  sessionData,
  filteredAnswers,
  onBack,
}) => {
  const [answers, setAnswers] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [commentsData, setCommentsData] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const answersPerPage = 5;
  const commentsPerPage = 3;
  const [currentCommentPage, setCurrentCommentPage] = useState({});
  const [commentError, setCommentError] = useState({});
  const [editingAnswerId, setEditingAnswerId] = useState(null);

  const helper = new Helper();

  const isFilteredView = filteredAnswers && filteredAnswers.length > 0;

  useEffect(() => {
    if (filteredAnswers && filteredAnswers.length > 0) {
      setAnswers(filteredAnswers);
      const newCommentsData = {};
      filteredAnswers.forEach((answer) => {
        newCommentsData[answer._id] = answer.comments;
      });
      setCommentsData(newCommentsData);
    } else {
      axios
        .get(`http://localhost:8000/posts/answers/${questionId}`)
        .then((response) => {
          setAnswers(response.data);
          fetchCommentsForAnswers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching answers:", error);
        });
    }
  }, [questionId, filteredAnswers]);

  const fetchCommentsForAnswers = async (answers) => {
    for (const answer of answers) {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/comments/byAnswer/${answer._id}`
        );
        const sortedComments = response.data.sort(
          (a, b) => new Date(b.com_date_time) - new Date(a.com_date_time)
        );
        setCommentsData((prevComments) => ({
          ...prevComments,
          [answer._id]: sortedComments,
        }));
      } catch (error) {
        console.error(
          "Error fetching comments for answer with ID:",
          answer._id,
          error
        );
      }
    }
  };

  const postCommentOnAnswer = async (answerId) => {
    const commentText = newCommentText[answerId] || "";

    if (sessionData.reputation < 50) {
      setCommentError({
        ...commentError,
        [answerId]: "You need a reputation of at least 50 to post comments.",
      });
      return;
    }

    if (!commentText.trim()) {
      setCommentError({
        ...commentError,
        [answerId]: "Comment cannot be empty.",
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/posts/comments/commentAnswer`,
        {
          text: commentText,
          username: sessionData.username,
          answerId: answerId,
        }
      );

      if (response.status === 201) {
        const newCommentWithUsername = {
          ...response.data,
          com_by: { username: sessionData.username },
        };
        const updatedComments = [
          newCommentWithUsername,
          ...(commentsData[answerId] || []),
        ];
        setCommentsData({ ...commentsData, [answerId]: updatedComments });
        setNewCommentText({ ...newCommentText, [answerId]: "" });
        setCommentError({ ...commentError, [answerId]: "" });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleUpvoteComment = async (commentId, answerId) => {
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
        const updatedComments = commentsData[answerId].map((comment) => {
          if (comment._id === commentId) {
            return { ...comment, votes: response.data.votes };
          }
          return comment;
        });

        setCommentsData({
          ...commentsData,
          [answerId]: updatedComments,
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

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

  const handleEditAnswer = (answerId) => {
    setEditingAnswerId(answerId);
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await axios.delete(
        `http://localhost:8000/posts/answers/deleteAnswer/${answerId}`,
        {
          data: { questionId: questionId },
        }
      );
      setAnswers(answers.filter((answer) => answer._id !== answerId));
    } catch (error) {
      console.error("Error deleting answer:", error);
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

  const handleAnswerEditComplete = (answerId, newText) => {
    setAnswers(
      answers.map((answer) => {
        if (answer._id === answerId) {
          return { ...answer, text: newText };
        }
        return answer;
      })
    );
  };

  if (editingAnswerId) {
    const existingAnswer = answers.find(
      (answer) => answer._id === editingAnswerId
    );
    return (
      <AnswerForm
        sessionData={sessionData}
        questionId={questionId}
        editMode={true}
        existingAnswer={existingAnswer}
        onAnswerUpdated={() => setEditingAnswerId(null)}
        onEditComplete={handleAnswerEditComplete} 
      />
    );
  }

  return (
    <Box sx={{ width: "91.66%", marginY: 6, marginLeft: "200px" }}>
      <Box sx={{ overflow: "auto", height: "305px", mb: 2 }}>
        <Table sx={{ width: "100%", borderCollapse: "collapse" }}>
          <TableBody>
            {displayedAnswers.map((answer) => (
              <React.Fragment key={answer._id}>
                <TableRow
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
                    <Box
                      sx={{ display: "flex", flexDirection: "column", mr: 2 }}
                    >
                      <IconButton
                        onClick={() => handleVote(answer._id, "upvote")}
                        size="small"
                        disabled={!sessionData.loggedIn || isFilteredView}
                      >
                        <ThumbUp />
                      </IconButton>
                      <Typography variant="body2" sx={{ textAlign: "center" }}>
                        {answer.votes}
                      </Typography>
                      <IconButton
                        onClick={() => handleVote(answer._id, "downvote")}
                        size="small"
                        disabled={!sessionData.loggedIn || isFilteredView}
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
                      {isFilteredView && (
                        <Box>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEditAnswer(answer._id)}
                            sx={{ marginRight: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleDeleteAnswer(answer._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </List>
                  </TableCell>
                </TableRow>
                {commentsData[answer._id]
                  ?.slice(
                    (currentCommentPage[answer._id] || 0) * commentsPerPage,
                    ((currentCommentPage[answer._id] || 0) + 1) *
                      commentsPerPage
                  )
                  .map((comment) => (
                    <TableRow key={comment._id}>
                      <TableCell colSpan={6}>
                        <Card variant="outlined" sx={{ marginBottom: 2 }}>
                          <CardContent>
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
                                  onClick={() =>
                                    handleUpvoteComment(comment._id, answer._id)
                                  }
                                  disabled={
                                    !sessionData.loggedIn || isFilteredView
                                  }
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
                                  textAlign: "left",
                                  marginRight: "30px",
                                }}
                              >
                                commented by {comment.com_by.username}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  ))}

                <TableRow>
                  <TableCell colSpan={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      error={!!commentError[answer._id]}
                      helperText={commentError[answer._id]}
                      value={newCommentText[answer._id] || ""}
                      onChange={(e) =>
                        setNewCommentText({
                          ...newCommentText,
                          [answer._id]: e.target.value,
                        })
                      }
                      placeholder="Write a comment..."
                      multiline
                      disabled={!sessionData.loggedIn || isFilteredView}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => postCommentOnAnswer(answer._id)}
                      sx={{ marginTop: "20px", marginLeft: "20px" }}
                      disabled={!sessionData.loggedIn || isFilteredView}
                    >
                      Post Comment
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{
                      display: "flex",
                      mt: 2,
                      borderBottom: "none",
                    }}
                  >
                    <Button
                      onClick={() =>
                        setCurrentCommentPage({
                          ...currentCommentPage,
                          [answer._id]: Math.max(
                            0,
                            (currentCommentPage[answer._id] || 0) - 1
                          ),
                        })
                      }
                      disabled={
                        currentCommentPage[answer._id] === 0 ||
                        (commentsData[answer._id]?.length || 0) <=
                          commentsPerPage
                      }
                      sx={{ paddingLeft: "775px" }}
                    >
                      Prev
                    </Button>
                    <Button
                      onClick={() =>
                        setCurrentCommentPage({
                          ...currentCommentPage,
                          [answer._id]:
                            (currentCommentPage[answer._id] || 0) + 1,
                        })
                      }
                      disabled={
                        ((currentCommentPage[answer._id] || 0) + 1) *
                          commentsPerPage >=
                        (commentsData[answer._id]?.length || 0)
                      }
                    >
                      Next
                    </Button>
                  </TableCell>
                </TableRow>
              </React.Fragment>
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
        {isFilteredView ? (
          // Show 'Back' button in filtered view
          <Button
            variant="contained"
            color="primary"
            onClick={onBack}
            sx={{
              width: 150,
              padding: "10px",
              textTransform: "none",
              marginTop: "20px",
              marginRight: "1425px",
            }}
          >
            Back
          </Button>
        ) : sessionData.loggedIn ? (
          // Show 'Answer Question' button otherwise
          <Button
            variant="contained"
            color="primary"
            onClick={onAnswerPress}
            sx={{
              width: 150,
              padding: "10px",
              textTransform: "none",
              marginTop: "20px",
              marginRight: "1425px",
            }}
          >
            Answer Question
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};

export default AnswersTable;