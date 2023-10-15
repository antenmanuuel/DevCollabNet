import React, { useEffect, useState } from 'react';
import "../../stylesheets/QuestionTop.css";
import AskQuestionButton from './AskQuestionButtonForHomePage';
import Filter from './Filter';

const QuestionTop = ({ numOfQuestions, onAskQuestionPress }) => {
  const [questionCount, setQuestionCount] = useState(numOfQuestions);

  useEffect(() => {
    setQuestionCount(numOfQuestions);
  }, [numOfQuestions]);

  return (
    <div className='questionTop'>
        <h1 id='allQuestionID'>All Question</h1>
        <AskQuestionButton onPress={onAskQuestionPress}/>
        <h4 id='numQuestion'> {questionCount} Questions</h4>
        <Filter />
    </div>
  );
}

export default QuestionTop;
