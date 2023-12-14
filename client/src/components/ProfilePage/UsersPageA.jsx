import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import UserAnswersDetail from "./UserAnswerDetails";

const UsersPageA = ({ goTags, goQuestions, goAnswers, current }) => {
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "",
    email: "",
    created_at: "",
  });

  const [userQuestions, setUserQuestions] = useState([]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/session");
        if (response.data && response.data.loggedIn) {
          setSessionData({
            loggedIn: true,
            username: response.data.username,
            email: response.data.email,
            created_at: response.data.created_at,
            reputation: response.data.reputation,
          });
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, []);

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/posts/questions/byUsername/${sessionData.username}`
        );
        setUserQuestions(response.data);
      } catch (error) {
        console.error("Error fetching user's questions:", error);
      }
    };

    if (sessionData.username) {
      fetchUserQuestions();
    }
  }, [sessionData.username]);

  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [answersData, setAnswersData] = useState([]);
  const [currentAnswerPage, setCurrentAnswerPage] = useState(0);
  const [currentCommentPage, setCurrentCommentPage] = useState({});

  const answersPerPage = 5;
  const commentsPerPage = 3;

  const handleQuestionClick = async (questionId) => {
    setSelectedQuestionId(questionId);
    try {
      const response = await axios.get(
        `http://localhost:8000/posts/questions/answers/byQuestion/${questionId}`
      );
      console.log("Fetched answers:", response.data);
      setAnswersData(response.data);
    } catch (error) {
      console.error("Error fetching answers and comments:", error);
    }
  };

  const handleBackToQuestions = () => {
    setSelectedQuestionId(null);
  };


  const formatDate = (postTime) => {
    const now = new Date();
    const diffInSeconds = (now - new Date(postTime)) / 1000;

    if (diffInSeconds < 60) {
      return `${Math.round(diffInSeconds)} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.round(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.round(diffInSeconds / 3600)} hours ago`;
    } else {
      return new Date(postTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const memberSince = sessionData.created_at
    ? formatDate(new Date(sessionData.created_at))
    : "Loading...";


   
if (selectedQuestionId) {
  return (
    <UserAnswersDetail
      answersData={answersData}
      currentAnswerPage={currentAnswerPage}
      setCurrentAnswerPage={setCurrentAnswerPage}
      currentCommentPage={currentCommentPage}
      setCurrentCommentPage={setCurrentCommentPage}
      handleBackToQuestions={handleBackToQuestions}
      sessionData={sessionData}
    />
  );
}

// ... rest of your UsersPageQ component ...


  return (
    <Box
      sx={{
        width: "85.3%",
        paddingBottom: 5,
        position: "absolute",
        border: 3,
        borderColor: "black",
        borderStyle: "dotted",
        left: "275.5px",
        height: "900px",
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0,
        borderBottom: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          left: "275.5px",
          border: 3,
          borderTop: 0,
          borderRight: 0,
          borderLeft: 0,
          borderStyle: "dotted",
          height: "175px",
        }}
      >
        {/* User Profile Information */}
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            top: "10px",
            left: "30px",
            fontSize: "25px",
            fontWeight: "bolder",
          }}
        >
          User Profile:{" "}
          {sessionData.loggedIn ? sessionData.username : "Loading..."}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: "50px",
            left: "30px",
            fontSize: "18px",
          }}
        >
          Member for: {memberSince}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            position: "absolute",
            top: "90px",
            left: "30px",
            fontSize: "15px",
          }}
        >
          Reputation Score:{" "}
          {sessionData.loggedIn ? sessionData.reputation : "Loading..."}
        </Typography>
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: "130px",
            left: "550px",
            fontSize: "18px",
            fontWeight: "bolder",
          }}
        >
          All Questions with {current} created by {sessionData.username}
        </Typography>
      </Box>

      {/* {selectedQuestionId ? (
        // Render answers and comments for a selected question
        <Box sx={{mt:4}}>
          {renderAnswersAndComments()}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button
              onClick={() =>
                setCurrentAnswerPage(Math.max(0, currentAnswerPage - 1))
              }
              disabled={currentAnswerPage === 0}
            >
              Prev Answer
            </Button>
            <Button
              onClick={() => setCurrentAnswerPage(currentAnswerPage + 1)}
              disabled={
                (currentAnswerPage + 1) * answersPerPage >= answersData.length
              }
            >
              Next Answer
            </Button>
          </Box>
          <Button onClick={handleBackToQuestions} sx={{ marginTop: 2 }}>
            Back to Questions
          </Button>
        </Box> */}
      {/* ) : ( */}
        <Box mt={4}>
        <Table sx={{ width: "100%" }}>
          <TableBody>
            {userQuestions.map((question) => (
              <React.Fragment key={question._id}>
                <TableRow sx={{ borderBottom: "3px dotted" }}>
                  <TableCell sx={{ width: "65%" }}>
                    <Typography
                      sx={{
                        cursor: "pointer",
                        color: "blue",
                        fontSize: "large",
                      }}
                      onClick={() => handleQuestionClick(question._id)}
                    >
                      {question.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: "17.5%" }}>
                    <Typography sx={{ color: "gray", fontSize: "medium" }}>
                      asked {formatDate(question.ask_date_time)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        </Box>
      {/* )} */}
      <Box
        sx={{
          width: "100%",
          paddingBottom: 5,
          position: "absolute",
          border: 3,
          borderColor: "black",
          borderStyle: "dotted",
          bottom: "0px",
          top: "775px",
          borderBottom: 0,
          borderRight: 0,
          borderLeft: 0,
        }}
      >
        <Button
          variant="contained"
          sx={{ marginTop: "5px", marginRight: "5px", left: "350px" }}
          onClick={goTags}
        >
          All Tags Made by{" "}
          {sessionData.loggedIn ? sessionData.username : "Loading..."}
        </Button>
        <Button
          variant="contained"
          sx={{ marginTop: "5px", left: "350px" }}
          onClick={goAnswers}
        >
          Questions with Answers By{" "}
          {sessionData.loggedIn ? sessionData.username : "Loading..."}
        </Button>
        <Button
          variant="contained"
          sx={{ marginTop: "5px", left: "355px" }}
          onClick={goQuestions}
        >
          Questions By{" "}
          {sessionData.loggedIn ? sessionData.username : "Loading..."}
        </Button>
      </Box>
    </Box>
  );
};

export default UsersPageA;