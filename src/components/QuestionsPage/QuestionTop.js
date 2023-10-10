import React, { useEffect, useState } from 'react'
import "../../stylesheets/QuestionTop.css"
import AskQuestionButton from './AskQuestionButton'
import Filter from './Filter'

import Model from '../../models/model';
const QuestionTop = () => {
  const model = new Model();
  const [numOfQuestions, setNumOfQuestions] = useState(0);

  useEffect(() => {
    const questions = model.getAllQuestions();
    setNumOfQuestions(questions.length);
  })

  return (
    <div className='questionTop'>
        <h1 id='allQuestionID'>All Question</h1>
        <AskQuestionButton />
        <h4 id='numQuestion'> {numOfQuestions} Questions</h4>
        <Filter />
    </div>
  )
}

export default QuestionTop
