import React, { useEffect, useState } from 'react';
import "../../stylesheets/QuestionTop.css";
import AskQuestionButton from './AskQuestionButtonForHomePage';
import Filter from './Filter';
import axios from 'axios'; 

const QuestionTop = ({ onAskQuestionPress, setFilter, searchTerm }) => {
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    // Fetch the count of all questions using axios
    axios.get('http://localhost:8000/posts/questions')
      .then(response => {
        setQuestionCount(response.data.length);
      })
      .catch(error => {
        console.error("Error fetching all questions count:", error);
      });

  }, []);

  /*
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'unanswered') {
      setQuestionCount(unansweredCount);
    } else {
      setQuestionCount(numOfQuestions);
    }
  }, [setFilter, unansweredCount, numOfQuestions]);
  */

  return (
    <div className='questionTop'>
        <h1 id='allQuestionID'>  {searchTerm ? 'Search Results' : 'All Questions'}</h1>
        <AskQuestionButton onPress={onAskQuestionPress}/>
        <h4 id='numQuestion'>{`${questionCount} Questions`}</h4>
        <Filter onSetFilter={() => {}} /> {/* Temporarily passing an empty function */}
    </div>
  );
}

export default QuestionTop;
