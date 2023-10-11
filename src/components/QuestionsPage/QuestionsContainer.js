import React from 'react'
import "../../stylesheets/QuestionContainer.css"
import QuestionTop from './QuestionTop'
import QuestionTable from './QuestionTable'

const QuestionsContainer = () => {
  return (
    <div className='questionContainer'>
      <QuestionTop />
      <QuestionTable />
    </div>
  )
}

export default QuestionsContainer
