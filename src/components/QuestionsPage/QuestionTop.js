import React, { useEffect, useState, useCallback } from 'react';
import "../../stylesheets/QuestionTop.css";
import AskQuestionButton from './AskQuestionButtonForHomePage';
import Filter from './Filter';
import Model from "../../models/model";

const QuestionTop = ({ numOfQuestions, onAskQuestionPress, setFilter }) => {
  const [questionCount, setQuestionCount] = useState(numOfQuestions);
  const model = Model.getInstance();

  useEffect(() => {
    setQuestionCount(numOfQuestions);
  }, [numOfQuestions]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, [setFilter]);

  return (
    <div className='questionTop'>
        <h1 id='allQuestionID'>All Question</h1>
        <AskQuestionButton onPress={onAskQuestionPress}/>
        <h4 id='numQuestion'> {questionCount} Questions</h4>
        <Filter onSetFilter={handleFilterChange} />
    </div>
  );
}

export default QuestionTop;