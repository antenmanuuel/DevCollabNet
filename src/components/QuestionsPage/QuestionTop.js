import React from 'react'
import "../../stylesheets/QuestionTop.css"
import AskQuestionButton from './AskQuestionButton'
import Filter from './Filter'
const QuestionTop = () => {
  return (
    <div className='questionTop'>
        <h1 id='allQuestionID'>All Question</h1>
        <AskQuestionButton />
        <h4 id='numQuestion'># Questions</h4>
        <Filter />
    </div>
  )
}

export default QuestionTop
