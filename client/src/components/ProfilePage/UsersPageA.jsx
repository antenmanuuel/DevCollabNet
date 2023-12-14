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
} from "@mui/material";
import AnswersTable from "../SelectedQuestionPage/AnswersTable";

const UsersPageA = ({ goTags, goQuestions, goAnswers, current }) => {
  const [sessionData, setSessionData] = useState({
    loggedIn: false,
    username: "",
    email: "",
    created_at: "",
  });

  const [userQuestions, setUserQuestions] = useState([]);
  const [userReputation, setUserReputation] = useState(null);


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
    if (sessionData.username) {
      axios.get(`http://localhost:8000/users/userReputation/${sessionData.username}`)
        .then((response) => {
          setUserReputation(response.data.reputation);
        })
        .catch((error) => {
          console.error("Error fetching user reputation:", error);
        });
    }
  }, [sessionData.username]);

  useEffect(() => {
    const fetchUserAnsweredQuestions = async () => {
      try {
       
        const response = await axios.get(
          `http://localhost:8000/posts/questions/questions-answered-by/${sessionData.username}`
        );
        setUserQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions answered by the user:", error);
      }
    };

    if (sessionData.username) {
      fetchUserAnsweredQuestions();
    }
  }, [sessionData.username]); 
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [answersData, setAnswersData] = useState([]);

  const handleQuestionClick = async (questionId) => {
    setSelectedQuestionId(questionId);

    try {
      const response = await axios.get(
        `http://localhost:8000/posts/questions/answers/byQuestion/${questionId}/user/${sessionData.username}`
      );
      console.log("Fetched answers and comments by user:", response.data);
      setAnswersData(response.data);
    } catch (error) {
      console.error("Error fetching answers and comments by user:", error);
    }
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

  const handleBackFromAnswers = () => {
    setSelectedQuestionId(null);
  };
  if (selectedQuestionId) {
    return (
      <AnswersTable
        questionId={selectedQuestionId}
        sessionData={sessionData}
        filteredAnswers={answersData}
        onBack={handleBackFromAnswers}
      />
    );
  }
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
          {userReputation !== null ? userReputation : "Loading..."}
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