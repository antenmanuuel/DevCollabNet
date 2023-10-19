import React, { useState } from 'react';
import "../../stylesheets/TagsPage.css";
import TagsTop from './TagsTop';
import QuestionsForm from '../QuestionsForm/QuestionsForm'; // Assuming this is the correct import path
import TagsTable from './TagsTable';
import Model from '../../models/model';
import QuestionsPage from '../QuestionsPage/QuestionsPage'; // Make sure to import the QuestionsPage component

const TagsPage = () => {
  const model = Model.getInstance();
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null); // Keep track of the selected tag

  const handleAskQuestionPress = () => {
    setShowQuestionsForm(true);
  };

  const handleTagSelected = (tagName) => {
    setSelectedTag(tagName);
  };

  if (showQuestionsForm) {
    return <QuestionsForm />;
  }

  // If a tag has been selected, show the QuestionsPage filtered by the selected tag
  if (selectedTag) {
    const filteredQuestions = model.getAllQuestions().filter(q => 
      q.tagIds.includes(model.getTagIdByName(selectedTag))
    );
    // Return the QuestionsPage component and pass the filtered questions as a prop
    return <QuestionsPage questions={filteredQuestions} />;
  }

  return (
    <div className='tagsContainer'>
      <TagsTop onAskQuestionPress={handleAskQuestionPress} />
      <TagsTable onTagSelected={handleTagSelected} />
    </div>
  );
}

export default TagsPage;