import React, { useState, useEffect } from "react";
import axios from "axios";
import Helper from "../../utils/Helper";
import { Box, Typography, Chip } from "@mui/material";

const QuestionDetail = ({ questionId }) => {
  const [question, setQuestion] = useState(null);
  const [tagMap, setTagMap] = useState({});
  const helper = new Helper();

  useEffect(() => {
    // Fetch tags and create a tag map
    axios
      .get("http://localhost:8000/posts/tags")
      .then((tagResponse) => {
        const newTagMap = {};
        tagResponse.data.forEach((tag) => {
          newTagMap[tag._id] = tag.name;
        });
        setTagMap(newTagMap);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
    axios
      .get(`http://localhost:8000/posts/questions/${questionId}`)
      .then((response) => {
        setQuestion(response.data);
      })
      .catch((error) => {
        console.error("Error fetching question details:", error);
      });
  }, [questionId]);

  return (
    <Box
      sx={{
        marginTop: 4,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          width: "1750px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", paddingLeft: 28 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: "gray.600", fontWeight: "bold" }}
          >
            {question && `${question.votes} votes`}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "gray.600", fontWeight: "bold" }}
          >
            {question && `${question.views} views`}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ flexGrow: 1, paddingLeft: 10 }}>
          {question && helper.renderTextWithLinks(question.text)}
        </Typography>

        <Box sx={{ color: "gray.500", paddingLeft: 10 }}>
          <Typography variant="subtitle2" color={"gray"}>
            asked by{" "}
            <Chip
              label={question && question.asked_by.username}
              size="small"
              sx={{
                border: "none",
                backgroundColor: "transparent",
                color: "red",
                "& .MuiChip-label": {
                  padding: 0.5,
                },
              }}
            />
            {question && helper.formatDate(new Date(question.ask_date_time))}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          paddingLeft: 45,
          marginTop: 2,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {question &&
          question.tags.map((tagId, index) => (
            <Chip
              key={index}
              label={tagMap[tagId] || "Unknown Tag"}
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
    </Box>
  );
};

export default QuestionDetail;
