import React, { useState, useEffect } from "react";
import axios from "axios";
import TagsTop from "./TagsTop";
import QuestionsForm from "../QuestionsForm/QuestionsForm";
import TagsTable from "./TagsTable";
import QuestionsPage from "../QuestionsPage/QuestionsPage";
import { Box, styled } from "@mui/material";

const TagsContainer = styled(Box)(({ theme }) => ({
  width: "89.21%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  marginLeft: "200px",
  marginTop: "75px",
}));

const TagsPage = ({sessionData}) => {
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const handleAskQuestionPress = () => {
    setShowQuestionsForm(true);
  };

  const handleTagSelected = (tagName) => {
    axios
      .get(`http://localhost:8000/posts/tags/${tagName}`)
      .then((response) => {
        const tag = response.data[0];
        if (tag && tag._id) {
          return axios.get(
            `http://localhost:8000/posts/tags/tag_id/${tag._id}/questions`
          );
        } else {
          throw new Error("Tag not found");
        }
      })
      .then((response) => {
        setFilteredQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions for tag:", error);
      });
  };

  useEffect(() => {
    if (selectedTag) {
      handleTagSelected(selectedTag);
    }
  }, [selectedTag]);

  if (showQuestionsForm) {
    return <QuestionsForm sessionData={sessionData} />;
  }

  if (selectedTag && filteredQuestions.length > 0) {
    return <QuestionsPage selectedTag={selectedTag} sessionData={sessionData} />;
  }

  return (
    <TagsContainer>
      <TagsTop onAskQuestionPress={handleAskQuestionPress} sessionData={sessionData} />
      <TagsTable onTagSelected={setSelectedTag} sessionData={sessionData} />
    </TagsContainer>
  );
};

export default TagsPage;
