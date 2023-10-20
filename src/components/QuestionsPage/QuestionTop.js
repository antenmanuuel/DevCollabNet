import React, { useEffect, useState, useCallback } from 'react';
import "../../stylesheets/QuestionTop.css";
import AskQuestionButton from './AskQuestionButtonForHomePage';
import Filter from './Filter';
import Model from "../../models/model";

const QuestionTop = ({ numOfQuestions, onAskQuestionPress, setFilter, searchTerm }) => {
  const [questionCount, setQuestionCount] = useState(numOfQuestions);
  const [unansweredCount, setUnansweredCount] = useState(0); 

  const model = Model.getInstance();

  useEffect(() => {
    setQuestionCount(numOfQuestions);

    const unansweredQuestionsCount = model.getUnansweredQuestionsCount();
    setUnansweredCount(unansweredQuestionsCount);

  }, [numOfQuestions]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'unanswered') {
      setQuestionCount(unansweredCount);
    } else {
      setQuestionCount(numOfQuestions);
    }
  }, [setFilter, unansweredCount, numOfQuestions]);

  return (
    <div className='questionTop'>
        <h1 id='allQuestionID'>  {searchTerm ? 'Search Results' : 'All Questions'}</h1>
        <AskQuestionButton onPress={onAskQuestionPress}/>
        <h4 id='numQuestion'>{`${questionCount} Questions`}</h4>
        <Filter onSetFilter={handleFilterChange} />
    </div>
  );
}

export default QuestionTop;
