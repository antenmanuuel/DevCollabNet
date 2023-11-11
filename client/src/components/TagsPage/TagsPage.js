import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../stylesheets/TagsPage.css";
import TagsTop from './TagsTop';
import QuestionsForm from '../QuestionsForm/QuestionsForm';
import TagsTable from './TagsTable';
import QuestionsPage from '../QuestionsPage/QuestionsPage';

const TagsPage = () => {
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const handleAskQuestionPress = () => {
    setShowQuestionsForm(true);
  };

  const handleTagSelected = (tagName) => {
    // Fetch the tag's ID using its name
    axios.get(`http://localhost:8000/posts/tags/${tagName}`)
      .then(response => {
        const tag = response.data[0];  // Assuming the response is an array, take the first element
        if (tag && tag._id) {
          //fetch the questions associated with ID
          return axios.get(`http://localhost:8000/posts/tags/tag_id/${tag._id}/questions`);
        } else {
          throw new Error("Tag not found");
        }
      })
      .then(response => {
        setFilteredQuestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching questions for tag:', error);
      });
  };

  useEffect(() => {
    if (selectedTag) {
      handleTagSelected(selectedTag);
    }
  }, [selectedTag]);

  if (showQuestionsForm) {
    return <QuestionsForm />;
  }

  // If a tag has been selected and there are filtered questions, show the QuestionsPage
  if (selectedTag && filteredQuestions.length > 0) {
    return <QuestionsPage selectedTag={selectedTag} />;
  }

  return (
    <div className='tagsContainer'>
      <TagsTop onAskQuestionPress={handleAskQuestionPress} />
      <TagsTable onTagSelected={setSelectedTag} /> 
    </div>
  );
}

export default TagsPage;