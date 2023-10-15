import React, { useState } from 'react';
import "../../stylesheets/TagsPage.css";
import TagsTop from './TagsTop';
import QuestionsForm from '../QuestionsForm/QuestionsForm'; // Assuming this is the correct import path

const TagsPage = () => {
  const [showQuestionsForm, setShowQuestionsForm] = useState(false);

  const handleAskQuestionPress = () => {
    setShowQuestionsForm(true);
  };

  if (showQuestionsForm) {
    return <QuestionsForm />;
  }

  return (
    <div className='tagsContainer'>
      <TagsTop onAskQuestionPress={handleAskQuestionPress} />
    </div>
  );
}

export default TagsPage;
