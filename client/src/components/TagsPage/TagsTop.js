import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../stylesheets/TagsTop.css";
import AskQuestionButton from '../QuestionsPage/AskQuestionButtonForHomePage';

const TagsTop = ({ onAskQuestionPress }) => {
  const [numOfTags, setNumOfTags] = useState(0);

  useEffect(() => {
    //fetch tags from the server
    axios.get('http://localhost:8000/posts/tags')
      .then(response => {
        setNumOfTags(response.data.length);
      })
      .catch(error => {
        console.error('Error fetching tags:', error);
      });
  }, []); 

  return (
    <div className='tagsTop'>
      <h1 id='numTags'>{numOfTags} Tags</h1>
      <h2 id='allTags'> All Tags</h2>
      <AskQuestionButton onPress={onAskQuestionPress} />
    </div>
  );
}

export default TagsTop;